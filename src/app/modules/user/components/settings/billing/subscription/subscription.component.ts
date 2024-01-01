import { Component, OnInit, OnDestroy } from '@angular/core';

// SEO
import { Title } from '@angular/platform-browser';

// rxjs
import { Subscription } from 'rxjs';

// SERVICES
import { UserAPIService, LocalStorage, SubscriptionAPIService, PlanAPIService, SessionStorage } from '../../../../../../shared/services';

// INTERFACES
import { ISubscription } from '../../../../../../shared/interfaces';

@Component({
	moduleId: module.id,
	selector: 'settings-subscription',
	templateUrl: 'subscription.component.html'
})

// CLASS
export class SettingsBillingSubscriptionComponent implements OnInit, OnDestroy {
	currentPlan: ISubscription;
	planLimit: any;

	private _subscriptions: any = new Subscription();

	constructor(
		private _userService: UserAPIService,
		private _localStorage: LocalStorage,
		private _planService: PlanAPIService,
		private _subscriptionService: SubscriptionAPIService,
		private _sessionStorage: SessionStorage,
		title: Title) {
		title.setTitle('Subscription - grceri');
	}

	ngOnInit() {
		this._getUserPlan();
		this._getUserPlanLimit();
		this._refreshPlanLimit();
	}

	ngOnDestroy() {
		this._subscriptions.unsubscribe();
	}

	private _refreshPlanLimit(){
		let userId: number = this._localStorage.get('userId');
		this._subscriptions.add(this._subscriptionService.processSubscriptionAPI(userId).subscribe((res: any) => res));

		if(this._sessionStorage.get('refreshPlanLimit') !== null){
			this._subscriptions.add(this._planService.processPlanLimits(userId).subscribe((res) => {
				this._sessionStorage.remove('refreshPlanLimit');
			}));
		}
	}

	private _getUserPlan() {
		this._subscriptions.add(this._subscriptionService.getSubscription().subscribe(
			(res: ISubscription) => {
				if (res) {
					this.currentPlan = res;
				}
			},
			(err) => err))
	}

	private _getUserPlanLimit() {
		let planLimit$ = this._planService.getPlanLimits();

		this._subscriptions.add(planLimit$.subscribe((res) => {
			if (res) {
				this.planLimit = res;
			}
		}))
	}

	updatePlan($event: any) {
		let userId: number = this._localStorage.get('userId');

		this.currentPlan = $event;

		this._subscriptions.add(this._userService.processProfileInformation(userId).subscribe((res) => res));
		this._subscriptions.add(this._planService.processPlanLimits(userId).subscribe((res) => res));

		this._subscriptionService.subscription$.next($event);

		this._getUserPlan();
		this._getUserPlanLimit();
	}
}

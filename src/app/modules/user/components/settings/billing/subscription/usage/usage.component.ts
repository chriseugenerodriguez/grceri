import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

// ROUTER
import { Router } from '@angular/router';

// SUBSCRIPTIONS
import { Subscription } from 'rxjs';

// SERVICES
import { ModalService, PaymentAPIService, SubscriptionAPIService, RegisterService, AuthService, LocalStorage } from '../../../../../../../shared/services';

// INTERFACES
import { ISubscription, PaymentMethod } from '../../../../../../../shared/interfaces';

// COMPONENT
@Component({
	moduleId: module.id,
	selector: 'settings-subscription-usage',
	templateUrl: 'usage.component.html',
})

// CLASS
export class SettingsSubscriptionUsageComponent implements OnInit {
	@Input() planLimit: any;
	@Output() latestPlan: EventEmitter<ISubscription> = new EventEmitter();

	private _subscriptions: any = new Subscription();

	// BOOLEAN
	hasPaymentMethods: boolean = false;

	// NUMBER
	id: number = this._localStorage.get('userId');

	config = {
		class: 'modal-popup',
		animated: false,
		backdrop: true,
	};

	userSubscription: any;

	constructor(
		private _modalService: ModalService,
		private _paymentService: PaymentAPIService,
		private _subscriptionService: SubscriptionAPIService,
		private _router: Router,
		private _localStorage: LocalStorage,
		private _authService: AuthService,
		private _registerService: RegisterService
	) { }

	ngOnInit() {
		this._getPaymentMethods();
		this._getUserSubscription();
	}

	private _getUserSubscription() {
		let userSubscription$ = this._subscriptionService.getSubscription();

		this._subscriptions.add(userSubscription$.subscribe((res) => {
			if (res) {
				this.userSubscription = res;
			}
		}));
	}

	isPlanEditDisabled(): boolean {
		let subscriptions = this._registerService.allSubscriptions;
		return subscriptions ? false : true;
	}

	private _getPaymentMethods() {
		let paymentMethods$ = this._paymentService.getPayments();

		this._subscriptions.add(paymentMethods$.subscribe((res) => {
			if (res) {
				let cards: PaymentMethod[] = res.paymentMethods;
				this.hasPaymentMethods = (cards && cards.length) ? true : false;
			}
		}));
	}

	editPlan() {
		if (!this._authService.isAuthenticated()) {
			this._router.navigate(['/login']);
		}

		if (!this.hasPaymentMethods) {
			this._router.navigate(['/user/settings/billing/payment']);
			return false;
		}

		let message: any = this._modalService.processModalAlertInformation('empty-message', 'confirmed');
		this._modalService.data$.next(message);

		this._modalService.openPlanListModal(this.config);
	}

	updatePlan($event: any) {
		if ($event) {
			this.userSubscription = $event.length > 1 ? $event.find((plan: any) => plan.stripePlanId === this.userSubscription.stripePlanId) : $event[0];
			this.latestPlan.emit(this.userSubscription);
		}
	}

	setUsagePercentage(type: string) {
		let perc = 0;

		if (this.planLimit['interactions'][type] === 0) {
			perc = 0;
		} else {
			perc = Number(this.planLimit['interactions'][type] / this.planLimit['planLimits'][type]);

			perc = perc === 1 ? 100 : perc * 100;
		}

		return perc;
	}

	setUsageClass(type: string) {
		let interactions: number = this.planLimit['interactions'][type];
		let planLimits: number = this.planLimit['planLimits'][type];
		let remaining: number = planLimits - interactions;
		let data = '';

		if (interactions === planLimits) {
			data = 'danger';
		} else {
			if (remaining <= 3) {
				data = 'warning';
			}
			if (remaining > 3) {
				data = 'okay';
			}
		}

		return data;
	}
}

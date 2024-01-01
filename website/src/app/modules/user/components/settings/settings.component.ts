import { Component, OnInit, OnDestroy } from '@angular/core';

// SERVICES
import { HttpCancelService, ModalService, AuthService, PaymentAPIService, PlanAPIService, SessionStorage, UserAPIService, LocalStorage } from '../../../../shared/services';

// ROUTER
import { Router } from '@angular/router';

// BOOTSTRAP
import { AlertComponent } from 'ngx-bootstrap/alert';

// SUBSCRIPTIONS
import { Subscription } from 'rxjs';

// ENV
import { environment } from '../../../../../environments/environment';

@Component({
	moduleId: module.id,
	selector: 'settings',
	templateUrl: 'settings.component.html',
	styleUrls: ['settings.component.scss'],
})

// CLASS
export class SettingsComponent implements OnInit, OnDestroy {
	config = {
		class: 'modal-popup',
		animated: false,
		backdrop: true,
	};

	// SUBSCRIPTIONS
	private _subscriptions: any = new Subscription();

	// NUMBER
	id: number = this.LS.get('userId');

	// STRING
	loginType: string = this.LS.get('login_type');
	private _passwordVerification: any = this.SS.get('password_verification');

	// ARRAY
	message: Array<object> = [];

	constructor(private httpCancelService: HttpCancelService,
		private router: Router,
		private _userService: UserAPIService,
		private MS: ModalService,
		private _planAPIService: PlanAPIService,
		private AS: AuthService,
		private _paymentService: PaymentAPIService,
		private _sessionStorage: SessionStorage,
		private SS: SessionStorage,
		private LS: LocalStorage) { }

	ngOnInit() {
		this.MS.data$.next(undefined);

		if (!this.AS.isAuthenticated()) {
			this.router.navigate(['/login']);
		}

		this._processModalResponseInformation();

		this._subscriptions.add(this._paymentService.processPaymentAPI(this.id).subscribe((res: any) => res));

		this._subscriptions.add(this._userService.processProfileInformation(this.id).subscribe((res) => res));

		if (this._passwordVerification === null && this.loginType && this.loginType === 'google') {
			this._verifyJWT();
		}

		this._refreshPlanLimit();
	}

	ngOnDestroy() {
		this.httpCancelService.cancelPendingRequests();
		if (!environment.production && !this.httpCancelService) {
			console.log('canceled pending request');
		}

		if (this._subscriptions) {
			this._subscriptions.unsubscribe();
		}
	}

	private _refreshPlanLimit() {
		if (this._sessionStorage.get('refreshPlanLimit') !== null) {
			this._subscriptions.add(this._planAPIService.processPlanLimits(this.id).subscribe((res) => {
				this._sessionStorage.remove('refreshPlanLimit');
			}));
		}
	}

	private _processModalResponseInformation(): void {
		this._subscriptions.add(this.MS.fetchModalData().subscribe(res => {
			if (res) {
				switch (res.type) {
					case 'empty-message':
						this.message = [];
						break;
					case 'verify-password':
						this.MS.close();

						let expireAt: number = this._getHalfAnHourMilliseconds();

						if (this.id) {
							let data = {
								user: Number(this.id),
								expireAt
							};

							this.SS.set('password_verification', data);
							this._defineModalType();
						}
						break;
					case 'verify-jwt':
						this._verifyJWT();
						break;
					case 'card-added':
						this._message('success', res.value);
						break;
					case 'card-added-error':
						this._message('danger', res.value);
						break;
					case 'card-deleted':
						this._message('success', res.value);
						break;
					case 'card-error':
						this._message('danger', res.value);
						break;
					case 'user-updated':
						this._message('success', res.value);
						break;
					case 'update-billing':
						this._message('success', res.value);
						break;
					case 'update-billing-error':
						this._message('danger', res.value);
						break;
					case 'set-primary-card':
						this._message('success', res.value);
						break;
					case 'subscription-plan-changed':
						this._message('success', res.value);
						break;
					case 'failed-avatar-download':
						this._message('danger', res.value);
						break;
					case 'subscription-error':
						this._message('danger', res.value);
						break;
					case 'cancel-subscription-error-message':
						this._message('danger', res.value);
						break;
					case 'cancel-subscription-success-message':
						this._message('success', res.value);
						break;
				}
			}
		}));
	}

	private _defineModalType() {
		let type: string = this.MS.selectedModal;

		switch (type) {
			case 'CANCEL_SUBSCRIPTION':
				let message: any = this.MS.processModalAlertInformation('confirm-cancel-subscription', 'confirmed');
				this.MS.data$.next(message);
				break;

			default:
				this.MS.openSelectedModal(this.config);
				break;
		}
	}

	private _getHalfAnHourMilliseconds(): number {
		let date: Date = new Date();
		let HALF_AN_HOUR: number = 30 * 60 * 1000;
		let milliseconds: any = new Date(date.getTime() + HALF_AN_HOUR).getTime();
		return milliseconds;
	}

	private _verifyJWT() {
		let jwtToken: string = this.LS.get('jwt_token');

		if (jwtToken === null) {
			this.AS.logout();
		}

		let tokenObject: any = {
			jwt_token: jwtToken
		};

		this._subscriptions.add(this.AS.loginCallback(tokenObject).subscribe((res) => {
			res = JSON.parse(res._body);

			if (res) {
				let userId: number = this.LS.get('userId');
				if (Number(res.user_id) === userId) {
					let message: any = this.MS.processModalAlertInformation('verify-password', 'confirmed');
					this.MS.data$.next(message);
					this.MS.close();
					if (!environment.production) {
						console.log('JWT verified');
					}
				}
			}
		}));
	}

	private _message(a: any, b: any, c: any = '', d: number = 0) {
		this.message.push({
			type: a,
			value: b,
			linkTitle: c,
			listId: d
		})
	}

	private _close(a: AlertComponent) {
		this.message = this.message.filter((i) => i !== a);
	}
}

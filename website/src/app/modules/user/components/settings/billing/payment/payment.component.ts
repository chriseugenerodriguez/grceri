import { Component, OnInit, OnDestroy } from '@angular/core';

// SUBSCRIPTIONS
import { Subscription } from 'rxjs';

// SEO
import { Title } from '@angular/platform-browser';

// SERVICES
import { UserAPIService, PaymentAPIService, SubscriptionAPIService, SessionStorage, LocalStorage } from '../../../../../../shared/services';

// INTERFACES
import { PaymentMethod } from '../../../../../../shared/interfaces';

@Component({
	moduleId: module.id,
	selector: 'settings-billing-payment',
	templateUrl: 'payment.component.html'
})

// CLASS
export class SettingsBillingPaymentComponent implements OnInit, OnDestroy {

	// SUBSCRIPTION
	private _subscriptions: any = new Subscription();

	billing: PaymentMethod[];
	primaryBilling: PaymentMethod;
	due: number;

	constructor(
		title: Title,
		private _userService: UserAPIService,
		private _paymentService: PaymentAPIService,
		private _subscriptionService: SubscriptionAPIService,
		private _sessionStorage: SessionStorage,
		private _localStorage: LocalStorage) {
		title.setTitle('Payment - grceri');
	}

	ngOnInit() {
		this._getPaymentMethods();
	}

	ngOnDestroy() {
		this._subscriptions.unsubscribe();
	}

	private _getPaymentMethods() {
		let paymentMethods$ = this._paymentService.getPayments();

		this._subscriptions.add(paymentMethods$.subscribe((res) => {
			if (res) {
				this.billing = res.paymentMethods;
				this.primaryBilling = this.billing.find((method: PaymentMethod) => method.isPrimary);
				this.due = res.due;
			}
		}))
	}

	updateMethods(data: boolean) {
		if (data) {
			let userId: number = this._localStorage.get('userId');

			this._subscriptions.add(this._userService.getUserPaymentMethods(userId).subscribe((res) => {
				if (res) {
					this._paymentService.payments$.next(res);

					this._getPaymentMethods();
				}
			}));
		}
	}

	resetMethods(data: any) {
		if (data) {
			this._subscriptionService.subscription$.next(data[0]);
			this.due = null;
			this._sessionStorage.set('refreshPlanLimit', true);

			this._updateUserDueToPaid();
		}
	}

	private _updateUserDueToPaid() {
		let paymentMethods$ = this._paymentService.getPayments();

		this._subscriptions.add(paymentMethods$.subscribe((res) => {
			if (res) {
				res.due = null;

				this._paymentService.payments$.next(res);
			}
		}))
	}
}

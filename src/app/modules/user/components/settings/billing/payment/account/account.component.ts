import { Component, OnChanges, OnInit, Input, SimpleChanges, OnDestroy } from '@angular/core';

// ROUTER
import { Router } from '@angular/router';

// SUBSCRIPTIONS
import { Subscription } from 'rxjs';

// SERVICES
import { ModalService, UserAPIService, PaymentAPIService, AuthService, LocalStorage, SessionStorage } from '../../../../../../../shared/services';

// INTERFACES
import { PaymentMethod } from '../../../../../../../shared/interfaces';

// COMPONENT
@Component({
	moduleId: module.id,
	selector: 'settings-billing-payment-account',
	styleUrls: ['account.component.scss'],
	templateUrl: 'account.component.html',
})

// CLASS
export class SettingsBillingPaymentAccountComponent implements OnInit, OnChanges, OnDestroy {
	@Input() billing: PaymentMethod[];

	config = {
		class: 'modal-popup',
		animated: false,
		backdrop: true,
	};

	// SUBSCRIPTION
	private _subscriptions: any = new Subscription();

	// ARRAY
	additionalCards: PaymentMethod[];

	// ANY
	primaryCard: PaymentMethod;
	selectedPaymentMethod: PaymentMethod;
	selectedPaymentId: number;

	// BOOLEAN
	loading = false;

	// STRING
	// cardIconDirectory = '../../../../../../../../assets/svg/credit-card/';
	// load = require('../../../../../../../../assets/img/blank.jpg');
	load = './assets/img/blank.jpg';
	cardIconDirectory = './assets/svg/credit-card/';

	constructor(private MS: ModalService,
		private router: Router,
		private AS: AuthService,
		private _userService: UserAPIService,
		private _paymentService: PaymentAPIService,
		private LS: LocalStorage) {
	}

	ngOnChanges(changes: SimpleChanges) {
		this.loading = true;

		if (this.billing) {
			this.loading = false;

			this._categoriseBillingMethods(this.billing);
		}
	}

	ngOnInit() {
		this.MS.data$.next(undefined);
		this._fetchModalMessage();
	}

	ngOnDestroy() {
		this._subscriptions.unsubscribe();
	}

	addPaymentAccount($event: any): void {
		$event.preventDefault();
		if (!this.AS.isAuthenticated()) {
			this.router.navigate(['/login']);
		}

		let message: any = this.MS.processModalAlertInformation('empty-message', 'confirmed');
		this.MS.data$.next(message);

		this.MS.openAddPaymentMethodModal(this.config);
	}

	private _fetchModalMessage(): void {
		this._subscriptions.add(
			this.MS.fetchModalData().subscribe(res => {
				if (res) {
					switch (res.type) {
						case 'success-deletecard':
							let userId: number = this.LS.get('userId');
							this._subscriptions.add(this._userService.removePaymentMethod(userId, this.selectedPaymentId).subscribe(
								(res: any) => {
									if (res) {
										this._paymentService.payments$.next(res);
										this._categoriseBillingMethods(res.paymentMethods);

										let message: any = this.MS.processModalAlertInformation('card-deleted', 'You successfully removed a card.');
										this.MS.data$.next(message);
									}
								}
							));
							break;
					}
				}
			})
		);
	}

	editPaymentMethod($event: any, paymentMethod: PaymentMethod): void {
		$event.preventDefault();
		if (!this.AS.isAuthenticated()) {
			this.router.navigate(['/login']);
		}

		let message: any = this.MS.processModalAlertInformation('empty-message', 'confirmed');
		this.MS.data$.next(message);

		this.selectedPaymentMethod = paymentMethod;
		this.MS.openEditPaymentMethodModal(this.config);
	}

	removePaymentMethod($event: any, paymentId: number) {
		$event.preventDefault();

		let message: any;

		this.selectedPaymentId = paymentId;

		message = this.MS.processModalAlertInformation('empty-message', 'confirmed');
		this.MS.data$.next(message);

		message = this.MS.processModalAlertInformation('deletecard', 'Are you sure to delete the card? ');
		this.MS.data$.next(message);
		this.MS.openConfirmationModal(this.config);
	}

	setPrimaryPaymentMethod($event: any, paymentId: number) {
		$event.preventDefault();

		let message: any;
		message = this.MS.processModalAlertInformation('empty-message', 'confirmed');
		this.MS.data$.next(message);

		let userId: number = this.LS.get('userId');

		this._subscriptions.add(this._userService.setPrimaryPaymentMethod(userId, paymentId).subscribe((res: any) => {
			if (res.success) {
				this._setPrimaryPaymentOnLoad(paymentId);
				message = this.MS.processModalAlertInformation('set-primary-card', 'Primary card has been changed.');
				this.MS.data$.next(message);
			}
		}));
	}

	private _setPrimaryPaymentOnLoad(paymentId: number) {
		let paymentMethods$ = this._paymentService.getPayments();

		this._subscriptions.add(paymentMethods$.subscribe((res: any) => {
			if (res) {
				let paymentMethods = res.paymentMethods;
				let due = res.due;
				paymentMethods = paymentMethods.map((method: PaymentMethod) => {
					method.isPrimary = false;
					return method;
				});

				let singleBillingIndex: number = paymentMethods.findIndex((method: PaymentMethod) => method.paymentId === paymentId);
				paymentMethods[singleBillingIndex]['isPrimary'] = true;
				this._paymentService.payments$.next({ paymentMethods, due });
				this._categoriseBillingMethods(paymentMethods);
			}
		}))
	}

	cardIcon(cardBrand: string): string {
		switch (cardBrand) {
			case 'MasterCard':
				return this.cardIconDirectory + 'm.svg';
			case 'Visa':
				return this.cardIconDirectory + 'v.svg';
			case 'American Express':
				return this.cardIconDirectory + 'ae.svg';
			case 'Discover':
				return this.cardIconDirectory + 'd.svg';
			case 'JCB':
				return this.cardIconDirectory + 'jc.svg';
			case 'UnionPay':
				return this.cardIconDirectory + 'up.svg';
			case 'Diners Club':
				return this.cardIconDirectory + 'dc.svg';

			default:
				return '';
		}
	}

	latestMethods($event: any) {
		if ($event) {
			this._categoriseBillingMethods($event.paymentMethods);
		}
	}

	private _categoriseBillingMethods(methods: any) {
		this.primaryCard = methods.find((method: PaymentMethod) => method.isPrimary);
		this.additionalCards = methods.filter((method: PaymentMethod) => !method.isPrimary);
	}
}

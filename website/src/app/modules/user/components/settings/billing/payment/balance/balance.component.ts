import { Component, Input, OnDestroy, OnInit, Output, EventEmitter } from '@angular/core';

// ROUTER
import { Router } from '@angular/router';

// SUBSCRIPTIONS
import { Subscription } from 'rxjs';

// SERVICES
import { ModalService, AuthService } from '../../../../../../../shared/services';

// INTERFACES
import { PaymentMethod } from '../../../../../../../shared/interfaces';

// COMPONENT
@Component({
	moduleId: module.id,
	selector: 'settings-billing-payment-balance',
	styleUrls: ['balance.component.scss'],
	templateUrl: 'balance.component.html',
})

// CLASS
export class SettingsBillingPaymentBalanceComponent implements OnInit, OnDestroy {
	@Input() due: number;
	@Input() billing: PaymentMethod;

	@Output() refresh: EventEmitter<boolean> = new EventEmitter();

	// SUBSCRIPTIONS
	private _subscriptions: any = new Subscription();

	config = {
		class: 'modal-popup',
		animated: false,
		backdrop: true,
	};

	constructor(
		private _modalService: ModalService,
		private _authService: AuthService,
		private _router: Router
	) {
	}

	ngOnInit(){
	}

	ngOnDestroy(){
		this._subscriptions.unsubscribe();
	}

	pay(): void {
		if (!this._authService.isAuthenticated()) {
			this._router.navigate(['/login']);
		}

		this._modalService.openChargeDueModal(this.config);
	}
}

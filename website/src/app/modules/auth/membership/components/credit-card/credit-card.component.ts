import {
	Component, OnInit, OnDestroy,
	ViewChild, ElementRef, ChangeDetectorRef, Input, Output, EventEmitter
} from '@angular/core';

import { Router } from '@angular/router';

import {
	FormGroup, Validators, FormBuilder, ValidatorFn, ValidationErrors
} from '@angular/forms';

import { StripeCardComponent, StripeCardNumberComponent, StripeCardExpiryComponent, StripeCardCvcComponent, StripeInstance, StripeService } from 'ngx-stripe';

// SERVICES
import { GoogleAnalyticsService } from '../../../../../shared/services';

@Component({
	selector: 'credit-card',
	templateUrl: 'credit-card.component.html',
	styleUrls: ['credit-card.component.scss']
})

export class CreditCardComponent {
	// SIGN UP
	@Input('email') email: string;
	@Input('password') password: string;
	@Output() creditCardValidate = new EventEmitter<any>();

	// STRIPE
	@ViewChild(StripeCardComponent, { static: false }) card: StripeCardComponent;
	@ViewChild(StripeCardNumberComponent, { static: false }) cardNumber: StripeCardNumberComponent;
	@ViewChild(StripeCardExpiryComponent, { static: false }) cardExpiry: StripeCardExpiryComponent;
	@ViewChild(StripeCardCvcComponent, { static: false }) cardCvc: StripeCardCvcComponent;

	billing: FormGroup;

	express: any;
	paymentRequest: any;
	// cardHandler = this.valueChangesChange.bind(this);
	error: string;
	amount: string;
	name: string;

	// STRIPE
	// elementsOptions: ElementsOptions = {
	//   locale: 'es'
	// };

	//   stripe: StripeInstance;

	//   constructor(
	//     private GS: GoogleAnalyticsService,
	//     private fb: FormBuilder,
	//     private cd: ChangeDetectorRef,
	//     private router: Router,
	//     private stripeService: StripeService
	//   ) {
	//   }

	//   ngOnInit() {
	//     this.billing = this.fb.group({
	//       cardNumberHidden: [false, Validators.requiredTrue],
	//       cardExpiryHidden: [false, Validators.requiredTrue],
	//       cardCVCHidden: [false, Validators.requiredTrue],
	//       name: ['', Validators.required],
	//       zip: ['', Validators.required],
	//     });

	//     this.billing.setValidators(this._validateCardInformation());

	//     this.stripeService.elements(this.elementsOptions)
	//       .subscribe(elements => {
	//         this.stripe = elements;
	//       });
	//   }

	//   private updatedCardInformation() {
	//     if (!this.cardNumber || !this.cardExpiry || !this.cardCvc) {
	//       return false;
	//     }

	//     let cardNumberControl = this.billing.controls['cardNumberHidden'];
	//     let cardExpiryControl = this.billing.controls['cardExpiryHidden'];
	//     let cardCVCControl = this.billing.controls['cardCVCHidden'];

	//     this.cardNumber.valueChanges('change', (event) => {
	//       let isValid = event.complete;
	//       cardNumberControl.setValue(isValid);
	//     });

	//     this.cardExpiry.valueChanges.subscribe('change', (event) => {
	//       let isValid = event.complete;
	//       cardExpiryControl.setValue(isValid);
	//     });

	//     this.cardCvc.valueChanges('change', (event) => {
	//       let isValid = event.complete;
	//       cardCVCControl.setValue(isValid);
	//     });
	//   }

	//   private _validateCardInformation(): ValidatorFn {
	//     return (group: FormGroup): ValidationErrors => {
	//       const nameControl = group.controls['name'];
	//       const zipControl = group.controls['zip'];

	//       this.updatedCardInformation();

	//       let cardNumberControl = group.controls['cardNumberHidden'];
	//       let cardExpiryControl = group.controls['cardExpiryHidden'];
	//       let cardCVCControl = group.controls['cardCVCHidden'];

	//       if (nameControl.valid && zipControl.valid &&
	//         cardNumberControl.valid && cardExpiryControl.valid && cardCVCControl.valid) {
	//         this.creditCardValidate.emit(true);
	//       } else {
	//         this.creditCardValidate.emit(false);
	//       }

	//       return null;
	//     };
	//   }

	//   public async createCardToken() {
	//     const name = this.billing.get('name').value;

	//     let token = await this.stripeService.createToken(this.card.getCard(), { name }).toPromise();

	//     return token;
	//   }

	//   ngOnChange({ error }) {
	//     if (error) {
	//       this.error = error.message;
	//     } else {
	//       this.error = null;
	//     }
	//     this.cd.detectChanges();
	//   }

	//   ngOnDestroy() {
	//   }
}

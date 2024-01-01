import { Component, AfterViewInit, OnDestroy, ViewChild, ElementRef, ChangeDetectorRef, NgZone } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';

// SEO
import { Meta, Title } from '@angular/platform-browser';

import { FormGroup, FormControl, Validators, FormBuilder, ValidatorFn, AbstractControl, SelectMultipleControlValueAccessor, NgForm } from '@angular/forms';

@Component({
	selector: 'credit-card',
	templateUrl: 'credit-card.component.html'
})

export class CreditCardComponent implements AfterViewInit, OnDestroy {

	@ViewChild('form') Form: ElementRef
	@ViewChild('cardInfo') cardInfo: ElementRef

	// AUTOCOMPLETE
	@ViewChild('city') private city: ElementRef
	@ViewChild('state') private state: ElementRef
	@ViewChild('zip') private zip: ElementRef


	billing: FormGroup;

	express: any;
	paymentRequest: any;
	card: any;
	cardHandler = this.onChange.bind(this);
	error: string;
	plan: string;
	amount: string;
	name: string;

	constructor(
		private fb: FormBuilder,
		private cd: ChangeDetectorRef,
		private route: ActivatedRoute,
		private ngZone: NgZone) {

		this.route.params.subscribe(params => {
			this.plan = params['plan'];

			if (this.plan === 'yearly') {
				this.amount = '19.99'
				this.name = 'Elite'
			} else {
				this.amount = '1.99'
				this.name = 'Basic'
			}
		});

		this.billing = this.fb.group({
			name: ['', Validators.required],
			address: ['', Validators.required],
			city: ['', Validators.required],
			state: ['', Validators.required],
			zip: ['', Validators.required],
		});
	}

	ngOnInit() {
	}

	ngAfterViewInit() {

		var style = {
			base: {
				color: '#32325d',
				lineHeight: '20px',
				padding: '0 15px',
				height: '52px',
				border: '2px solid #d0d0d0',
				margin: '0 0 24px 0',
				fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
				fontSmoothing: 'antialiased',
				fontSize: '16px',
				'::placeholder': {
					color: '#aab7c4'
				}
			},
			invalid: {
				color: '#fa755a',
				iconColor: '#fa755a'
			}
		};


		this.card = elements.create('card', {style: style});
		this.card.mount(this.cardInfo.nativeElement);

		this.card.addEventListener('change', this.cardHandler);


		this.paymentRequest = stripe.paymentRequest({
			currency: 'usd',
			country: 'US',
			total: {
				amount:  this.amount,
				label: this.plan.toUpperCase()
			},
			requestPayerEmail: true,
			requestPayerName: true,

		});

		this.paymentRequest.on('token', function (result) {
			let FORM = document.querySelector('.billing');
			FORM.classList.add('submitted');
			result.complete('success');
		});

		this.express = elements.create('paymentRequestButton', {
			paymentRequest: this.paymentRequest,
			style: {
				paymentRequestButton: {
					theme: 'light'
				}
			}
		});

		this.mountButton()
	}

	async mountButton() {
		const result = await this.paymentRequest.canMakePayment();

		if (result) {
			this.express.mount('#express');
		} else {
			console.error('https support only for express payment');
		}

	}

	ngOnDestroy() {
		this.card.removeEventListener('change', this.cardHandler);
		this.card.destroy();
	}

	onChange({ error }) {
		if (error) {
			this.error = error.message;
		} else {
			this.error = null;
		}
		this.cd.detectChanges();
	}

	async click(form) {
		const { token, error } = await stripe.createToken(this.card);

		if (error) {
			console.log('Something is wrong:', error);
		} else {
			console.log('Success!', token);
			// ...send the token to the your backend to process the charge
		}
	}


}

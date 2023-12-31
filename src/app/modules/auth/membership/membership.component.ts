// import { Component, OnInit, OnDestroy, Renderer, ViewChild, ElementRef, AfterViewInit, HostListener, PLATFORM_ID, Inject } from '@angular/core';
//
// // ROUTER
// import { Router, ActivatedRoute } from '@angular/router';
//
// // FORMGROUP
// import { FormGroup, FormControl, Validators, ValidationErrors, ValidatorFn, FormBuilder, AbstractControl } from '@angular/forms';
//
// // ALERT
// import { AlertComponent } from 'ngx-bootstrap/alert';
//
// // SERVICES
// import { AuthService, ProductAPIService, HttpCancelService, UserAPIService, RegisterService, SeoService, GoogleAnalyticsService } from '../../../shared/services';
//
// // ENV
// import { environment } from '../../../../environments/environment';
//
// // INTERFACES
// import { ISubscription } from '../../../shared/interfaces/subscription/subscription.interface';
//
// // SSR
// import { isPlatformBrowser } from '@angular/common';
//
// import { take } from 'rxjs/operators';
// import { withLatestFrom, map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
//
// @Component({
// 	selector: 'membership',
// 	templateUrl: 'membership.component.html',
// })
// export class MembershipComponent implements OnInit, AfterViewInit, OnDestroy {
// 	// SPINNER
// 	show: boolean;
// 	details: boolean;
// 	member: boolean;
//
// 	// SHOW FORMS
// 	submit: boolean;
// 	passwordRequirements: boolean;
//
// 	// FORMGROUP
// 	register: FormGroup;
// 	payment: FormGroup;
//
// 	// STRING
// 	plan: string;
// 	pType: string;
//
// 	// ELEMENTS
// 	@ViewChild('email', { static: false }) email: ElementRef;
// 	@ViewChild('pass', { static: false }) pass: ElementRef;
// 	@ViewChild('creditCard', { static: false }) creditCard: any;
//
// 	// OBJECT
// 	message: Array<object> = [];
// 	access: Object = {};
// 	features: Object = [];
//
// 	// VALIDATERS
// 	lowercase: boolean;
// 	uppercase: boolean;
// 	number: boolean;
// 	special: boolean;
// 	eight: boolean;
// 	plus50: boolean;
//
// 	// MOBILE
// 	step = 0;
// 	emailValid = false;
// 	mobile = false;
//
// 	// Plan/Add ons subscriptions
// 	basicMonthlyPlan: ISubscription[];
// 	basicYearlyPlan: ISubscription[];
// 	eliteMonthlyPlan: ISubscription[];
// 	eliteYearlyPlan: ISubscription[];
// 	addOns: ISubscription[];
// 	selectedAddOns: Array<ISubscription> = [];
// 	selectedPlan: ISubscription;
// 	planSubscriptionPay: number;
// 	extraPay: number;
// 	totalPay: number;
// 	monthlyPay: number;
// 	previousMonthlyPay: number;
// 	yearlyPay: number;
// 	previousYearlyPay: number;
// 	plansLoaded: boolean;
// 	summaryPlan: any;
//
// 	// CREDIT CARD
// 	creditCardValidated: boolean;
// 	creditCardToken: any;
//
// 	// EMAIL FIELD CHECKER
// 	emailTaken: boolean;
//
// 	constructor(
// 		private GS: GoogleAnalyticsService,
// 		public router: Router,
// 		private AS: AuthService,
// 		private fb: FormBuilder,
// 		private route: ActivatedRoute,
// 		private userAPI: UserAPIService,
// 		private productAPI: ProductAPIService,
// 		private SS: SeoService,
// 		private RS: RegisterService,
// 		@Inject(PLATFORM_ID) private platform: any,
// 		private renderer: Renderer,
// 		private httpCancelService: HttpCancelService
// 	) {
// 		// CREDIT CARD
// 		this.creditCardValidated = false;
//
// 		// PLAN SELECTED
// 		this.extraPay = 0;
// 		this.totalPay = 0;
// 		this.planSubscriptionPay = 0;
// 		this.plansLoaded = false;
// 		this.monthlyPay = 0;
// 		this.yearlyPay = 0;
// 		this.previousMonthlyPay = 0;
// 		this.previousYearlyPay = 0;
//
// 		// SEO
// 		this.SS.generateTags({
// 			description: 'Get Started today! Start shopping for the best pricing groceries you love.',
// 			url: this.router.url,
// 		});
//
// 		// BOOLEAN
// 		this.submit = false;
// 		this.show = false;
// 		// this.showRegister = true;
//
// 		// PARAMS
// 		this.route.params.subscribe(params => {
// 			this.plan = params['plan'];
//
// 			this.setPlanInformation();
// 		});
// 	}
//
// 	ngOnInit() {
// 		this.processPricingPlans();
// 		this._credentials();
// 	}
//
// 	ngAfterViewInit() {
// 		// EMAIL FOCUS
// 		this.renderer.invokeElementMethod(this.email.nativeElement, 'focus');
//
// 		this.isMobile();
// 		this.checkUserEmailTaken();
// 	}
//
// 	ngOnDestroy(): void {
// 		this.httpCancelService.cancelPendingRequests();
// 		if (!environment.production && !this.httpCancelService) {
// 			console.log('canceled pending request');
// 		}
// 	}
//
// 	@HostListener('window:resize', ['$event'])
// 	onResize(event) {
// 		this.isMobile();
// 	}
//
// 	private checkUserEmailTaken() {
// 		this.register.controls['email'].valueChanges.pipe(distinctUntilChanged(), debounceTime(800), withLatestFrom()).subscribe(res => {
// 			let value = res[0];
// 			let emailValidated = this.validateEmail(value);
//
// 			if (!emailValidated) {
// 				return false;
// 			}
//
// 			this.userAPI
// 				.getEmail(value)
// 				.pipe(withLatestFrom())
// 				.subscribe((res: any) => {
// 					this.emailTaken = res[0].user;
// 					this.enableDisableEmailError();
// 				});
// 		});
// 	}
//
// 	private enableDisableEmailError() {
// 		let emailControl: AbstractControl;
// 		let emailValidatorControl: AbstractControl;
//
// 		emailControl = this.register.controls['email'];
// 		emailValidatorControl = this.register.controls['emailValidHidden'];
//
// 		if (this.emailTaken) {
// 			emailControl.setErrors({ emailTaken: 'Oh noes, this email is already taken! Try another one.' });
// 		} else {
// 			this.emailValid = true;
//
// 			emailControl.setErrors(null);
// 		}
//
// 		emailValidatorControl.setValue(!this.emailTaken);
// 	}
//
// 	private isMobile() {
// 		if (isPlatformBrowser(this.platform)) {
// 			this.mobile = window.innerWidth < 992 ? true : false;
// 		}
// 	}
//
// 	private setPlanInformation() {
// 		if (this.plan) {
// 			this.member = true;
//
// 			if (this.plan === 'basic') {
// 				// SEO
// 				this.SS.updateMetaTags({
// 					title: 'Sign Up for Basic | Grceri',
// 				});
//
// 				this.pType = 'For individuals using this service to save on multiple food purchases based on moderate online shopping.';
// 				this.features = ['Able to search by barcode, isnb, or upc.', 'Create up to 5 shopping lists.', 'Add up to 500 products to follow price changes.'];
// 			}
// 			if (this.plan === 'elite') {
// 				// SEO
// 				this.SS.updateMetaTags({
// 					title: 'Sign Up for Elite | Grceri',
// 				});
//
// 				this.pType = 'For individuals to take advantage of every online purchase based on heavy online shopping.';
// 				this.features = ['Able to search by barcode, isnb, or upc.', 'Create up to 50 shopping lists.', 'Add up to 5,000 products to follow price changes.'];
// 			}
// 		} else {
// 			// SEO
// 			this.SS.updateMetaTags({
// 				title: 'Sign Up for Free | Grceri',
// 			});
//
// 			this.plan = 'free';
// 			this.pType = `For individuals wanting to use the service but wouldn't make a lot of online food purchases.`;
// 			this.features = ['Create up to 1 shopping list.', 'Add up to 10 products to follow price changes.'];
// 		}
// 	}
//
// 	private processPricingPlans() {
// 		this.productAPI.getPricingPlans().subscribe((res: ISubscription[]) => {
// 			if (!res) {
// 				return false;
// 			}
//
// 			this.addSubscriptionFormControlsToFormGroup();
// 			this.plansLoaded = true;
//
// 			this.RS.initializeSubscriptions(res);
// 			this.initializeSubscriptions();
//
// 			if (this.plan === 'basic' || this.plan === 'elite') {
// 				this.selectFirstMonthlyPlan(this.plan);
// 			}
// 		});
// 	}
//
// 	private initializeSubscriptions() {
// 		this.basicMonthlyPlan = this.RS.getQuarterSubscriptions('basic', 'month');
// 		this.basicYearlyPlan = this.RS.getQuarterSubscriptions('basic', 'year');
//
// 		this.eliteMonthlyPlan = this.RS.getQuarterSubscriptions('elite', 'month');
// 		this.eliteYearlyPlan = this.RS.getQuarterSubscriptions('elite', 'year');
//
// 		this.addOns = this.RS.getSubscriptions('add ons');
// 	}
//
// 	private addSubscriptionFormControlsToFormGroup() {
// 		this.register.addControl('quarterPlan', new FormControl(''));
// 		this.register.addControl('plan', new FormControl(''));
// 		this.register.addControl('addOns', new FormControl(''));
// 		this.register.addControl('creditCard', new FormControl(false, Validators.required));
//
// 		this.register.setValidators(this._validatePaidSubscription());
// 	}
//
// 	private getPlanSubscriptions(allPlans: ISubscription[], subscriptionType: string): ISubscription[] {
// 		let plans = allPlans.filter((element: any) => {
// 			let productName: string = element.productName;
// 			return productName.toLowerCase().includes(subscriptionType);
// 		});
//
// 		return plans;
// 	}
//
// 	private getQuarterPlanSubscriptions(allPlans: ISubscription[], quarterType: string): ISubscription[] {
// 		let plans = allPlans.filter((element: any) => element.planInterval === quarterType);
//
// 		return plans;
// 	}
//
// 	private _credentials() {
// 		this.register = this.fb.group({
// 			email: ['', [Validators.email, this._validateEmailNotTaken.bind(this)]],
// 			emailValidHidden: [false, Validators.requiredTrue],
// 			password: ['', [Validators.maxLength(49), Validators.minLength(8), this._validatePattern]],
// 			terms: [false, Validators.pattern('true')],
// 		});
// 	}
//
// 	private _validateEmailNotTaken(control: AbstractControl) {
// 		return { emailTaken: false };
// 	}
//
// 	private _validatePaidSubscription(): ValidatorFn {
// 		return (group: FormGroup): ValidationErrors => {
// 			const currentPlan = group.controls['plan'].value;
// 			const quarterPlan = group.controls['quarterPlan'].value;
//
// 			if ((this.plan !== 'free' || this.extraPay > 0) && !this.creditCardValidated) {
// 				return { creditCardValidated: false };
// 			}
//
// 			if (currentPlan === 'free' || this.plan === 'free') {
// 				return null;
// 			}
//
// 			return quarterPlan ? null : { quarterPlanSelected: false };
// 		};
// 	}
//
// 	signup() {
// 		if (this.register.get('email').errors || this.register.get('password').errors) {
// 			return false;
// 		}
//
// 		this.submit = true;
//
// 		// VALUES
// 		let email = this.register.get('email').value;
// 		let password = this.register.get('password').value;
//
// 		if (this.plan === 'free' && !this.selectedAddOns.length) {
// 			this._access('20', 'false', '1', '10');
//
// 			this.signUpUser(email, password);
// 		} else {
// 			let tokenPromise = this.creditCard.createCardToken();
//
// 			tokenPromise.then((res: any) => {
// 				if (res.token) {
// 					this.processPostTransactionAPI(res.token);
// 				}
// 			});
// 		}
// 	}
//
// 	private processPostTransactionAPI(token) {
// 		let email = this.register.controls['email'].value;
// 		let password = this.register.controls['password'].value;
// 		let addOnsId: any[] = [];
// 		let subscription = '';
//
// 		this.selectedAddOns.forEach(addOn => {
// 			addOnsId.push(addOn.planId);
// 		});
//
// 		subscription = addOnsId.join();
//
// 		let pricingPlan = this.selectedPlan ? this.selectedPlan.planId : 'free';
//
// 		let maxWishList = this.plan === 'basic' ? '500' : '5000';
// 		let productList = this.plan === 'basic' ? '5' : '50';
//
// 		this._access('-1', 'true', productList, maxWishList);
//
// 		let paymentObject = {
// 			email,
// 			token: token.id,
// 			pricingPlan,
// 			subscription,
// 		};
//
// 		this.productAPI.postTransaction(paymentObject).subscribe(res => {
// 			if (res) {
// 				this.signUpUser(email, password);
//
// 				this._gEvent(paymentObject);
//
// 				this.router.navigate(['/login']);
// 			} else {
// 			}
// 		});
// 	}
//
// 	private signUpUser(email, password) {
// 		let signUpPromise = this.AS.signup(email, password, this.access);
//
// 		signUpPromise
// 			.then((res: any) => {
// 				if (res.userId && res.email) {
// 					this._alert('success', 'Your "' + this.plan + '"' + ' has been successfully created!');
// 					this.router.navigate(['/login']);
// 				}
// 			})
// 			.catch(err => err);
// 	}
//
// 	_password() {
// 		this.show = !this.show;
// 		this.renderer.invokeElementMethod(this.pass.nativeElement, 'focus');
// 	}
//
// 	_passwordChange(i) {
// 		let l = i.match('[a-z]');
// 		let u = i.match('[A-Z]');
// 		let n = i.match('[0-9]');
// 		let s = i.match('[!@#$%^&*()]');
// 		let e = i.length >= 8;
// 		let f = i.length === 50;
//
// 		if (l) {
// 			this.lowercase = true;
// 		} else {
// 			this.lowercase = false;
// 		}
// 		if (u) {
// 			this.uppercase = true;
// 		} else {
// 			this.uppercase = false;
// 		}
// 		if (n) {
// 			this.number = true;
// 		} else {
// 			this.number = false;
// 		}
// 		if (s) {
// 			this.special = true;
// 		} else {
// 			this.special = false;
// 		}
// 		if (e) {
// 			this.eight = true;
// 		} else {
// 			this.eight = false;
// 		}
// 		if (f) {
// 			this.plus50 = true;
// 		} else {
// 			this.plus50 = false;
// 		}
//
// 		this.passwordRequirements = l && u && n && s && e && !f ? true : false;
// 	}
//
// 	private _access(hi: string, bc: string, pl: string, wl: string) {
// 		this.access = {
// 			History: hi,
// 			Barcode: bc,
// 			'Product Lists': pl,
// 			Watchlists: wl,
// 		};
//
// 		this.processPlanAccess();
// 		this.processAddOnsAccess();
// 	}
//
// 	private processPlanAccess() {
// 		if (this.plan === 'free') {
// 			this.access['Plan'] = this.plan;
// 		} else {
// 			this.access['Plan'] = this.selectedPlan.productName + ' - ' + this.selectedPlan.planInterval;
// 		}
// 	}
//
// 	private processAddOnsAccess() {
// 		this.selectedAddOns.forEach((addOn: ISubscription) => {
// 			this.access[addOn.productName] = 'true';
// 		});
//
// 		if (!environment.production) {
// 			console.log('access', this.access);
// 		}
// 	}
//
// 	private _alert(a: string, b: string) {
// 		this.message.push({
// 			type: a,
// 			value: b,
// 		});
// 	}
//
// 	private _close(a: AlertComponent) {
// 		this.message = this.message.filter(i => i !== a);
// 	}
//
// 	private validateEmail(email) {
// 		let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
// 		return re.test(String(email).toLowerCase());
// 	}
//
// 	private _validatePattern(c: AbstractControl) {
// 		let a = c.value;
// 		let l = a.match('[a-z]');
// 		let u = a.match('[A-Z]');
// 		let n = a.match('[0-9]');
// 		let s = a.match('[!@#$%^&*()]');
//
// 		return l && u && n && s
// 			? null
// 			: {
// 					emailTaken: {
// 						valid: false,
// 					},
// 				};
// 	}
//
// 	handlePlanChange(event) {
// 		let planName = event.target.value;
//
// 		if (planName === 'free') {
// 			this.selectedPlan = undefined;
// 		}
//
// 		this.plan = planName;
//
// 		this.selectFirstMonthlyPlan(planName);
// 		this.setPlanInformation();
// 	}
//
// 	private selectFirstMonthlyPlan(planName) {
// 		let amount: number;
//
// 		amount = this.getFirstMonthlyPlanAmount(planName);
//
// 		this.register.get('quarterPlan').setValue(amount);
//
// 		this.planSubscriptionPay = amount;
//
// 		this.monthlyPay = this.extraPay;
// 		this.yearlyPay = 0;
// 		this.previousMonthlyPay = 0;
// 		this.previousYearlyPay = 0;
// 		this.calculateQuaterlyPay('month', amount);
//
// 		this.calculateTotalPay();
// 	}
//
// 	private getFirstMonthlyPlanAmount(planName) {
// 		let amount = 0;
//
// 		if (planName === 'basic') {
// 			if (this.basicMonthlyPlan && this.basicMonthlyPlan.length > 0) {
// 				amount = this.basicMonthlyPlan[0].amount;
// 				this.selectedPlan = this.basicMonthlyPlan[0];
// 			}
// 		}
//
// 		if (planName === 'elite') {
// 			if (this.eliteMonthlyPlan && this.eliteMonthlyPlan.length > 0) {
// 				amount = this.eliteMonthlyPlan[0].amount;
// 				this.selectedPlan = this.eliteMonthlyPlan[0];
// 			}
// 		}
//
// 		return amount;
// 	}
//
// 	handleAddOnsChange(event, addOn: ISubscription): any {
// 		let amount = Number(event.target.value);
//
// 		if (event.target.checked) {
// 			this.monthlyPay = this.monthlyPay + amount;
// 			this.extraPay = this.extraPay + amount;
// 			this.selectedAddOns.push(addOn);
// 		} else {
// 			if (this.extraPay === 0) {
// 				return false;
// 			}
//
// 			this.selectedAddOns = this.selectedAddOns.filter(addOnObject => addOn !== addOnObject);
// 			this.monthlyPay = this.monthlyPay - amount;
// 			this.extraPay = this.extraPay - amount;
// 		}
//
// 		this.monthlyPay = Math.round(this.monthlyPay * 100) / 100;
//
// 		this.calculateTotalPay();
// 	}
//
// 	handleQuarterPlanChange(event, planObject) {
// 		let quarter: string;
//
// 		this.selectedPlan = planObject;
//
// 		quarter = planObject.planInterval;
//
// 		this.planSubscriptionPay = Number(planObject.amount);
//
// 		this.calculateQuaterlyPay(quarter, this.planSubscriptionPay);
// 		this.calculateTotalPay();
// 	}
//
// 	private calculateQuaterlyPay(quarter, amount) {
// 		if (quarter === 'month') {
// 			if (this.previousMonthlyPay > 0) {
// 				amount = amount - this.previousMonthlyPay;
// 			}
//
// 			if (this.previousYearlyPay > 0 && this.yearlyPay > 0) {
// 				this.yearlyPay = this.yearlyPay - this.previousYearlyPay;
//
// 				this.yearlyPay = Math.round(this.yearlyPay * 100) / 100;
// 			}
//
// 			this.previousMonthlyPay = amount;
// 			this.previousYearlyPay = 0;
// 			this.monthlyPay = this.monthlyPay + amount;
//
// 			this.monthlyPay = Math.round(this.monthlyPay * 100) / 100;
// 		}
//
// 		if (quarter === 'year') {
// 			if (this.previousMonthlyPay > 0 && this.monthlyPay > 0) {
// 				this.monthlyPay = this.monthlyPay - this.previousMonthlyPay;
// 				this.monthlyPay = Math.round(this.monthlyPay * 100) / 100;
// 			}
//
// 			if (this.previousYearlyPay > 0) {
// 				amount = amount - this.previousYearlyPay;
// 			}
//
// 			this.previousMonthlyPay = 0;
// 			this.previousYearlyPay = amount;
// 			this.yearlyPay = this.yearlyPay + amount;
//
// 			this.yearlyPay = Math.round(this.yearlyPay * 100) / 100;
// 		}
// 	}
//
// 	calculateTotalPay() {
// 		let totalPay = this.extraPay + this.planSubscriptionPay;
// 		this.totalPay = Math.ceil(totalPay * 100) / 100;
// 	}
//
// 	getCreditCardValidationInformation(data) {
// 		this.creditCardValidated = data;
//
// 		if (this.plansLoaded) {
// 			this.register.controls['creditCard'].setValue(data);
// 		}
// 	}
//
// 	private _gEvent(obj) {
// 		obj.subscription.forEach(res => {
// 			let option = {
// 				id: res.id,
// 				price: res.subscription,
// 				quantity: '1',
// 			};
//
// 			this.GS.commerce('ecommerce:addTransaction', option);
// 		});
//
// 		// SEND ALL
// 		this.GS.commerceSend();
// 	}
// }

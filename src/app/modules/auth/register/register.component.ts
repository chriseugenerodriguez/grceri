import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit, HostListener, PLATFORM_ID, Inject, Renderer2 } from '@angular/core';

// ROUTER
import { Router, ActivatedRoute } from '@angular/router';

// SEO
import { Meta, Title } from '@angular/platform-browser';

// FORMGROUP
import { FormGroup, FormControl, Validators, ValidationErrors, ValidatorFn, FormBuilder, AbstractControl } from '@angular/forms';

// ALERT
import { AlertComponent } from 'ngx-bootstrap/alert';

// RXJS
import { Subscription } from 'rxjs';
import { withLatestFrom, debounceTime, distinctUntilChanged } from 'rxjs/operators';

// SERVICES
import { AuthService, ProductAPIService, ModalService, UserAPIService, RegisterService, SeoService, GoogleAnalyticsService } from '../../../shared/services';

// SOCIAL LOGIN
import { SocialAuthService, GoogleLoginProvider } from '@abacritt/angularx-social-login';

// LOADER
import { LoadingBarService } from '@ngx-loading-bar/core';

// ENV
import { environment } from '../../../../environments/environment';

// SSR
import { isPlatformBrowser } from '@angular/common';

// CORDOVA
declare var window: any;

@Component({
	selector: 'register',
	templateUrl: 'register.component.html',
	styleUrls: ['register.component.scss']
})

export class RegisterComponent implements OnInit, OnDestroy, AfterViewInit {

	// SPINNER
	show: boolean;
	details: boolean;
	member: boolean;

	// SHOW FORMS
	submit: boolean;
	passwordRequirements: boolean;

	// FORMGROUP
	register: FormGroup;

	// ELEMENTS
	@ViewChild('firstname', { static: false }) firstName: ElementRef;
	@ViewChild('email', { static: false }) email: ElementRef;
	@ViewChild('pass', { static: false }) pass: ElementRef;

	// OBJECT
	message: Array<object> = [];

	// VALIDATERS
	lowercase: boolean;
	uppercase: boolean;
	number: boolean;
	special: boolean;
	eight: boolean;
	plus50: boolean;
	googleSignUpLoading = false;

	// MOBILE
	step = 0;
	emailValid = false;
	mobile = false;

	config = {
		class: 'modal-popup',
		animated: false,
		backdrop: true,
	};

	// LOADER
	state = this.LB;

	// ANY
	gl: any;

	// SUBSCRIPTION
	private _subscriptions: any = new Subscription();

	// EMAIL FIELD CHECKER
	emailTaken: boolean;
	emailLoading: boolean;

	constructor(
		private GS: GoogleAnalyticsService,
		public router: Router,
		private AS: AuthService,
		private MS: ModalService,
		private fb: FormBuilder,
		private route: ActivatedRoute,
		private userAPI: UserAPIService,
		private productAPI: ProductAPIService,
		private socialAuthService: SocialAuthService,
		private SS: SeoService,
		private RS: RegisterService,
		private meta: Meta,
		@Inject(PLATFORM_ID) private platform: any,
		private LB: LoadingBarService,
		private renderer: Renderer2) {

		// SEO
		this.SS.generateTags({
			title: 'Sign Up - grceri',
			description: 'Get Started today! Start shopping for the best pricing groceries you love.',
			url: this.router.url
		});

		// BOOLEAN
		this.submit = false;
		this.show = false;
	}

	ngOnInit() {
		this._credentials();

		this.meta.updateTag({ name: 'google-signin-client_id', content: environment.googleClientId });
	}

	ngAfterViewInit() {
		// EMAIL FOCUS
		this.renderer.selectRootElement(this.firstName.nativeElement).focus();

		this.isMobile();
		this.checkUserEmailTaken();
	}

	ngOnDestroy() {
		this._subscriptions.unsubscribe();
	}

	@HostListener('window:resize', ['$event'])
	onResize(event) {
		this.isMobile();
	}

	private checkUserEmailTaken() {
		this._subscriptions.add(this.register.controls['email'].valueChanges.pipe(distinctUntilChanged(),
			debounceTime(800), withLatestFrom()).subscribe(res => {
				let value = res[0];
				let emailValidated = this.validateEmail(value);
				this.emailLoading = true;

				if (!emailValidated) {
					return false;
				}

				this._subscriptions.add(this.userAPI.getEmail(value).pipe(withLatestFrom()).subscribe((res: any) => {
					this.emailLoading = false;
					this.emailTaken = res[0].user;
					this.enableDisableEmailError();
				}));
			}));
	}

	private enableDisableEmailError() {
		let emailControl: AbstractControl;
		let emailValidatorControl: AbstractControl;

		emailControl = this.register.controls['email'];
		emailValidatorControl = this.register.controls['emailValidHidden'];

		if (this.emailTaken) {
			emailControl.setErrors({ emailTaken: 'Oh noes, this email is already taken! Try another one.' });
		} else {
			this.emailValid = true;

			emailControl.setErrors(null);
		}

		emailValidatorControl.setValue(!this.emailTaken);
	}

	private isMobile() {
		if (isPlatformBrowser(this.platform)) {
			this.mobile = (window.innerWidth < 992) ? true : false;
		}
	}

	private _credentials() {
		this.register = this.fb.group({
			firstName: ['', Validators.required],
			lastName: ['', Validators.required],
			email: ['',
				[
					Validators.email,
					this._validateEmailNotTaken.bind(this)
				]
			],
			emailValidHidden: [false, Validators.requiredTrue],
			password: ['',
				[
					Validators.maxLength(49),
					Validators.minLength(8),
					this._validatePattern
				]
			]
		});
	}

	private _validateEmailNotTaken(control: AbstractControl) {
		return { emailTaken: false };
	}

	submitSignUp() {
		if (this.register.get('email').errors || this.register.get('password').errors) {
			return false;
		}

		// FORM
		this.submit = true;

		// VALUES
		let userObject: any = {
			firstName: this.register.get('firstName').value,
			lastName: this.register.get('lastName').value,
			email: this.register.get('email').value,
			password: this.register.get('password').value,
			photoUrl: '',
			provider: '',
			idToken: ''
		}

		this._signUp(userObject);
	}

	private _signUp(userObject: any) {
		// START LOADER
		this.state.start();

		// FORM
		this.register.disable();

		this._subscriptions.add(this.AS.signup(userObject).subscribe((res) => {
			res = JSON.parse(res._body);

			// FORM
			this.submit = false;

			if (res.success) {
				this._alert('success', 'Your account has been successfully created!');
				this.router.navigate(['/login']);

				// LOADING
				this.state.complete();
				this.state.stop();

				if (environment.mobile) {
					// LOGOUT
					this.gl.logOut();
				} else {
					this.socialAuthService.signOut();
				}
			}
		}, (error) => {
			error = JSON.parse(error._body);

			// STOP LOADER
			this.state.stop();

			// FORM
			this.submit = false;

			if (error.errorCode) {
				this._alert('danger', error.message);
			} else {
				this._alert('danger', 'Something went wrong');
			}

			// ENABLE INPUTS
			this.register.enable();
			this.googleSignUpLoading = false;
		}));
	}

	_password() {
		this.show = !this.show;
		this.renderer.selectRootElement(this.pass.nativeElement).focus();
	}

	_passwordChange(i) {
		let l = i.match('[a-z]');
		let u = i.match('[A-Z]');
		let n = i.match('[0-9]');
		let s = i.match('[!@#$%^&*()]');
		let e = i.length >= 8;
		let f = i.length === 50;

		if (l) {
			this.lowercase = true;
		} else {
			this.lowercase = false;
		}
		if (u) {
			this.uppercase = true;
		} else {
			this.uppercase = false;
		}
		if (n) {
			this.number = true;
		} else {
			this.number = false;
		}
		if (s) {
			this.special = true;
		} else {
			this.special = false;
		}
		if (e) {
			this.eight = true;
		} else {
			this.eight = false;
		}
		if (f) {
			this.plus50 = true;
		} else {
			this.plus50 = false;
		}

		this.passwordRequirements = (l && u && n && s && e && !f) ? true : false;
	}

	private _alert(a: string, b: string) {
		this.message.push({
			type: a,
			value: b
		});
	}

	private _close(a: AlertComponent) {
		this.message = this.message.filter((i) => i !== a);
	}

	private validateEmail(email) {
		let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(String(email).toLowerCase());
	}

	private _validatePattern(c: AbstractControl) {
		let a = c.value;
		let l = a.match('[a-z]');
		let u = a.match('[A-Z]');
		let n = a.match('[0-9]');
		let s = a.match('[!@#$%^&*()]');

		return (l && u && n && s) ? null : {
			emailTaken: {
				valid: false
			}
		};
	}

	private _gEvent(obj) {

		obj.subscription.forEach((res) => {
			let option = {
				'id': res.id,
				'price': res.subscription,
				'quantity': '1'
			}

			this.GS.commerce('ecommerce:addTransaction', option);
		})

		// SEND ALL
		this.GS.commerceSend();
	}

	onGoogleSignUp() {
		const googleLoginOptions = {
			scope: 'profile email openid'
		};

		// DISABLE INPUTS
		this.googleSignUpLoading = true;
		this.register.disable();

		if (environment.mobile) {
			window.plugins.googleplus.login(
				{
					'webClientId': '867235308213-is2ib6551umaogigiebegs60te5scnj3.apps.googleusercontent.com',
					'offline': true // optional, but requires the webClientId - if set to true the plugin will also return a serverAuthCode, which can be used to grant offline access to a non-Google server
				},
				(obj) => {
					// VALUES
					let userObject: any = {
						firstName: obj.firstName,
						lastName: obj.lastName,
						email: obj.email,
						password: '',
						photoUrl: obj.photoUrl,
						provider: 'google',
						idToken: obj.idToken
					}

					this._signUp(userObject);
				},
				(msg) => {
					alert('error: ' + msg);
				}
			);
		} else {
			// SIGN IN
			this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID, googleLoginOptions).then((obj) => {
				// VALUES
				let userObject: any = {
					firstName: obj.firstName,
					lastName: obj.lastName,
					email: obj.email,
					password: '',
					photoUrl: obj.photoUrl,
					provider: 'google',
					idToken: obj.idToken
				}

				this._signUp(userObject);
			}).catch((err) => {
				// STOP LOADER
				this.state.stop();

				// ENABLE INPUTS
				this.googleSignUpLoading = false;
				this.register.enable();
			});
		}
	}
}

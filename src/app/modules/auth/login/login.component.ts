import { Component, OnInit, ViewChild, OnDestroy, ElementRef } from '@angular/core';

// RXJS
import { Subscription } from 'rxjs';

// SEO
import { Meta, Title } from '@angular/platform-browser';

// FORMGROUP
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

// SERVICES
import { AuthService, HttpCancelService, ModalService, UserAPIService, InstallPWAService } from '../../../shared/services';

// BOOTSTRAP
import { AlertComponent } from 'ngx-bootstrap/alert';

// ENV
import { environment } from '../../../../environments/environment';

// LOADER
import { LoadingBarService } from '@ngx-loading-bar/core';

// SOCIAL LOGIN
import { SocialAuthService, GoogleLoginProvider } from '@abacritt/angularx-social-login';

// CORDOVA
declare var window: any;

@Component({
	selector: 'login',
	templateUrl: 'login.component.html',
	styleUrls: ['login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
	// FORMGROUP
	login: FormGroup;

	// BOOLEAN
	first = true;
	icon = false;
	show = false;
	googleSignInLoading = false;
	loginLoading = false;

	// ARRAY
	message: Array<object> = [];
	items: Array<object> = [];

	// SUBSCRIPTIONS
	private _subscriptions: any = new Subscription();

	// LOADER
	state = this.LB;

	// ANY
	gl: any;

	// ELEMENT REF
	@ViewChild('email', { static: false }) email: ElementRef;
	@ViewChild('pass', { static: false }) pass: ElementRef;

	constructor(
		public IS: InstallPWAService,
		private US: UserAPIService,
		private meta: Meta,
		private title: Title,
		private AS: AuthService,
		private socialAuthService: SocialAuthService,
		private fb: FormBuilder,
		private _modalService: ModalService,
		private httpCancelService: HttpCancelService,
		private LB: LoadingBarService
	) { }

	ngOnInit() {
		this.meta.updateTag({ name: 'robots', content: 'noindex, nofollow' });
		this.meta.updateTag({ name: 'google-signin-client_id', content: environment.googleClientId });
		this.title.setTitle('Log In - grceri');

		this._form();
		this._processAlertInformation();
	}

	ngOnDestroy(): void {
		this._subscriptions.unsubscribe();
		this.httpCancelService.cancelPendingRequests();
		if (!environment.production && !this.httpCancelService) {
			console.log('canceled pending request');
		}
	}

	private _processAlertInformation(): void {
		this._subscriptions.add(this._modalService.fetchModalData().subscribe(res => {
			if (res) {
				switch (res.type) {
					case 'credential-updated':
						this._message('success', res.value);
						break;
				}
			}
		}));
	}

	private _form() {
		return (this.login = this.fb.group({
			email: ['', Validators.compose([Validators.required, Validators.email])],
			password: ['', Validators.compose([Validators.required, Validators.minLength(8)])],
			remember: [''],
		}));
	}

	submit(email, password, remember?) {
		// if (navigator.credentials) {
		// 	// CREATE STORE
		// 	let passwordcred = new PasswordCredential({
		// 		type: 'password',
		// 		id: email,
		// 		password: password,
		// 	});

		// 	// PASS TO BROWSER
		// 	navigator.credentials.store(passwordcred);
		// }

		this.icon = true;
		this.loginLoading = true;

		// LOADER
		this.state.start();

		let loginObject: any = {
			email,
			password
		};

		this._subscriptions.add(this.AS.login(loginObject).subscribe((res) => {
			res = JSON.parse(res._body);
			let loginType = 'regular';

			if (res.success) {
				this._desktopLoginCallback(res.token, loginType);
			}
		},
			(err) => {
				this.icon = false;
				this.loginLoading = false;

				// LOADER
				this.state.stop();

				// INFOWINDOW
				this._message('error', 'Password and or email is incorrect, please try again.');
			}));

	}

	checkEmail() {
		let email = this.login.controls.email.value;

		if (this.validateEmail(email)) {
			// LOADING
			this.icon = true;

			// CHECK EMAIL
			this._subscriptions.add(this.US.getEmail(email).subscribe(res => {
				// LOADING
				this.icon = false;

				this.first = false;

				// // IF EXISTS
				// if (res['user']) {
				// 	// GO TO SECOND PAGE
				// 	this.first = false;
				// } else {
				// 	// SEND MESSAGE ERROR
				// 	this._message('danger', `This email address doesn't exist.`);
				//
				// 	// SET INPUT TO FALSE
				// 	this.login.controls.email.setErrors({ incorrect: true });
				// }
			}));
		}
	}

	validateEmail(email) {
		let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(String(email).toLowerCase());
	}

	private _autoLogin() {
		if (navigator.credentials) {
			navigator.credentials.get({ mediation: 'optional' }).then(credential => {
				if (!credential) {
					throw new Error('No credential found');
				} else {
					const email = credential.id;
					const password = credential['password'];

					if (email && password) {
						this.login.controls.email.setValue(email);
						this.login.controls['email'].markAsTouched();

						this.checkEmail();

						// SET PASSWORD VALUE
						this.login.controls.password.setValue(password);
						this.login.controls['password'].markAsTouched();

						// Consider uncommenting the line below if you want to automatically submit the form
						// this.submit(email, password);
					} else {
						throw new Error('Invalid credential format');
					}
				}
			})
				.catch(error => {
					// Handle errors here, such as showing a message to the user
					console.error('Auto-login error:', error);
				});
		}
	}



	private _message(a, b) {
		this.message.push({
			type: a,
			value: b,
		});
	}

	private _close(a: AlertComponent) {
		this.message = this.message.filter(i => i !== a);
	}

	onGoogleSignIn() {
		const googleLoginOptions = {
			scope: 'profile email openid'
		};

		// DISABLE INPUTS
		this.googleSignInLoading = true;

		if (environment.mobile) {

			window.plugins.googleplus.login(
				{
					'webClientId': '867235308213-is2ib6551umaogigiebegs60te5scnj3.apps.googleusercontent.com',
					'offline': true // optional, but requires the webClientId - if set to true the plugin will also return a serverAuthCode, which can be used to grant offline access to a non-Google server
				},
				(obj) => {
					this._mobileLoginCallback(obj.accessToken);
				},
				(msg) => {
					alert('error: ' + msg);
				}
			);

			// ENABLE INPUTS
			this.googleSignInLoading = false

		} else {
			// SIGN IN
			this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID, googleLoginOptions).then((userData) => {
				// DISABLE INPUTS
				this.googleSignInLoading = true;
				this.login.controls['email'].disable();

				// START LOADER
				this.state.start();

				// LOGIN OBJ
				let loginObject: any = {
					provider: 'google',
					idToken: userData.idToken
				};

				this._subscriptions.add(this.AS.login(loginObject).subscribe((res) => {
					res = JSON.parse(res._body);
					let loginType = 'google';

					if (res.success) {
						this._desktopLoginCallback(res.token, loginType);
					}
				}));
			}).catch((err) => {
				// STOP LOADER
				this.state.stop();

				// ENABLE INPUTS
				this.googleSignInLoading = false;
				this.login.controls['email'].enable();
			});
		}
	}

	private _desktopLoginCallback(token: string, loginType: string) {
		let tokenObject: any = {
			jwt_token: token
		};

		this._subscriptions.add(this.AS.loginCallback(tokenObject).subscribe((res) => {
			res = JSON.parse(res._body);
			res.jwt_token = token;

			if (res.success) {
				// INFOWINDOW
				this._message('success', 'You have succesfully logged in.');

				// LOADING
				this.state.complete();
				this.state.stop();

				this.AS.handleUserAuthentication(res, loginType);

				this.socialAuthService.signOut();
			}
		}));
	}

	private _mobileLoginCallback(token) {
		if (token) {
			// DISABLE INPUTS
			this.googleSignInLoading = true;
			this.login.controls['email'].disable();

			// START LOADER
			this.state.start();

			// LOGIN OBJ
			let loginObject: any = {
				provider: 'google',
				idToken: token
			};

			this.AS.login(loginObject).subscribe(
				(res) => {
					res = JSON.parse(res._body);
					let loginType = 'google';

					if (res.success) {
						this._message('success', `You have successfully logged in.`);

						this.AS.processSocialLoginCallback(res.token, loginType);

						// LOGOUT
						this.gl.logOut();
					}
				},
				(err) => {
					// STOP LOADER
					this.state.stop();

					// ENABLE INPUTS
					this.googleSignInLoading = false;
					this.login.controls['email'].enable();

					// SEND MESSAGE ERROR
					this._message('danger', `Something went, wrong try again later.`);
				});
		}
	}
}

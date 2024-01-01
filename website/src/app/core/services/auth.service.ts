import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as auth0 from 'auth0-js';
import { DomSanitizer } from '@angular/platform-browser';
import { map, mergeMap, take } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { LocalStorage } from './localstorage.service';
import { HttpClient } from '@angular/common/http';
import { Observable, of, timer } from 'rxjs';

@Injectable()
export class AuthService {
	refreshSub: any;
	userProfile: any;
	refreshSubscription: any;
	renew: boolean;
	url = environment.production ? 'https://grceri.com' : 'http://localhost:4200';

	auth0 = new auth0.WebAuth({
		clientID: 'ZCYENiv9XlVnmFHzROFAzVcmrOEVlces',
		domain: 'whereinmarket.auth0.com',
		audience: `https://whereinmarket.auth0.com/userinfo`,
		redirectUri: this.url + '/callback',
		responseType: 'token id_token',
		scope: 'openid profile'
	});

	constructor(private LS: LocalStorage, private router: Router, private sanitizer: DomSanitizer, private http: HttpClient) {
	}

	public login(email: string, password: string, renew?: boolean): Observable<string> {

		let loginObservable = Observable.create(observer => {
			this.auth0.login(
				{
					realm: 'mssql',
					email,
					password
				},
				(err, authResult) => {
					if (err) {
						observer.next(err);
					}
					observer.complete();
				}
			);
		});

		return loginObservable;
	}


	public signup(email: string, password: string, plan?: string, options?: object): void {
		this.auth0.redirect.signupAndLogin({
			realm: 'mssql',
			email,
			password,
			app_metadata: { plan: plan },
			user_metadata: options
		}, err => {
			if (err) {
				console.log(err);
				alert(`Error: ${err.description}. Check the console for further details.`);
				return;
			}
		});
	}

	public resetPassword(email: string): Observable<string> {
		let resetObservable = Observable.create(observer => {
			this.auth0.redirect.changePassword({
				realm: 'mssql',
				email
			},
				(err, authResult) => {
					if (err) {
						observer.next(err);
					}
					observer.complete();
				}
			);
		});

		return resetObservable;
	}

	public checkemail(email: string): void {
		this.auth0.redirect.checkEmail({
			realm: 'mssql',
			email
		}, err => {
			if (err) {
				console.log(err);
				alert(`Error: ${err.description}. Check the console for further details.`);
				return;
			}
		});
	}

	public checkEmail(i): Observable<any[]> {
		// backend call.
		return this.http.get<any[]>('/api/email').pipe(map((r: any) => r.json()));
	}

	public handleAuthentication(): void {
		this.auth0.parseHash((err, authResult) => {
			if (authResult && authResult.accessToken && authResult.idToken) {
				this.setSession(authResult);
			} else if (err) {
				this.router.navigate(['/login']);
				console.log(err);
				alert(`Error: ${err.error}. Check the console for further details.`);
			}
		});
	}

	private setSession(authResult, renew?): void {
		// Set the time that the access token will expire at
		const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + Date.now());

		this.LS.set('access_token', authResult.accessToken);
		this.LS.set('id_token', authResult.idToken);
		this.LS.set('expires_at', expiresAt);

		if (renew) {
			this.scheduleRenewal();
		}

		const r = this.LS.get('authRedirect');
		const navArr = r === null ? '/user' : r;

		this.router.navigate([navArr]);
		this._clearRedirect();
	}

	public scheduleRenewal() {
		if (!this.isAuthenticated()) {
			return;
		}

		this.unscheduleRenewal();

		const expiresAt = JSON.parse(window.localStorage.getItem('expires_at'));

		const expiresIn$ = of(expiresAt).pipe(
			mergeMap((expiresAt) => {
				const now = Date.now();
				// Use timer to track delay until expiration
				// to run the refresh at the proper time
				return timer(Math.max(1, expiresAt - now)).pipe(take(1));
			})
		);

		// Once the delay time from above is
		// reached, get a new JWT and schedule
		// additional refreshes
		this.refreshSub = expiresIn$.subscribe(() => {
			this.renewToken();
			this.scheduleRenewal();
		});
	}

	private _clearRedirect() {
		// Remove redirect from localStorage
		return this.LS.remove('authRedirect');
	}

	private _clearOldNonces() {
		Object.keys(localStorage).forEach(key => {
			if (!key.startsWith('com.auth0.auth')) return;
			this.LS.remove(key);
		});
	}

	public unscheduleRenewal() {
		if (this.refreshSub) {
			this.refreshSub.unsubscribe();
		}
	}

	public renewToken() {
		this.auth0.checkSession({}, (err, result) => {
			if (err) {
				console.log(err);
			} else {
				this.setSession(result);
			}
		});
	}


	public logout(): void {
		// Remove tokens and expiry time from localStorage
		this.LS.remove('access_token');
		this.LS.remove('id_token');
		this.LS.remove('expires_at');

		this._clearOldNonces();
		this._clearRedirect();

		// Go back to the home route
		this.router.navigate(['/']);
	}

	public isAuthenticated(): boolean {
		// Check whether the current time is past the
		// access token's expiry time
		const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
		return new Date().getTime() < expiresAt;
	}

	public getProfile(cb): void {
		this.LS.get('access_token').subscribe((r) => {
			if (r) {
				const self = this;
				this.auth0.client.userInfo(r, (err, profile) => {
					if (profile) {
						self.userProfile = profile;
					}
					cb(err, profile);
				});
			}
		});

	}

	changePassword(options, cb) {

	}

	forgotPassword() {

	}

}

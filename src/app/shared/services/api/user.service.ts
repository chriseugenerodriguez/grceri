import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

// RXJS
import { BehaviorSubject, Observable, catchError, of, tap, throwError } from 'rxjs';
import { Subscription } from 'rxjs';

// INTERFACES
import { IProfile } from '../../interfaces';

// ENV
import { environment } from '../../../../environments/environment';

// ROUTES
const api = `${environment.host}/api/`;

@Injectable()
export class UserAPIService implements OnDestroy {

	// SUBJECT
	profile$ = new BehaviorSubject(null);

	// OBJECT
	apiProfileInformation: IProfile;

	// SUBSCRIPTIONS
	subscriptions: any;

	constructor(private http: HttpClient) {
		this.subscriptions = new Subscription();

		this._fetchProfileInformation();
	}

	ngOnDestroy() {
		if (this.subscriptions) {
			this.subscriptions.unsubscribe();
		}
	}

	// GETS
	getEmail(val: string) {
		return this.http.get(api + 'users/email/' + val).pipe(
			catchError(this._errorHandler)
		);
	}

	getWatchlists(uid: number) {
		return this.http.get(`${api}users/${uid}/watchlist`).pipe(
			catchError(this._errorHandler)
		);
	}

	getViewedProducts(uid: number, pageSize: number = 10) {
		return this.http.get(`${api}users/${uid}/viewed/${pageSize}`).pipe(
			catchError(this._errorHandler)
		);
	}

	getSaved(uid: number) {
		return this.http.get(`${api}users/${uid}/saved`).pipe(
			catchError(this._errorHandler)
		);
	}

	getSearched(uid: number) {
		return this.http.get(`${api}users/${uid}/history/search`).pipe(
			catchError(this._errorHandler)
		);
	}

	getUser(uid: number) {
		return this.http.get(`${api}users/${uid}`).pipe(
			catchError(this._errorHandler)
		);
	}

	getTwoFactorAuthentication(uid: number) {
		return this.http.get(`${api}users/${uid}/settings/security/two-factor`).pipe(
			catchError(this._errorHandler)
		);
	}

	getUserPaymentMethods(userId: number) {
		return this.http.get(`${api}users/${userId}/settings/payment`).pipe(
			catchError(this._errorHandler)
		);
	}

	// PUT

	updatePassword(uid: number, obj: any = {}) {
		return this.http.put(`${api}users/${uid}/settings/security/password`, obj).pipe(
			catchError(this._errorHandler)
		);
	}

	updateEmail(uid: number, obj: any = {}) {
		return this.http.put(`${api}users/${uid}/settings/security/email`, obj).pipe(
			catchError(this._errorHandler)
		);
	}

	updateProfile(uid: number, obj: any = {}) {
		return this.http.put(`${api}users/${uid}/settings/profile`, obj).pipe(
			catchError(this._errorHandler)
		);
	}

	updateTwoFactorAuthentication(uid: number, obj: any = {}) {
		return this.http.put(`${api}users/${uid}/settings/security/two-factor`, obj).pipe(
			catchError(this._errorHandler)
		);
	}

	editPaymentMethod(userId: number, paymentId: number, obj: any = {}) {
		return this.http.put(`${api}users/${userId}/settings/payment/${paymentId}`, obj).pipe(
			catchError(this._errorHandler)
		);
	}

	setPrimaryPaymentMethod(userId: number, paymentId: number, obj: any = {}) {
		return this.http.put(`${api}users/${userId}/settings/payment/primary/${paymentId}`, obj).pipe(
			catchError(this._errorHandler)
		);
	}

	// POST
	postSearched(uid: number, obj: any = {}) {
		return this.http.post(`${api}users/${uid}/history/search`, obj).pipe(
			catchError(this._errorHandler)
		);
	}

	postProductStatusViewed(obj: any = {}) {
		return this.http.post(`${api}users/postProductStatusViewed`, obj).pipe(
			catchError(this._errorHandler)
		);
	}

	postProduct(obj: any = {}) {
		return this.http.post(`${api}users/postProduct`, obj).pipe(
			catchError(this._errorHandler)
		);
	}

	postWatchlist(obj: any = {}) {
		return this.http.post(`${api}users/postWatchlist`, obj).pipe(
			catchError(this._errorHandler)
		);
	}

	verifyUserPassword(uid: number, obj: any = {}) {
		return this.http.post(`${api}users/${uid}/validatePassword`, obj).pipe(
			catchError(this._errorHandler)
		);
	}

	createStripeAccount(obj: any = {}) {
		return this.http.post(`${api}users/customer`, obj).pipe(
			catchError(this._errorHandler)
		);
	}

	createPaymentMethod(userId: number, obj: any = {}) {
		return this.http.post(`${api}users/${userId}/settings/payment/add`, obj).pipe(
			catchError(this._errorHandler)
		);
	}

	chargeCustomer(userId: number, obj: any = {}) {
		return this.http.post(`${api}users/${userId}/settings/payment/pay`, obj).pipe(
			catchError(this._errorHandler)
		);
	}

	createSubscription(obj: any = {}) {
		return this.http.post(`${api}users/subscription`, obj).pipe(
			catchError(this._errorHandler)
		);
	}

	// DELETE
	deleteAllRecentlySearched(uid) {
		return this.http.delete(`${api}users/${uid}/history/search`).pipe(
			catchError(this._errorHandler)
		);
	}

	deleteRecentlyViewedProduct(obj: any = {}) {
		return this.http.delete(`${api}users/${obj.uid}/viewed/${obj.productID}`).pipe(
			catchError(this._errorHandler)
		);
	}

	deleteProduct(obj: any = {}) {
		return this.http.delete(`${api}users/${obj.uid}/deleteProduct/${obj.productID}`).pipe(
			catchError(this._errorHandler)
		);
	}

	removeFromWatchList(obj: any = {}) {
		return this.http.delete(`${api}users/${obj.uid}/removeFromWatchList/${obj.productID}`).pipe(
			catchError(this._errorHandler)
		);
	}

	removePaymentMethod(userId: number, paymentId: number) {
		return this.http.delete(`${api}users/${userId}/settings/payment/${paymentId}`).pipe(
			catchError(this._errorHandler)
		);
	}

	cancelSubscription(obj: any = {}) {
		const options = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json'
			}),
			body: obj
		};

		return this.http.delete(`${api}users/subscription`, options).pipe(
			catchError(this._errorHandler)
		);
	}

	// SHARED DATA
	processProfileInformation(uid: number): Observable<any> {
		return this.http.get(`${api}users/${uid}/settings/profile`).pipe(
			tap((data: any) => this.profile$.next(data)),
			catchError(this._errorHandler)
		);
	}

	private _fetchProfileInformation() {
		this.subscriptions.add(this.profile$.subscribe((res: any) => {
			this.apiProfileInformation = res;
		}));
	}

	getUserProfile(): Observable<IProfile | null> {
		return this.apiProfileInformation ? of(this.apiProfileInformation) : this.profile$;
	}

	private _errorHandler(error: HttpErrorResponse): Observable<never> {
		if (!environment.production) {
			console.error(error);
		}
		return throwError(error || 'Server Error');
	}
}

import { Injectable, Inject, OnDestroy, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

// HHTP
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

// RXJS
import { Observable, Subject, Subscription, catchError, map, of, tap } from 'rxjs';

// ENV
import { environment } from '../../../../environments/environment';

// ROUTES
const api = `${environment.host}/api`;

@Injectable()
export class PaymentAPIService implements OnDestroy {
	// CATEGORIES
	apiPaymentInformation: any;

	// Payment Fields
	addressLine1: boolean;
	addressLine2: boolean;
	state: boolean;
	zip: boolean;
	city: boolean;
	phone: boolean;

	// SUBJECT
	payments$ = new Subject<object>();

	// SUBSCRIPTION
	private _subscriptions: any = new Subscription();

	constructor(
		@Inject(PLATFORM_ID) private platform: any,
		private http: HttpClient
	) {
		this._fetchPaymentInformation();
	}

	ngOnDestroy() {
		this._subscriptions.unsubscribe();
	}

	processPaymentAPI(userId: number): Observable<any> {
		return this.http.get<any>(`${api}/users/${userId}/settings/payment`).pipe(
			map((res: any) => res),
			tap((data: any) => {
				this.payments$.next(data);
			}),
			catchError(this.handleError)
		);
	}

	private _fetchPaymentInformation() {
		this._subscriptions.add(this.payments$.subscribe((res: any) => {
			this.apiPaymentInformation = res;
		}));
	}

	getPayments() {
		return this.apiPaymentInformation ?
			of(this.apiPaymentInformation) : this.payments$;
	}

	private handleError(err: HttpErrorResponse) {
		let errorMessage = '';
		if (err.error instanceof Error) {
			errorMessage = `An error occurred: ${err.error.message}`;
		} else {
			errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
		}
		// console.error(errorMessage);
		return of(null);
	}
}

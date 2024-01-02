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
export class SubscriptionAPIService implements OnDestroy {
	// PLAN SUBSCRIPTION
	apiSubscriptionInformation: any;

	// SUBJECT
	subscription$ = new Subject<object>();

	// SUBSCRIPTION
	private _subscriptions: any = new Subscription();

	constructor(
		@Inject(PLATFORM_ID) private platform: any,
		private http: HttpClient
	) {
		this._fetchSubscriptionInformation();
	}

	ngOnDestroy() {
		this._subscriptions.unsubscribe();
	}

	processSubscriptionAPI(userId: number): Observable<any> {
		return this.http.get(`${api}/users/${userId}/settings/subscription`).pipe(
			map((res: any) => res),
			tap((data: any) => {
				this.subscription$.next(data);
			}),
			catchError(error => this.handleError(error))
		);
	}

	private _fetchSubscriptionInformation() {
		this._subscriptions.add(this.subscription$.subscribe((res: any) => {
			this.apiSubscriptionInformation = res;
		}));
	}

	getSubscription() {
		return this.apiSubscriptionInformation ?
			of(this.apiSubscriptionInformation) : this.subscription$;
	}

	private handleError(err: HttpErrorResponse) {
		if (err.status === 404) {
			this.subscription$.next({ plan: 'free', cost: 0 });
		}

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

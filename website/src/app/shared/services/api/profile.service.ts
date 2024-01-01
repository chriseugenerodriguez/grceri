import { Injectable, Inject, OnDestroy, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

// HHTP
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

// RXJS
import 'rxjs/add/observable/of';
import { Observable, Subject, Subscription, catchError, map, of, tap } from 'rxjs';

// ENV
import { environment } from '../../../../environments/environment';

// ROUTES
const api = `${environment.host}/api`;

@Injectable()
export class ProfileAPIService implements OnDestroy {
	// CATEGORIES
	apiProfileInformation: any;

	// SUBJECT
	profile$ = new Subject<any[]>();

	// SUBSCRIPTION
	private _subscriptions: any = new Subscription();

	constructor(
		@Inject(PLATFORM_ID) private platform: any,
		private http: HttpClient
	) {
		this.fetchProfileInformation();
	}

	ngOnDestroy() {
		this._subscriptions.unsubscribe();
	}

	processProfileAPI(jwt_token: string): Observable<any> {
		return this.http.get<any>(`${api}/user/profile/${jwt_token}`).pipe(
			map((res: any) => res),
			tap((data: any) => {
				this.profile$.next(data);
			}),
			catchError(this.handleError)
		);
	}
	fetchProfileInformation() {
		this._subscriptions.add(this.profile$.subscribe((res: any) => {
			this.apiProfileInformation = res;
		}));
	}

	getProfile() {
		return this.apiProfileInformation ?
			of(this.apiProfileInformation) : this.profile$;
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

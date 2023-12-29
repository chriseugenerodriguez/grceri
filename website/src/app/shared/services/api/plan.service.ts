import { Injectable, Inject, OnDestroy, PLATFORM_ID } from '@angular/core';

// HHTP
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

// RXJS
import { Subscription, BehaviorSubject, of, catchError, map, tap, throwError } from 'rxjs';

// ENV
import { environment } from '../../../../environments/environment';

// ROUTES
const api = `${environment.host}/api`;

@Injectable()
export class PlanAPIService implements OnDestroy {
	// CATEGORIES
	apiPlanLimitsInformation: any;

	// SUBJECT
	planLimits$ = new BehaviorSubject(null);

	// SUBSCRIPTION
	planLimitsSubscription: Subscription;

	// BOOLAEN
	isAddToListActive: boolean = false;

	constructor(
		@Inject(PLATFORM_ID) private platform: any,
		private http: HttpClient
	) {
		this.fetchPlanLimitsInformation();
	}

	ngOnDestroy() {
		this.planLimitsSubscription.unsubscribe();
	}

	processPlanLimits(userId: number) {
		this.apiPlanLimitsInformation = undefined;
		this.isAddToListActive = false;

		return this.http.get(`${api}/users/${userId}`)
			.pipe(
				map((res: any) => res),
				tap((data: any) => {
					this.planLimits$.next(data);
					this.isAddToListActive = data.interactions['shoppingLists'] >= data.planLimits['shoppingLists'] ? false : true;
				}),
				catchError(this.handleError)
			);
	}

	fetchPlanLimitsInformation() {
		this.planLimitsSubscription = this.planLimits$.subscribe((res: any) => {
			this.apiPlanLimitsInformation = res;
		})
	}

	getPlanLimits() {
		return this.apiPlanLimitsInformation ?
			of(this.apiPlanLimitsInformation) : this.planLimits$;
	}

	getMaxCloseLimits(maxLimit: number): number {
		let closeLimit: number;

		if (maxLimit && maxLimit > 3) {
			closeLimit = maxLimit - 3;
		} else {
			closeLimit = 0;
		}

		return closeLimit;
	}

	private handleError(error: any) {
		if (!environment.production) {
			console.error(error);
		}
		return throwError(error || 'Server Error');
	}
}

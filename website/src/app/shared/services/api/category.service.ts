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
export class CategoryAPIService implements OnDestroy {
	// CATEGORIES
	apiCategoriesInformation: any;

	// SUBJECT
	categories$ = new Subject<any[]>();

	// SUBSCRIPTION
	categoriesSubscription: Subscription;

	constructor(
		@Inject(PLATFORM_ID) private platform: any,
		private http: HttpClient
	) {
		this.fetchCategoriesInformation();
	}

	ngOnDestroy() {
		this.categoriesSubscription.unsubscribe();
	}

	processCategoriesAPI(): Observable<any> {
		const url = 'misc/categories';

		return this.http.get<any>(`${api}/${url}`).pipe(
			map((res: any) => res),
			tap((data: any) => {
				this.categories$.next(data);
			}),
			catchError(this.handleError)
		);
	}

	fetchCategoriesInformation() {
		this.categoriesSubscription = this.categories$.subscribe((res: any) => {
			this.apiCategoriesInformation = res;
		})
	}

	getCat() {
		return this.apiCategoriesInformation ?
			of(this.apiCategoriesInformation) : this.categories$;
	}

	formatted(i) {
		if (i) {
			return i.toString().toLowerCase().replace(/[^a-zA-Z0-9]/g, '-').replace(/-{2,}/g, '-');
		}
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

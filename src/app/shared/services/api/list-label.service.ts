import { Injectable, OnDestroy } from '@angular/core';

// HHTP
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

// RXJS
import 'rxjs/add/observable/of';
import { Subscription, BehaviorSubject, catchError, map, tap, of, Observable } from 'rxjs';

// ENV
import { environment } from '../../../../environments/environment';

// ROUTES
const api = `${environment.host}/api`;

@Injectable()
export class ListLabelAPIService implements OnDestroy {
	// LABELS
	apiListLabelInformation: any;

	// SUBJECT
	listLabel$ = new BehaviorSubject(null);
	data$: BehaviorSubject<any> = new BehaviorSubject(null);

	// SUBSCRIPTION
	listLabelSubscription: Subscription;

	// OTHERS
	userLists = [];

	constructor(
		private http: HttpClient
	) {
		this.fetchListLabelInformation();
	}

	ngOnDestroy() {
		this.listLabelSubscription.unsubscribe();
	}

	fetchData() {
		return this.data$;
	}

	processListLabels(userId: number): Observable<any> {
		this.apiListLabelInformation = undefined;

		return this.http.get<any>(`${api}/users/${userId}/labels`).pipe(
			map((res: any) => res),
			tap((data: any) => {
				this.apiListLabelInformation = data; // Assuming you want to update apiListLabelInformation
			}),
			catchError(this._errorHandler)
		);
	}

	postUserLabel(userId: number, label: string, obj: any = {}) {
		return this.http.post(`${api}/users/${userId}/labels/${label}`, obj).pipe(
			catchError(this._errorHandler)
		);
	}

	putUserLabels(userId: number, obj: any = {}) {
		return this.http.put(`${api}/users/${userId}/labels`, obj).pipe(
			catchError(this._errorHandler)
		);
	}

	putUserListLabels(userId: number, listId: string, obj: any = {}) {
		return this.http.put(`${api}/users/${userId}/lists/${listId}/labels`, obj).pipe(
			catchError(this._errorHandler)
		);
	}

	fetchListLabelInformation() {
		this.listLabelSubscription = this.listLabel$.subscribe((res: any) => {
			this.apiListLabelInformation = res;
		})
	}

	getUserLabels() {
		return this.apiListLabelInformation ?
			of(this.apiListLabelInformation) : this.listLabel$;
	}

	getUserListLabels(userId: number, listId: string) {
		return this.http.get(`${api}/users/${userId}/lists/${listId}/labels`).pipe(
			catchError(this._errorHandler)
		);
	}

	createUserListLabel(userId: number, listId: string, labelName: string, obj: any = {}) {
		return this.http.post(`${api}/users/${userId}/lists/${listId}/labels/${labelName}`, obj).pipe(
			catchError(this._errorHandler)
		);
	}

	removeUserListLabel(userId: number, listId: string, labelName: string, obj: any = {}) {
		return this.http.delete(`${api}/users/${userId}/lists/${listId}/labels/${labelName}`, obj).pipe(
			catchError(this._errorHandler)
		);
	}

	private _errorHandler(err: HttpErrorResponse) {
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

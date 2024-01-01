import { Injectable } from '@angular/core';

// RXJS
import { Observable, catchError, map, of } from 'rxjs';

// HTTP
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

// SERVICES
import { ModalService } from '../modal/modal.service';

// ENVIRONMENT
import { environment } from '../../../../environments/environment';

// ROUTES
const api = `${environment.host}/api/`;

@Injectable()
export class ShoppingListAPIService {
	selectedShoppingList: any = '';

	// ARRAY
	message: Array<object> = [];
	shoppingList: any[];

	constructor(private http: HttpClient, private MS: ModalService) {
	}

	postShoppinglist(uid: number, name: string, obj?: {}): Observable<any> {
		return this.http.post(`${api}users/${uid}/list/${name}`, obj).pipe(
			map((res: any) => res),
			catchError(this._errorHandler)
		);
	}

	updateShoppinglist(uid: number, listId: any, productId: number, obj?: {}): Observable<any> {
		return this.http.post(`${api}users/${uid}/lists/${listId}/${productId}`, obj).pipe(
			map((res: any) => res),
			catchError(this._errorHandler)
		);
	}

	updateShoppinglistItems(uid: number, listId: any, obj?: {}) {
		return this.http.put(`${api}users/${uid}/lists/${listId}`, obj).pipe(
			catchError(this._errorHandler)
		);
	}

	deleteShoppinglistItem(uid: any, listId: any, productID: any, obj?: {}) {
		return this.http.delete(`${api}users/${uid}/lists/${listId}/delete/${productID}`).pipe(
			catchError(this._errorHandler)
		);
	}

	deleteShoppinglist(uid: any, listId: any, obj?: {}) {
		return this.http.delete(`${api}users/${uid}/lists/${listId}`).pipe(
			catchError(this._errorHandler)
		);
	}

	followShoppinglist(uid: any, listId: any, obj?: {}) {
		return this.http.post(`${api}users/${uid}/lists/${listId}`, obj).pipe(
			catchError(this._errorHandler)
		);
	}

	unfollowShoppinglist(uid: any, listId: any, obj?: {}) {
		return this.http.post(`${api}users/${uid}/lists/${listId}/unfollow`, obj).pipe(
			catchError(this._errorHandler)
		);
	}

	userShoppingList(uid: number) {
		return this.http.get(`${api}users/${uid}/lists`).pipe(
			catchError(this._errorHandler)
		);
	}

	getDiscoverLists() {
		return this.http.get(`${api}users/lists/discover`).pipe(
			catchError(this._errorHandler)
		);
	}

	getFollowedLists(uid: number) {
		return this.http.get(`${api}users/${uid}/lists/following`).pipe(
			catchError(this._errorHandler)
		);
	}

	getList(uid: number, lid: string) {
		return this.http.get(`${api}users/${uid}/lists/${lid}`).pipe(
			catchError(this._errorHandler)
		);
	}

	getLists(uid: number) {
		return this.http.get(`${api}users/${uid}/lists`).pipe(
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
		console.error(errorMessage);
		return of(null);
	}
}

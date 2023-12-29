import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// RXJS
import { Observable, catchError, throwError } from 'rxjs';

// ENV
import { environment } from '../../../../environments/environment';

// ROUTES
const api = `${environment.host}/api/`;

@Injectable()
export class ListsAPIService {
	constructor(private http: HttpClient) { }

	// GETS
	getMostFollowed() {
		return this.http.get(api + 'lists/followed').pipe(
			catchError(this._errorHandler)
		);
	}

	getMostWatched() {
		return this.http.get(api + 'lists/watched').pipe(
			catchError(this._errorHandler)
		);
	}

	getMostViewed() {
		return this.http.get(api + 'lists/viewed').pipe(
			catchError(this._errorHandler)
		);
	}

	getMostViewedProduct(productId: number) {
		return this.http.get(api + 'lists/viewed/' + productId).pipe(
			catchError(this._errorHandler)
		);
	}

	getMostWatchedProduct(productId: number) {
		return this.http.get(api + 'lists/watched/' + productId).pipe(
			catchError(this._errorHandler)
		);
	}

	private _errorHandler(error: Response) {
		if (!environment.production) {
			console.error(error);
		}
		return throwError(error || 'Server Error');
	}
}

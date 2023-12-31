import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// RXJS
import { Observable, catchError, throwError } from 'rxjs';

// ENV
import { environment } from '../../../../environments/environment';

// ROUTES
const api = `${environment.host}/api/`;

@Injectable()
export class SearchAPIService {
	constructor(private http: HttpClient) { }
	/**
	 * API call for search page sidebar
	 */
	getSearchPageSidebar(id: number, text: string): Observable<any> {
		return this.http.get<any>(`${api}search/sidebar?id=${id}&text=${text}`).pipe(
			catchError(this._errorHandler)
		);
	}

	/**
	 * API call for search page content
	 */
	getSearchPageContent(id: number, filter: string = '', order: string = '', text: string, page: number = 1): Observable<any> {
		return this.http.get<any>(`${api}search/content?id=${id}&filter=${filter}&order=${order}&text=${text}&page=${page}`).pipe(
			catchError(this._errorHandler)
		);
	}

	// SEARCH
	searchProducts(val: any): Observable<any> {
		return this.http.get<any>(`${api}search/${val}`).pipe(
			catchError(this._errorHandler)
		);
	}

	checkUrlExists(obj: any = {}): Observable<any> {
		return this.http.post<any>(`${api}search/url/exists`, obj).pipe(
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

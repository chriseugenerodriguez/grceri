import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';

export let api = '';

@Injectable()
export class API {

	constructor(private http: HttpClient) { }

	// QUERIES
	public nutritionix(apiname: string): Observable<any[]> {
		let url = 'https://trackapi.nutritionix.com/v2/';

		api = url + apiname;

		const nutritionixOptions = {
			headers: new HttpHeaders({
				'x-app-id': '4308b89b',
				'x-app-key': '284b707371c995f6dd35c321ac4436ee'
			})
		};

		return this.http.get(api, nutritionixOptions).pipe(
			map((response: any) => response),
			catchError(this._errorHandler)
		);
	}

	public upcitemdb(type: string, s: string): Observable<any[]> {
		const url = 'https://api.upcitemdb.com/prod/trial/';

		if (type === 'search') {
			return this.http.get<any[]>(`${url}search?s=${s}`).pipe(
				catchError(this._errorHandler)
			);
		} else {
			return this.http.get<any[]>(`${url}lookup?upc=${s}`).pipe(
				catchError(this._errorHandler)
			);
		}
	}

	public edamam(q: string): Observable<any[]> {
		const key = '4d0a4d5ca7ebb87aec61dd4256e6f369';
		const id = '8a2e1f02';
		const url = `https://api.edamam.com/search?q=${q}&app_id=${id}&app_key=${key}`;

		return this.http.get<any[]>(url).pipe(
			catchError(this._errorHandler)
		);
	}

	private _errorHandler(error: any): Observable<never> {
		console.error(error);
		return throwError(error || 'Server Error');
	}
}

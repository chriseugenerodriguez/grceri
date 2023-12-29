import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

// RXJS
import { catchError, map, throwError } from 'rxjs';

// ENV
import { environment } from '../../../../environments/environment';

@Injectable()
export class CommonService {

	constructor(private http: HttpClient) { }

	product(i) {
		if (i) {
			return i
				.toString()
				.toLowerCase()
				.replace(/[^a-zA-Z0-9]/g, '-')
				.replace(/-{2,}/g, '-');
		}
	}

	getContryList() {
		return this.http.get('assets/json/contries.json')
			.pipe(
				map((res: any) => res),
				catchError(this._errorHandler)
			);
	}

	isEqualLabels(array1: string[], array2: string[]): boolean {
		let flag: boolean = false;

		if (array1 && array2) {
			array1 = array1.slice().sort();
			array2 = array2.slice().sort();
			flag = array1.every((value, index) => value === array2[index]);
		}

		return flag;
	}

	hasSimilarArrayValue(arr1: any, arr2: any) {
		const [a1, a2] =
			arr1.length < arr2.length ? [arr1, arr2] : [arr2, arr1];
		return a1.some(c => a2.includes(c));
	}

	private _errorHandler(error: Response) {
		if (!environment.production) {
			console.error(error);
		}
		return throwError(error || 'Server Error');
	}
}

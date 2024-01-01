import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// INTERFACES
import { ISubscription } from '../../interfaces/subscription/subscription.interface';

// RXJS
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

// ENV
import { environment } from '../../../../environments/environment';

// ROUTES
const api = `${environment.host}/api/`;

@Injectable()
export class RegisterService {
	allSubscriptions: ISubscription[];

	constructor(private http: HttpClient) {
	}

	// PRODUCTS
	getCountries() {
		return this.http.get(`assets/json/countries.json`)
			.pipe(
				map((res: any) => res),
				catchError(this._errorHandler)
			);
	}

	initializeSubscriptions(subscriptions: ISubscription[]): void {
		this.allSubscriptions = subscriptions;
	}

	getQuarterSubscriptions(planType: string, quarterName: string): ISubscription[] {
		let plans: ISubscription[];
		plans = this.getSubscriptions(planType);

		return plans ? plans.filter((element: any) => element.planInterval === quarterName) : [];
	}

	getSubscriptions(subscriptionType: string): ISubscription[] {
		let plans: ISubscription[];

		plans = this.allSubscriptions.filter((element: any) => {
			let productName: string = element.productName;
			return productName.toLowerCase().includes(subscriptionType);
		});

		return plans;
	}

	registerPhoneNumber(phone: any, obj: any = {}) {
		return this.http.post(`${api}register/${phone}`, obj)
			.pipe(
				map((res: any) => res),
				catchError(this._errorHandler)
			);
	}

	private _errorHandler(error: any) {
		if (!environment.production) {
			console.error(error);
		}
		return throwError(error || 'Server Error');
	}
}

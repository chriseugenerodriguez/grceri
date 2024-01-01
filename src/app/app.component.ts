import { Component, ViewEncapsulation } from '@angular/core';
import { environment } from '../environments/environment';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthService } from './core';
import { Observable } from 'rxjs';
import { Product } from './core/interfaces/product.interface';


import { Meta } from '@angular/platform-browser';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	encapsulation: ViewEncapsulation.None
})
export class AppComponent {

	public shoppingCartItems: Observable<Product[]>;

	constructor(
		public router: Router,
		public AS: AuthService,
		meta: Meta
	) {
		meta.addTags([
			{ name: 'author', content: 'Grceri' },
		]);
	}

	ngOnit() {
		if (this.AS.isAuthenticated()) {

		}
	}

	isHeaderURLS(value: string): boolean {
		let boolean: boolean;
		if (
			value.startsWith('/callback') !== true &&
			value !== '/sign-up' &&
			value !== '/sign-up/basic' &&
			value !== '/sign-up/elite' &&
			value !== '/login' &&
			value !== '/forgot-password'
		) {
			boolean = true;
		} else {
			boolean = false;
		}

		return boolean;
	}

	isFooterURLS(value: string): boolean {
		let boolean: boolean;
		if (
			value.startsWith('/callback') !== true &&
			value !== '/sign-up' &&
			value !== '/sign-up/basic' &&
			value !== '/sign-up/elite' &&
			value !== '/register' &&
			value !== '/login' &&
			value !== '/forgot-password'
		) {
			boolean = true;
		} else {
			boolean = false;
		}

		return boolean;
	}
}

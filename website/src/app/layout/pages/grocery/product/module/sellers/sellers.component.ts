import { Component, Input, OnChanges, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';

// SERVICES
import { Product, AuthService } from '../../../../../../core';

// WINDOW
import { isPlatformBrowser } from '@angular/common';

@Component({
	selector: 'product-sellers',
	templateUrl: 'sellers.component.html',
})
export class ProductSellersComponent implements OnChanges {

	@Input() data: Product;

	// SELLERS
	sellers: any;

	constructor(
		private router: Router,
		private AS: AuthService,
		@Inject(PLATFORM_ID) private platform: any
		) {

	}

	ngOnChanges(): void {
		let a = this.data.sitedetails;
		let b = [].concat.apply([], a);
		let c = [];
		let d = [];
		let e = [];
		b.forEach((i) => {
			c.push(i.latestoffers);
		})
		d = [].concat.apply([], c);
		e = d.filter(i => i.price !== this.data.price);

		this.sellers = e;
	}

	login(a, b) {
		if (b === 'login') {
			if (isPlatformBrowser(this.platform)) {
				localStorage.setItem('authRedirect', a);
			}
			this.router.navigate(['/login']);
		}
	}
}

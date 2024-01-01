import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';

// SEO
import { Meta, Title } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { Product, CartService, AuthService } from '../../../core/index';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../../../environments/environment';

// COMPONENT
@Component({
	moduleId: module.id,
	selector: 'cart',
	templateUrl: 'cart.component.html',
})

// CLASS
export class CartComponent implements OnInit {

	cartQty: Observable<number>;
	cartItems: Product;
	qty: any;
	items: any;
	recs: any;
	suggestedClick: boolean;

	quantity: Array<number> = [1, 2, 3, 4, 5, 6, 7];

	constructor(
		@Inject(PLATFORM_ID) private platform: any,
		meta: Meta,
		private title: Title,
		private CS: CartService,
		public AS: AuthService,
		private http: HttpClient,
		private router: Router) {
		this.cartQty = this.totalQuantity();
		this.suggestedClick = true;

		this.meta();
		this.userSaved();
	}

	ngOnInit() {
	}

	public meta() {
		this.CS.getItems().subscribe(r => {
			this.cartItems = r;

			if (this.cartItems > '') {
				this.title.setTitle('' + this.cartQty + ' Cart Item(s) - Grocery Finder');
			} else {
				this.title.setTitle('Empty Cart - Grocery Finder');
			};
		})
	}

	public saveItem(i) {
		return this.CS.saveItem(i);
	}

	public product(i) {
		return i.toString().toLowerCase().replace(/[^a-zA-Z0-9]/g, '-').replace(/-{2,}/g, '-')
	}

	public qtyChange(i) {
		this.CS.updateCart(i);
		this.cartQty = this.totalQuantity();
		this.meta();
	}

	public removeItem(item: Product) {
		this.CS.removeFromCart(item);
		this.meta();
	}

	public totalQuantity(): Observable<number> {
		return this.CS.getTotalQuantity();
	}

	public getTotalAmount(): Observable<number> {
		return this.CS.getTotalAmount();
	}

	public getAmount(i): Observable<number> {
		return this.CS.getAmount(i);
	}

	public getTotalSavings(): Observable<number> {
		return this.CS.getTotalSavings();
	}

	public getSavings(i): Observable<number> {
		return this.CS.getSavings(i);
	}

	public getHighestSavings(i): Observable<number> {
		return this.CS.getHighestSavings(i);
	}

	public suggested(i) {
		if (i === 'saved') {
			this.suggestedClick = false;
		} else {
			this.suggestedClick = true;
		}
		this.userSaved(i);
	}

	productPath = environment.production ? 'products.json' : 'products-local.json';
	public userSaved(i?) {
		if (i == null) {
			this.http.get('/assets/json/' + this.productPath).subscribe(r => {
				this.items = r;
				this.recs = r;
			});
		}
		if (i === 'viewed') {
			this.http.get('/assets/json/' + this.productPath).subscribe(r => {
				this.items = r;
			});
		}
		if (i === 'saved') {
			if (this.AS.isAuthenticated()) {
				this.http.get('/assets/json/' + this.productPath).subscribe(r => {
					this.items = r;
				});
			}
		}
	}

	login(a) {
		if (isPlatformBrowser(this.platform)) {
			localStorage.setItem('authRedirect', a);
		}
		this.router.navigate(['/login']);
	}


	public addCart(i) {
		let a = this.items.filter(a => a.sem3_id !== i.sem3_id);
		let b;

		i.quantity = 1;

		if (this.items.length === 1) {
			b = [];
			this.items = b;
		} else {
			b = a;
			this.items = b;
		}

		this.CS.addToCart(i);
	}

}

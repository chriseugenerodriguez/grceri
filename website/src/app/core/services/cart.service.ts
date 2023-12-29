import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

import { LocalStorage } from './localstorage.service';
import { Product } from '../../core/interfaces/product.interface';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';


@Injectable()
export class CartService {
	private cartObj = [];

	constructor(
		@Inject(PLATFORM_ID) private platform: any,
		protected LS: LocalStorage,
		private http: HttpClient) {
		if (isPlatformBrowser(this.platform)) {
			if (localStorage.getItem('cart') !== null) {
				this.cartObj = JSON.parse(localStorage.getItem('cart'));
			}
		}
	}

	public saveItem(item: Product) {
		this.removeFromCart(item);

		this.http.post('', item).subscribe();
	}

	public addToCart(item: Product) {
		let e = this.cartObj.find(r => r.sem3_id === item.sem3_id);
		let i = this.cartObj.indexOf(item);

		if (e) {
			e.quantity = e.quantity + item.quantity;
			this.cartObj[i] = e;
			this.cartObj[i].savings = this.getSavings(e);
		} else {
			item.quantity = 1;
			item.savings = this.getSavings(item);
			this.cartObj.push(item);
		}

		this.LS.set('cart', this.cartObj);
	}

	public removeFromCart(item: Product) {
		let a = this.cartObj.filter(i => i.sem3_id !== item.sem3_id);
		let b;

		if (this.cartObj.length === 1) {
			b = [];
			this.cartObj = b;
		} else {
			b = a;
			this.cartObj = b;
		}

		this.LS.set('cart', b);
	}

	public updateCart(item: Product) {
		let e = this.cartObj.find(r => r.sem3_id === item.sem3_id)
		let i = this.cartObj.findIndex(r => r.sem3_id === item.sem3_id);

		if (e) {
			this.cartObj[i] = e;
			this.cartObj[i].savings = this.getSavings(e);

			this.LS.set('cart', this.cartObj);
		}
	}

	public updateQty(item: Product) {
		let e = this.cartObj.find(r => r.sem3_id === item.sem3_id)
		let i = this.cartObj.findIndex(r => r.sem3_id === item.sem3_id);

		if (e) {
			e.quantity += 1;
			this.cartObj[i] = e;
			this.cartObj[i].savings = this.getSavings(e);

			this.LS.set('cart', this.cartObj);
		}
	}

	public getItems(): Observable<Product> {
		return this.LS.get('cart');
	}

	public getTotalQuantity(): Observable<any> {
		let a = this.LS.get('cart');
		let b = localStorage.getItem('cart');
		let c: Observable<number>;
		if (b) {
			a.subscribe(r => {
				c = r.map(i => i.quantity).reduce((prev, next) => prev + next, 0);
			});
		} else {
			c = null;
		}

		return c;
	}

	public getTotalAmount(): Observable<number> {
		let a = this.LS.get('cart');
		let b: any;
		let c: any;
		let d: any;

		a.subscribe(r => {
			b = r.map(i => Math.ceil(i.price * 100) / 100).reduce((prev, next) => prev + next, 0);
			c = r.map(i => i.quantity).reduce((prev, next) => prev + next, 0)
			d = Math.ceil((b * c) * 100) / 100;
		});
		return d;
	}

	public getTotalSavings(): Observable<number> {
		let a = this.LS.get('cart');
		let c: any;

		a.subscribe(r => {
			if (r.length === 1) {
				c = r[0].savings;
			} else {
				c = r.filter(i => i.savings > 0).map(i => Math.ceil(i.savings * 100) / 100).reduce((prev, next) => prev + next, 0);
			}
		});

		return c;
	}

	public getSavings(item): Observable<number> {
		let a: any;
		let b: any;
		let c: any;
		let d: any;
		let e: any;
		let f: number;
		let g: any;
		let h: any;

		g = item.price;
		a = item.sitedetails;
		b = item.quantity;
		c = a[0].latestoffers;

		d = [];
		for (let i of c) {
			d.push(parseInt(i.price));
			d.filter(r => r !== item.price);
		}

		e = Math.max.apply(null, d);

		f = Math.ceil((e - g) * 100) / 100;
		h = (f * b).toFixed(2);

		return h;
	}

	public getHighestSavings(item): Observable<any> {
		let a: any;
		let b: any;
		let c: any;
		let d: any;
		let e: any;
		let f: any;

		a = item.sitedetails;
		b = item.quantity;
		c = a[0].latestoffers;

		d = [];
		for (let i of c) {
			d.push(parseInt(i.price));
			d.filter(r => r !== item.price);
		}

		e = Math.max.apply(null, d);

		f = e * b;

		return f;
	}

	public getAmount(item): Observable<number> {
		let a: any;
		let b: any;
		let c: any;

		a = item.quantity;
		b = item.price;
		c = Math.ceil((a * b) * 100) / 100;

		return c;
	}
}

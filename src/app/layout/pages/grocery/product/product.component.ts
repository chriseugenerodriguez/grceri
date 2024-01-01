import { Component, OnDestroy, OnInit, Input, Inject, PLATFORM_ID, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Product, ProductsService, CartService, API, AuthService, SocialService, LocalStorage } from '../../../../core';

import { Meta, Title } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';

import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../../../../environments/environment';

@Component({
	selector: 'product',
	templateUrl: 'product.component.html',
})
export class ProductComponent implements OnInit {

	// REVIEW
	@ViewChild('review') Review: ElementRef;

	public product: Product;
	public Cproduct: Product;

	// QTY
	public qty: Array<number> = [2, 3, 4, 5, 6, 7];
	public qtyDefault: Array<number> = [1];

	// SLIDERS
	items: any;

	// DIALOG
	addedO: boolean;
	feedbackO: boolean;
	feedbackSO = [];

	// SAVE
	saved: boolean;
	compared = [];
	comparedO = [];

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private PS: ProductsService,
		private CS: CartService,
		private meta: Meta,
		private title: Title,
		private api: API,
		private http: HttpClient,
		private AS: AuthService,
		private LS: LocalStorage,
		@Inject(PLATFORM_ID) private platform: any
	) {
		this.products();

		this.addedO = false;
		this.feedbackO = false;

		this.LS.get('compare').subscribe((r) => {
			if (r) {
				this.comparedO = r;
			} else {
				this.comparedO = [];
			}
		});

	}

	ngOnInit() {

		this.route.params.subscribe(params => {
			const cid = params['cat'];
			this.PS.getProduct(cid).subscribe((r) => {

				this.product = r[0];

				// CAROUSEL
				this.Cproduct = r[0];

				// PRODUCT
				this.product.quantity = 1;

				this.title.setTitle(this.product.name + ' - Grceri');
				this.meta.addTags([
					{ name: 'description', content: this.product.description },

					{ name: 'twitter:card', content: 'summary_large_image' },
					{ name: 'twitter:site', content: '@grceri' },
					{ name: 'twitter:title', content: this.product.name },
					{ name: 'twitter:description', content: this.product.description },
					{ name: 'twitter:image', content: this.product['images'][0] },

					{ name: 'og:url', content: this.router.url },
					{ name: 'og:type', content: 'website' },
					{ name: 'og:title', content: this.product.name },
					{ name: 'og:description', content: this.product.description },
					{ name: 'og:image', content: this.product['images'][0] }
				], true);
			});
		});
	}

	public products() {
		this.http.get('/assets/json/' + this.productPath).subscribe(r => {
			this.items = r;
		});
	}

	public addToCart(product: Product) {
		if (product) {
			this.CS.addToCart(product);
			this.addedO = true;
		}
	}

	login(a, b) {
		if (b === 'save') {
			if (isPlatformBrowser(this.platform)) {
				localStorage.setItem('authRedirect', a + '/save');
			}
			this.router.navigate(['/login']);
		}
		if (b === 'login') {
			if (isPlatformBrowser(this.platform)) {
				localStorage.setItem('authRedirect', a);
			}
			this.router.navigate(['/login']);
		}
	}

	productPath = environment.production ? 'products.json' : 'products-local.json';
	save(i) {
		this.http.post('/assets/json/' + this.productPath, i).subscribe(r => {
			this.saved = true;
		});
	}

	compare(item) {
		let e = this.comparedO.find(r => r.sem3_id === item.sem3_id);
		let i = this.comparedO.indexOf(item);

		if (e) {
			this.compared.splice(i, 1);
			this.comparedO.splice(i, 1);
		} else {
			this.compared.push(item.sem3_id);
			this.comparedO.push(item);
		}
		this.LS.set('compare', this.comparedO);
	}

	productqty(i) {
		this.product.quantity = i;
	}

	popup(i) {
		if (i === 'feedback') {
			this.feedbackO = true;
		}
	}

	added(v): boolean {
		return this.addedO = v;
	}

	feedback(a, b) {
		if (b === 'open') {
			this.feedbackO = a;
		} else {
			this.feedbackSO.push(a);
		}
	}

	feedbackS(item): boolean {
		let e = this.feedbackSO.find(r => r === item);
		if (e) {
			return true;
		} else {
			return false;
		}
	}

	comparedF(item): boolean {
		let e = this.comparedO.find(r => r.sem3_id === item);

		if (e) {
			return true;
		} else {
			return false;
		}
	}

	scrollReview() {
		this.Review.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}
}

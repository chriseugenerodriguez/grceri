import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// SEO
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { ItemComponent } from '../grocery/category/item/item.component';

// SERVICES
import { API, AuthService, ProductsService } from '../../../core/index'
import { environment } from '../../../../environments/environment';

// COMPONENT
@Component({
	moduleId: module.id,
	selector: 'home-app',
	templateUrl: 'home.component.html',
})

// CLASS
export class HomeComponent implements OnInit {
	moreC: boolean;

	howListOne: boolean;
	howListTwo: boolean;
	howListThree: boolean;
	howListFour: boolean;

	items: any;
	popularItems: any[] = [];
	category = [];

	// CMS
	latest: any;

	constructor(meta: Meta, title: Title, private api: API, public router: Router, private AS: AuthService, private http: HttpClient, private IC: ItemComponent, private PS: ProductsService) {
		title.setTitle('Find your favorite groceries - Grceri');
		meta.addTags([
			{ name: 'description', content: 'Making it simple and easy to find your grocery items without the hassle.' },
			{ name: 'keywords', content: 'grocery finder, nearest supermarket, supermarket near me, grocery search, groceries, grocery store near me, grocery store' }
		]);
	}

	ngOnInit() {
		this.list();
		this.products();

	}

	public login() {
		return this.AS.isAuthenticated();

	}

	public list() {
		this.http.get('/assets/json/category.json').subscribe(r => {
			this.category = r['groceries']['categories'];
		});
	}

	productPath = environment.production ? 'products.json' : 'products-local.json';
	public products() {
		this.PS.products().subscribe(r => {
			// Show a bounded, varied selection; the full catalog remains searchable.
			const featured = Array.from(new Map(r.map(p => [p.category, p])).values());
			this.items = featured.slice(0, 14);
			this.popularItems = featured.slice(14).concat(r).slice(0, 14);
		});
	}

	public url(i) {
		return i['name'].toLowerCase().replace(/(?:( and )|(&)|(,)|(\s)|[/])+/g, '-');
	}

	public moreCat() {
		this.moreC = !this.moreC;
	}


	public lower(i) {
		return i.toLowerCase();
	}

	public product(i) {
		return this.IC.product(i);
	}
}

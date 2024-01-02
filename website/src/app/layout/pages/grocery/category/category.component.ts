import { Component, OnInit, Input, OnDestroy, ViewChild } from '@angular/core';
import { Subject, Subscription } from 'rxjs';

import { Product, Filter, ProductsService, PriceFilter } from '../../../../core/index';

// SEO
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { SortComponent } from './sort/sort.component';
import { HttpClient } from '@angular/common/http';


// COMPONENT
@Component({
	moduleId: module.id,
	selector: 'category',
	templateUrl: 'category.component.html'
})

export class CategoryComponent implements OnInit, OnDestroy {
	@Input() public items: Product[] = [];
	public dispItems: Product[] = [];

	@ViewChild(SortComponent) sort: SortComponent;

	public f = {};
	public menu = [];
	public cat;
	public sub;
	public subc;

	public availableFilters: Filter = { rating: [{ rate: 5, num: 0 }, { rate: 4, num: 0 }, { rate: 3, num: 0 }, { rate: 2, num: 0 }, { rate: 1, num: 0 }], category: [], brand: [], price: [] };
	public activatedFilters: Filter = { rating: [], category: [], brand: [], price: [] };

	private preSelectedPrices: PriceFilter[] = [
		{ from: 0, to: 4.99, num: 0 },
		{ from: 5, to: 9.99, num: 0 },
		{ from: 10, to: 19.99, num: 0 },
		{ from: 20, to: 29.99, num: 0 },
		{ from: 30, to: 39.99, num: 0 },
		{ from: 40, to: 49.99, num: 0 },
		{ from: 50, to: 74.99, num: 0 },
		{ from: 75, to: 99.99, num: 0 },
		{ from: 100, to: null, num: 0 },
	];
	private setItems = new Subject<Product[]>();
	private subs: Subscription[] = [];

	constructor(
		private PS: ProductsService,
		private meta: Meta,
		private title: Title,
		private router: Router,
		private route: ActivatedRoute,
		private http: HttpClient,
	) {
		this.sub = [
			this.setItems.subscribe(res => {
				this.items = res;
				this.getFilters(res);
				this.changeFilterStatus(this.activatedFilters, true);
			})
		];

		this.route.params.subscribe(params => {
			this.cat = params['cat'];
			this.sub = params['sub'];
			this.subc = params['sub-sub'];
			this.setCategory();
		});

		// refreshes route
		this.router.routeReuseStrategy.shouldReuseRoute = () => false;

		this.http.get('/assets/json/category.json').subscribe((res: any) => {
			this.menu = res['groceries']['categories'];

			this.menu.forEach((category) => {
				const categoryName = this.formatted(category['name']);

				if (categoryName === this.cat) {
					this.handleCategory(category);
				}
			});
		});
	}

	private handleCategory(category: any) {
		if (this.cat !== '' && (this.sub === undefined && this.subc === undefined)) {
			this.setMeta(category);
			this.PS.getProducts(category['id']).subscribe((products: Product[]) => {
				this.setItems.next(products);
			});
		}

		if (category['category']) {
			category['category'].forEach((subCategory) => {
				const subCategoryName = this.formatted(subCategory['name']);

				if (subCategoryName === this.sub) {
					this.handleSubCategory(subCategory);
				}
			});
		}
	}

	private handleSubCategory(subCategory: any) {
		if (this.sub !== '' && (this.cat !== '' && this.subc === undefined)) {
			this.setMeta(subCategory);
			this.PS.getProducts(subCategory['id']).subscribe((products: Product[]) => {
				this.setItems.next(products);
			});
		}

		if (subCategory['sub']) {
			subCategory['sub'].forEach((subSubCategory) => {
				const subSubCategoryName = this.formatted(subSubCategory['name']);

				if (subSubCategoryName === this.subc) {
					this.handleSubSubCategory(subSubCategory);
				}
			});
		}
	}

	private handleSubSubCategory(subSubCategory: any) {
		if (this.subc !== '' && (this.cat !== '' && this.sub !== '')) {
			this.setMeta(subSubCategory);
			this.PS.getProducts(subSubCategory['id']).subscribe((products: Product[]) => {
				this.setItems.next(products);
			});
		}
	}


	ngOnInit() {
	}

	private setMeta(a) {
		let t = a['name'];
		this.title.setTitle(t + ' - Grocery Finder');
		this.meta.addTag({ name: 'description', content: 'Find ' + t + ' at the best price, search over 100\'s of online retailers for the best price. Search your favorite branded ' + t + ' products.' })
	}

	private formatted(i) {
		return i.toString().toLowerCase().replace(/[^a-zA-Z0-9]/g, '-').replace(/-{2,}/g, '-');
	}

	private getFilters(r) {
		this.setCategory();
		r.forEach(item => {
			this.availableFilters.category.forEach(c => {
				if (this.findProductsInCategory(c, item)) {
					(c.num === undefined || c.num == null) ? c.num = 1 : c.num++;
				}
			});

			let brandIndex = this.availableFilters.brand.findIndex(i => i.name === item.brand);
			if (brandIndex < 0) {
				this.availableFilters.brand.push({ name: item.brand, num: 1 });
			} else {
				this.availableFilters.brand[brandIndex].num++;
			}

			// this.availableFilters.rating[5 - Math.round(item.rating)].num ++;
			let prePriceItem = this.preSelectedPrices.find(i => i.from <= item.price && i.to >= item.price);
			if (prePriceItem) {
				prePriceItem.num++;
			}
		});
		this.availableFilters.price = this.preSelectedPrices.filter(p => p.num > 0);
	}

	private setCategory() {
		let temp = [];
		if (this.menu) {
			if (this.cat) {
				temp = this.menu.find(c => this.formatted(c['name']) === this.cat);
				if (temp) {
					temp = temp['category'] ? temp['category'] : [];
				} else {
					temp = [];
				}
			}

			if (this.sub && temp.length > 0) {
				temp = temp.find(c => this.formatted(c['name']) === this.sub);
				if (temp && (temp['category'] || temp['sub'])) {
					temp = temp['category'] ? temp['category'] : temp['sub'] ? temp['sub'] : [];
				} else {
					temp = [];
				}
			}

			if (this.subc && temp.length > 0) {
				temp = temp.find(c => this.formatted(c['name']) === this.subc);
				if (temp && (temp['category'] || temp['sub'])) {
					temp = temp['category'] ? temp['category'] : temp['sub'] ? temp['sub'] : [];
				} else {
					temp = [];
				}
			}
		}
		this.availableFilters.category = temp;
	}

	changeFilterStatus(event: Filter, init: boolean = false) {
		if (init) {
			this.dispItems = this.items;
		} else {
			this.dispItems = this.items.filter(item =>
				(event.brand.length === 0 || event.brand.findIndex(i => i.name === item.brand) >= 0)
				&& (event.category.length === 0 || event.category.findIndex(c => this.findProductsInCategory(c, item)) >= 0)
				&& this.compareWithPrice(item.price, event.price)
				&& (event.rating.length === 0 || event.rating.findIndex(i => i.rate === Math.round(item.rating)) >= 0)
			);
		}
	}

	private compareWithPrice(value: number, filter: PriceFilter[]): boolean {
		if (filter.length > 0 && filter.findIndex(i => i.from <= value && (!i.to || i.to >= value)) < 0) { return false; }
		return true;
	}

	private findProductsInCategory(category, item) {

		if (category.id === item['cat_id']) { return true; }
		let children = category.sub ? category.sub : category.category ? category.category : [];
		for (let i = 0; i < children.length; i++) {
			if (this.findProductsInCategory(children[i], item)) { return true; }
		}
		return false;
	}

	ngOnDestroy() {
		this.subs.forEach(sub => sub.unsubscribe());
	}
}

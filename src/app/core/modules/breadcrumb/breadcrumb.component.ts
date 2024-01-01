import { ActivatedRoute, Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";

// let fi = require('json-easy-filter').JefNode;

// declare var JefNode;

@Component({
	selector: 'breadcrumb',
	templateUrl: 'breadcrumb.component.html',
})
export class BreadcrumbComponent implements OnInit {
	public menu = [];
	public bc = [];

	// CAT
	public cat;
	public sub;
	public subc;
	public f = {};

	// PAGES
	public cart;
	public product;
	public category;

	constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient) {
		this.route.params.subscribe(params => {
			this.cat = params['cat'];
			this.sub = params['sub'];
			this.subc = params['sub-sub'];
		});

		this.loadData();
	}

	loadData() {
		this.http.get<any>('/assets/json/category.json').subscribe(
			(res) => {
				this.menu = res?.groceries?.categories || [];

				this.menu.forEach((b) => {
					// CATEGORY
					const formattedName = this.formatted(b['name']);
					if (formattedName === this.cat) {
						this.f[0] = b['name'];

						if (b['category']) {
							b['category'].forEach((c) => {
								const formattedSubName = this.formatted(c['name']);
								if (formattedSubName === this.sub) {
									this.f[1] = c['name'];

									if (c['sub']) {
										c['sub'].forEach((d) => {
											const formattedSubCName = this.formatted(d['name']);
											if (formattedSubCName === this.subc) {
												this.f[2] = d['name'];
											}
										});
									}
								}
							});
						}
					}
				});

				if (this.router.url.match('/grocery/')) {
					const a = [];
					const c = [];
					const f = res.groceries;
					let e;
					let g;

					// const b = new JefNode(res).filter((node) => {
					// 	if (node.has('name') && this.formatted(node.value.name) === this.cat) {
					// 		return node.pathArray;
					// 	}
					// });

					console.log("res", res);
					const b = res.filter((v) => {
						if (v.has('name') && this.formatted(v.value.name) === this.cat) {
							return v.pathArray;
						}
					})

					for (let i = 0; i < b.length; i++) {
						c.push(b[i]);
						if (b[i] === 'categories') {
							e = f.categories[c[0][2]];
							g = this.formatted(e.name);
							a.push({ name: e.name, url: g });

							if (b[i] === 'category') {
								e = f.categories[c[0][2]].category[c[0][4]];
								a.push({ name: e.name, url: g + '/' + this.formatted(e.name) });
							}
						}
					}

					this.bc = a;
				}
			},
			(error) => {
				console.error('Error fetching category data:', error);
				// Handle the error or provide feedback to the user as needed
			}
		);
	}


	formatted(i) {
		return i.toString().toLowerCase().replace(/[^a-zA-Z0-9]/g, '-').replace(/-{2,}/g, '-');
	}

	ngOnInit() {
		if (this.router.url === '/cart') {
			this.cart = true;
		}
		if (this.router.url.match('/groceries/')) {
			this.category = true;
		}
		if (this.router.url.match('/grocery/')) {
			this.product = true;
		}
	}
}

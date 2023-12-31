import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, Input } from '@angular/core';

// SERVICES
import { CategoryAPIService } from '../../../shared/services';

@Component({
	selector: 'breadcrumb',
	templateUrl: 'breadcrumb.component.html',
	styleUrls: ['breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {
	@Input() productTitle: any;
	@Input('cat') singleProductcat: string;
	@Input('subcat') singleProductSubCat: string;

	menu: any;
	breadcrumbURLParams: any[];
	breadcrumbLength: number;

	// CAT
	cat: any;
	sub: any;
	subSub: any;
	f = {};

	// PAGES
	cart: any;
	product: any;
	category: any;
	currentPage: any;

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private CS: CategoryAPIService) {
		this.breadcrumbURLParams = [];
		this.breadcrumbLength = 150;
	}

	ngOnInit() {
		this.processCategorySubcategoryInformation();

		if (this.router.url === '/cart') {
			this.processCartBreadcrumbListing();
			this.currentPage = 'cart';
		}

		if (this.router.url.match('/groceries/')) {
			this.initialBreadcrumbObject();
			this.processCategoriesBreadcrumbListing();
			this.currentPage = 'categories';
		}

		if (this.router.url.match('/grocery/')) {
			this.initialBreadcrumbObject();
			this.processProductBreadcrumbURLParams();
			this.currentPage = 'singleProduct';
		}

	}

	/**
	* Check whether component input or router
	* parameter information exist
	* and process to create breadcrumb
	*/
	private processCategorySubcategoryInformation() {
		if (this.singleProductcat || this.singleProductSubCat) {
			this.cat = this.singleProductcat;
			this.sub = this.singleProductSubCat;
		} else {
			this.processURLParameters();
		}
	}

	/**
	* Process breadcrumb for cart page
	*/
	private processCartBreadcrumbListing() {
		let rootURLParams = ['/'];

		this.assignBreadcrumbObject('Grocery', rootURLParams);
		this.assignBreadcrumbObject('Cart', undefined);
	}

	/**
	* Get categories listing and process them for breadcrumb
	*/
	private processCategoriesBreadcrumbListing() {
		this.CS.getCat().subscribe(res => {
			if (res) {
				this.menu = res[0].categories;

				this.menu.forEach((b: any) => {
					// CATEGORY
					if (this.CS.formatted(b['name']) === this.cat) {
						this.f[0] = b['name'];

						if (b['categories']) {
							b['categories'].forEach((c) => {
								if (this.CS.formatted(c['name']) === this.sub) {
									this.f[1] = c['name'];

									if(c['categories'] && c['categories'].length > 0){
										c['categories'].forEach((d) => {
											if (this.CS.formatted(d['name']) === this.subSub) {
												this.f[2] = d['name'];
											}
										});
									}
								}
							})
						}
					}
				});
				this.processCategoryBreadcrumbURLParams();
			}
		});
	}

	/**
	* Process URL parameters to get category and sub-category
	*/
	private processURLParameters() {
		this.route.params.subscribe(params => {
			this.cat = params['cat'];
			this.sub = params['sub'];
			this.subSub = params['subSub'];
		});
	}

	/**
	* Set initial breadcrumb element when new route is found
	*/
	private initialBreadcrumbObject() {
		let urlParams = ['/groceries/'];

		this.assignBreadcrumbObject('Groceries', urlParams);
	}

	/**
	* Process breadcrumb url and title for single product page breadcrumb
	*/
	private processProductBreadcrumbURLParams() {
		if (this.cat && this.sub && this.subSub) {
			let catURLParams = ['/groceries/', this.url(this.cat)];
			let subCatURLParams = ['/groceries/', this.url(this.cat), this.url(this.sub)];
			let subSubCatURLParams = ['/groceries/', this.url(this.cat), this.url(this.sub), this.url(this.subSub)];

			this.assignBreadcrumbObject(this.cat, catURLParams);
			this.distributeBreadcrumbLength(this.cat);
			this.assignBreadcrumbObject(this.sub, subCatURLParams);
			this.distributeBreadcrumbLength(this.sub);
			this.assignBreadcrumbObject(this.subSub, subSubCatURLParams);
			this.distributeBreadcrumbLength(this.subSub);
			let finalText = this.renderFinalBreadcrumbText(this.productTitle);
			this.assignBreadcrumbObject(finalText, undefined);
		} else if (this.cat && this.sub) {
			let catURLParams = ['/groceries/', this.url(this.cat)];
			let subCatURLParams = ['/groceries/', this.url(this.cat), this.url(this.sub)];

			this.assignBreadcrumbObject(this.cat, catURLParams);
			this.distributeBreadcrumbLength(this.cat);
			this.assignBreadcrumbObject(this.sub, subCatURLParams);
			this.distributeBreadcrumbLength(this.sub);
			let finalText = this.renderFinalBreadcrumbText(this.productTitle);
			this.assignBreadcrumbObject(finalText, undefined);
		} else if (this.cat) {
			let catURLParams = ['/groceries/', this.url(this.cat)];

			this.assignBreadcrumbObject(this.cat, catURLParams);
			this.distributeBreadcrumbLength(this.cat);
			let finalText = this.renderFinalBreadcrumbText(this.productTitle);
			this.assignBreadcrumbObject(finalText, undefined);
		}
	}

	/**
	* Process breadcrumb url and title for category page breadcrumb
	*/
	private processCategoryBreadcrumbURLParams() {
		if (this.cat && this.sub && this.subSub) {
			let urlParams = ['/groceries/', this.cat];
			this.assignBreadcrumbObject(this.f[0], urlParams);
			this.distributeBreadcrumbLength(this.f[0]);

			let subUrlParams = ['/groceries/', this.cat, this.sub];
			this.assignBreadcrumbObject(this.f[1], subUrlParams);
			this.distributeBreadcrumbLength(this.f[1]);

			let finalText = this.renderFinalBreadcrumbText(this.f[2]);
			this.assignBreadcrumbObject(finalText, undefined);
		} else if (this.cat && this.sub) {
			let urlParams = ['/groceries/', this.cat];

			this.assignBreadcrumbObject(this.f[0], urlParams);
			this.distributeBreadcrumbLength(this.f[0]);
			let finalText = this.renderFinalBreadcrumbText(this.f[1]);
			this.assignBreadcrumbObject(finalText, undefined);
		} else if (this.cat) {
			let finalText = this.renderFinalBreadcrumbText(this.f[0]);
			this.assignBreadcrumbObject(finalText, undefined);
		}
	}

	private renderFinalBreadcrumbText(finalBreadcrumbText: string) {
		let finalBreadcrumbTextLength: number = finalBreadcrumbText ? finalBreadcrumbText.length : 0;

		if (finalBreadcrumbTextLength > this.breadcrumbLength) {
			let finalText: string = finalBreadcrumbText.substring(0, this.breadcrumbLength);
			finalText = finalText.trim();
			finalText = finalText + '...';
			return finalText;
		} else {
			return finalBreadcrumbText;
		}
	}

	/**
	* Retrieve current breadcrumb text lenght and calculate for next one
	*/
	private distributeBreadcrumbLength(currentText: string) {
		let currentTextLength: number = currentText.length;
		let remainingLength = this.breadcrumbLength - currentTextLength;
		this.breadcrumbLength = remainingLength;
	}

	/**
	* Create breadcrumb Array of objects to assign in component
	*/
	private assignBreadcrumbObject(title: string, url: any) {
		let breadcrumbObject = {
			title,
			url
		};

		this.breadcrumbURLParams.push(breadcrumbObject);
	}

	private url(i) {
		return i.toLowerCase().replace(/(?:( and )|(&)|(,)|(\s)|[/])+/g, '-');
	}
}

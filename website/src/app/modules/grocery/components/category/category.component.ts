import { Component, Input, OnDestroy, OnChanges, AfterViewInit, ViewChild, OnInit, ElementRef, ChangeDetectorRef, ChangeDetectionStrategy, Inject } from '@angular/core';
import { DOCUMENT, Location } from '@angular/common';

// CHILDREN
import { SortComponent } from '../../../../shared/widgets/sort/sort.component';

// INTERFACES
import { IProduct } from '../../../../shared/interfaces/product/product.interface';

// SERVICES
import { CategoryAPIService, HttpCancelService, SearchAPIService, SearchBarService, ProductAPIService, SeoService, GoogleAnalyticsService, DeviceService, HammerService } from '../../../../shared/services';

// SEO
import { ActivatedRoute, Router } from '@angular/router';

// SIDEBAR
import { SidebarComponent } from '../../../../shared/widgets/sidebar/sidebar.component';
import { MobileFilterComponent } from '../../../../shared/widgets/mobile-filter/mobile-filter.component';

// RXJS
import { Subscription, forkJoin, of, Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';

// ENV
import { environment } from '../../../../../environments/environment';

// COMPONENT
@Component({
	moduleId: module.id,
	selector: 'category',
	templateUrl: 'category.component.html',
	styleUrls: ['category.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryComponent implements OnDestroy, OnInit, OnChanges, AfterViewInit {
	// VIEWCHILD
	@ViewChild(SortComponent, { static: false }) sort: SortComponent;
	@ViewChild('categorysidebar', { static: false }) sidebarComponent: SidebarComponent;
	@ViewChild('mobilefilter', { static: false }) mobileFilterComponent: MobileFilterComponent;
	@ViewChild('swipefilter', { static: false }) swipeFilter: ElementRef;
	@ViewChild('swipefiltericon', { static: false }) swipeFilterIcon: ElementRef;
	@ViewChild('swipecategorycontainer', { static: false }) swipeCategoryContainer: ElementRef;

	// SIDEBAR
	private sections$ = new Subject<any[]>();
	sections: any[] = [];
	categories: any;
	filter: boolean;

	// SORT
	total: number;
	count: number;
	page = 1;

	// PAGINATION
	pagination$ = new Subject<number>();

	// FEED
	@Input() items: IProduct[] = [];
	backupItems: boolean;
	nitems = Array(50).fill(1);

	// CURRENT
	cat: number;
	id: string;
	filterResult: string;
	orderResult: string;
	sidebarData: object = {};
	tempSidebarData: object = {};

	// SUBJECT
	private products$ = new Subject<IProduct[]>();

	// SUBSCRIPTION
	productsSubscription: Subscription;
	sectionsSubscription: Subscription;
	routerParamSubscription: Subscription;
	bothCategoryForkJoinSubscription: Subscription;
	searchProductsSubscription: Subscription;
	private _subscriptions: any = new Subscription();

	// SORT BY
	sortBy: any = null;

	// SIDEBAR FILTERS
	sidebarFilterCategories: any[];
	isCategorySectionLoaded: boolean;
	isFirstCategoriesURLParam: boolean;
	isFirstBrandURLParam: boolean;
	isFirstSizeURLParam: boolean;
	isFirstCountURLParam: boolean;
	isFirstWeightURLParam: boolean;
	isFirstDietURLParam: boolean;
	isFirstRatingURLParam: boolean;
	isFirstTypesURLParam: boolean;

	// No PRODUCTS FOUND
	noProductFound: boolean;

	// CATEGORY PAGE META TAG
	currentCategoryName: string;

	// PROCESS API CATEGORIES
	apiCategories: any[];

	// Applied Filters
	mobileAppliedFilters: any[];

	constructor(
		@Inject(DOCUMENT) private document: Document,
		private GS: GoogleAnalyticsService,
		private productAPI: ProductAPIService,
		private router: Router,
		private route: ActivatedRoute,
		protected CS: CategoryAPIService,
		public DS: DeviceService,
		private SS: SeoService,
		private SBS: SearchBarService,
		private changeDetector: ChangeDetectorRef,
		private httpCancelService: HttpCancelService,
		private hammerService: HammerService
	) {
		// refreshes route
		this.router.routeReuseStrategy.shouldReuseRoute = () => false;

		this.isCategorySectionLoaded = false;
		this.isFirstCategoriesURLParam = true;
		this.isFirstBrandURLParam = true;
		this.isFirstSizeURLParam = true;
		this.isFirstCountURLParam = true;
		this.isFirstWeightURLParam = true;
		this.isFirstDietURLParam = true;
		this.isFirstTypesURLParam = true;
		this.isFirstRatingURLParam = true;
		this.filterResult = '';
		this.orderResult = '';

		this.currentCategoryName = '';

		this.noProductFound = false;
		this.mobileAppliedFilters = [];
	}

	ngOnInit() {
		this.SBS.selectedSortOption = 'productId';
		this.getFiltersQueryParameters();
	}

	ngOnChanges() {
		this.getMobileAppliedFiltersData();
	}

	ngAfterViewInit() {
		this._swipeActionsFilter();

		this.changeDetector.detach();
		this.getMobileAppliedFiltersData();
	}

	ngOnDestroy() {
		this._subscriptions.unsubscribe();

		if (this.productsSubscription) {
			this.productsSubscription.unsubscribe();
		}
		if (this.sectionsSubscription) {
			this.sectionsSubscription.unsubscribe();
		}
		if (this.routerParamSubscription) {
			this.routerParamSubscription.unsubscribe();
		}
		if (this.bothCategoryForkJoinSubscription) {
			this.bothCategoryForkJoinSubscription.unsubscribe();
		}
		if (this.searchProductsSubscription) {
			this.searchProductsSubscription.unsubscribe();
		}

		this.httpCancelService.cancelPendingRequests();
		if (!environment.production && !this.httpCancelService.cancelPendingRequests) {
			console.log('canceled pending request');
		}
	}

	getMobileAppliedFiltersData() {
		this.mobileAppliedFilters = this.sidebarComponent.appliedFilters;
		this.changeDetector.detectChanges();
	}

	openSidebar(direction?) {
		if (direction) {
			if (direction === 'up') {
				this.filter = true;
			}

			if (direction === 'down') {
				this.filter = false;
			}
		} else {
			this.filter = !this.filter;
		}

		if (this.filter) {
			this.document.body.classList.add('is-active');
		} else {
			this.document.body.classList.remove('is-active');
		}

		this.changeDetector.detectChanges();
	}

	resetMobileSidebar() {
		this.tempSidebarData = {};
		this.sidebarData = {};
		this.filterResult = '';
		this.mobileFilterComponent.resetSidebarCache();
		if (this.mobileAppliedFilters.length > 0) {
			if (this.mobileFilterComponent) {
				this.mobileFilterComponent.resetFilterData();
			}

			this.sidebarComponent.clearAllFilters();
			this.getMobileAppliedFiltersData();
		}

		this.openSidebar();
	}

	checkDataObjectEmpty(dataObject) {
		return Object.entries(dataObject).length === 0 && dataObject.constructor === Object;
	}

	applyFilterRequest() {
		this.initializeNewFilters(this.tempSidebarData);
		this.processMobileSectionDataToQueryParams();

		this._init();
		this.getMobileAppliedFiltersData();
		this.tempSidebarData = {};
		this.openSidebar();
	}

	/**
	 * Get filter query parameters from URL
	 */
	private getFiltersQueryParameters() {
		this.route.queryParamMap.subscribe((params: any) => {
			let orderObj = { ...params.keys, ...params };
			let parameters: object = orderObj.params;
			this.processFiltersQueryParameters(parameters);
		});
	}

	/**
	 * Process query parameters, parse json string to oData Parameters and
	 * render result to search page
	 */
	private processFiltersQueryParameters(params: any) {
		let queryParamsObject: object = {};

		if (params.Category) {
			queryParamsObject['Category'] = this.processQueryParameterForFilterResult(params.Category);
		}
		if (params.Brand) {
			queryParamsObject['Brand'] = this.processQueryParameterForFilterResult(params.Brand);
		}
		if (params.Size) {
			queryParamsObject['Size'] = this.processQueryParameterForFilterResult(params.Size);
		}
		if (params.Weight) {
			queryParamsObject['Weight'] = this.processQueryParameterForFilterResult(params.Weight);
		}
		if (params.Count) {
			queryParamsObject['Count'] = this.processQueryParameterForFilterResult(params.Count);
		}
		if (params.Diet) {
			queryParamsObject['Diet'] = this.processQueryParameterForFilterResult(params.Diet);
		}
		if (params.Rating) {
			queryParamsObject['Rating'] = this.processQueryParameterForFilterResult(params.Rating);
		}
		if (params.Price) {
			queryParamsObject['Price'] = this.processPriceQueryParameterForFilterResult(params.Price);
		}
		if (params.Type) {
			queryParamsObject['Type'] = this.processQueryParameterForFilterResult(params.Type);
		}
		if (!this.checkEmptyObject(queryParamsObject)) {
			this.sidebarData = queryParamsObject;
			this.setQueryCategories(queryParamsObject);
			this.changeDetector.detectChanges();
		} else {
			this._init();
		}
	}

	/**
	 * Check Object is empty
	 */
	private checkEmptyObject(obj) {
		return Object.keys(obj).length === 0 && obj.constructor === Object;
	}

	private processQueryCategories(queryData: object, cat: any, subCat: any, subSubCat: any): void {
		if (this.apiCategories.length > 0) {
			for (let i = 0; i < this.apiCategories.length; i++) {
				// CATEGORIES
				const a = this.apiCategories;

				if (this.CS.formatted(a[i]['name']) === cat) {
					subCat = (cat === subCat) ? undefined : subCat;

					this._renderCategoryProducts(a[i], queryData, cat, subCat, subSubCat);

					// SUB - CATEGORY
					this._renderSubCategoryProducts(a[i], queryData, cat, subCat, subSubCat);
				}
			}
		}
	}

	// tslint:disable-next-line:no-unnecessary-initializer
	private _renderCategoryProducts(a: any[], queryData: any, cat: string, subCat: string = undefined, subSubCat: string = undefined): void {
		if (cat !== '' && subCat === undefined && subSubCat === undefined) {
			// SET VARIABLES
			this.id = 'catId3';
			this.cat = a['id'];

			if (this.isCategorySectionLoaded === false) {
				// SET SIDEBAR FILTER CATEGORIES
				this._setSidebarFilterCategories(a);

				this.filterDataToOdata(queryData);

				// RESET IProductS
				this._init();
			}
		}
	}

	private _renderSubCategoryProducts(a: any[], queryData: any, cat: string, subCat: string, subSubCat: string): void {
		// SUB - CATEGORY
		const b: string[] = a['categories'] !== undefined ? a['categories'] : [];

		let subCategoryAttached = false;

		if (b.length > 0) {
			for (let x = 0; x < b.length; x++) {
				if (this.CS.formatted(b[x]['name']) === subCat) {
					if (subCat !== '' && cat !== '' && subSubCat === undefined) {
						// SET VARIABLES
						subCategoryAttached = true;
						this.id = 'catId4';
						this.cat = b[x]['id'];

						this.currentCategoryName = b[x]['name'];

						this.filterDataToOdata(queryData);

						// RESET IProductS
						this._init();
					}
				}
			}

			if (!subCategoryAttached) {
				this._moveSubCategoryToCategory(queryData, cat);
			}
		}
	}

	private _moveSubCategoryToCategory(queryData: any, cat: string): void {
		for (let i = 0; i < this.apiCategories.length; i++) {
			const a = this.apiCategories;

			if (this.CS.formatted(a[i]['name']) === cat) {
				this._renderCategoryProducts(a[i], queryData, cat);
			}
		}
	}

	private getCategoriesInformation(queryData: object, cat: any, subCat: any, subSubCat: any) {
		if (this.apiCategories) {
			this.processQueryCategories(queryData, cat, subCat, subSubCat);
		} else {
			this.CS.getCat().subscribe(res => {
				if (res) {
					this.apiCategories = res[0]['categories'];

					this.processQueryCategories(queryData, cat, subCat, subSubCat);
				}
			});
		}
	}

	/**
	 * Get categories information and assign to Category query parameter
	 */
	private setQueryCategories(queryData: object) {
		// URL SYNTAX
		let cat: string;
		let subCat: string;
		let subSubCat: string;

		this.routerParamSubscription = this.route.params.subscribe(params => {
			cat = params['cat'];
			subCat = params['sub'];
			subSubCat = params['sub-sub'];
		});

		this.getCategoriesInformation(queryData, cat, subCat, subSubCat);
	}

	/**
	 * Parse sections(except Price) JSON string to oData parameter
	 */
	private processQueryParameterForFilterResult(paramData: string) {
		let queryParam;
		queryParam = decodeURIComponent(paramData);
		queryParam = JSON.parse(queryParam);
		return queryParam;
	}

	/**
	 * Parse Price section JSON string to oData parameter
	 */
	private processPriceQueryParameterForFilterResult(paramData: string) {
		let queryParam: any[] = [];
		let priceRange = decodeURIComponent(paramData);
		priceRange = JSON.parse(priceRange);
		queryParam[0] = {
			minPrice: priceRange[0],
			maxPrice: priceRange[1],
		};
		return queryParam;
	}

	setPagination(page: number) {
		// SCROLL TOP
		window.scroll(0, 0);

		// PAGINATION
		this.page = page;

		// RESET ITEMS
		if (this.items.length > 0) {
			this.items = [];
			this.changeDetector.detectChanges();
		}

		// NEXT
		let productsObservable$ = this.productAPI.getProducts(this.id, this.cat, this.filterResult, this.orderResult, page);

		let sectionsObservable$ = this.productAPI.getSidebarFilters(this.id, this.cat);

		let observables$ = forkJoin([productsObservable$, sectionsObservable$]).pipe(catchError(error => of(error)));

		this.bothCategoryForkJoinSubscription = observables$.subscribe(([products, sections]) => {
			// UPDATE DATA
			this.products$.next(products);
			this.sections$.next(sections);
		});
	}

	trackByProductID(index, instructor) {
		return instructor.productId;
	}

	private _init() {
		this._setIProducts();

		this.productsSubscription = this.products$.subscribe(res => {
			// PRODUCTS
			this.items = res['result'];

			if (this.items.length <= 0) {
				this.noProductFound = true;
			} else {
				this.noProductFound = false;
			}

			this.sidebarComponent.productsLoaded();

			// SORT
			this.count = res['count'];
			this.page = res['page'];
			this.total = res['total'];

			this._addCategories(this.items);

			this._setMeta();

			this.changeDetector.detectChanges();
		});

		this.sectionsSubscription = this.sections$.subscribe(res => {
			// SIDEBAR
			this.sections = [];

			if (this.sidebarFilterCategories !== undefined && this.sidebarFilterCategories.length > 0) {
				let categoriesName: any[] = this.fetchSidebarFilterCategoriesText(this.sidebarFilterCategories);

				let sectionObject = this.categoriesSectionObject(categoriesName);

				this.sections.push(sectionObject);

				this.sections = this.sections.concat(res['sidebar']);
			} else {
				this.sections = res['sidebar'];
			}

			this.changeDetector.detectChanges();
		});
	}

	private processProductListing(cat: any, subCat: any, subSubCat: any): void {
		if (this.apiCategories.length > 0) {
			for (let i = 0; i < this.apiCategories.length; i++) {
				// CATEGORIES
				const a = this.apiCategories;

				if (this.CS.formatted(a[i]['name']) === cat) {
					subCat = (cat === subCat) ? undefined : subCat;

					this._setCategoryProducts(a[i], cat, subCat, subSubCat);

					if (subCat) {
						// SUB - CATEGORY
						this._setSubCategoryProducts(a[i], cat, subCat, subSubCat);
					}
				}
			}
		}
	}

	// tslint:disable-next-line:no-unnecessary-initializer
	private _setCategoryProducts(a: any[], cat: string, subCat: string = undefined, subSubCat: string = undefined): void {
		if (cat !== '' && subCat === undefined && subSubCat === undefined) {
			// SET VARIABLES
			this.id = 'catId3';
			this.cat = a['id'];

			if (this.isCategorySectionLoaded === false) {
				// SET SIDEBAR FILTER CATEGORIES
				this._setSidebarFilterCategories(a);
			}

			this.currentCategoryName = a['name'];

			// SET CATEGORIES
			this._setCategory(a);

			// SET PAGINATION
			this.setPagination(1);
		}
	}

	// tslint:disable-next-line:no-unnecessary-initializer
	private _setSubCategoryProducts(a: any[], cat: string, subCat: string, subSubCat: string = undefined): void {
		const b: string[] = a['categories'] !== undefined ? a['categories'] : [];
		let isSubCategory = false;

		if (b.length > 0) {
			for (let x = 0; x < b.length; x++) {
				if (this.CS.formatted(b[x]['name']) === subCat) {
					if (subCat !== '' && cat !== '' && subSubCat === undefined) {
						// SET VARIABLES
						isSubCategory = true;
						this.id = 'catId4';
						this.cat = b[x]['id'];

						this.currentCategoryName = b[x]['name'];

						// SET PAGINATION
						this.setPagination(1);
					}
				}
			}

			if (!isSubCategory) {
				this._setSubCategoryToCategory(cat);
			}
		}
	}

	private _setSubCategoryToCategory(cat: string): void {
		for (let i = 0; i < this.apiCategories.length; i++) {
			const a = this.apiCategories;

			if (this.CS.formatted(a[i]['name']) === cat) {
				this._setCategoryProducts(a[i], cat);
			}
		}
	}

	private processProductCategories(cat: any, subCat: any, subSubCat: any) {
		if (this.apiCategories) {
			this.processProductListing(cat, subCat, subSubCat);
		} else {
			this.CS.getCat().subscribe(res => {
				if (res) {
					this.apiCategories = res[0]['categories'];

					this.processProductListing(cat, subCat, subSubCat);
				}
			});
		}
	}

	private _setIProducts() {
		// URL SYNTAX
		let cat: string;
		let subCat: string;
		let subSubCat: string;

		this.routerParamSubscription = this.route.params.subscribe(params => {
			cat = params['cat'];
			subCat = params['sub'];
			subSubCat = params['sub-sub'];
		});

		this.processProductCategories(cat, subCat, subSubCat);
	}

	/**
	 * Set meta tag after category page product listing
	 */
	private _setMeta() {
		let t = this.currentCategoryName;

		// SEO
		this.SS.generateTags({
			title: 'Buy ' + t + ' Online - groceri',
			description: 'Shop online the best quality ' + t + ' items at the best price, search over 100\'s of online retailers for your favorite branded ' + t + ' products.',
			url: this.router.url,
		});
	}

	/**
	 * Process item categories for sidebar filters
	 */
	private _setSidebarFilterCategories(cat: object) {
		this.isCategorySectionLoaded = true;

		// CLEAR CATEGORY
		let a = [];

		// SET IF EXISTS
		a = cat['categories'] !== undefined ? cat['categories'] : [];

		if (this.sections.length > 0) {
			let categoriesName: any[] = this.fetchSidebarFilterCategoriesText(a);

			let sectionObject = this.categoriesSectionObject(categoriesName);

			let apiSections: any[] = this.sections;
			let sectionsArray: any[] = [];

			sectionsArray.push(sectionObject);

			this.sections = sectionsArray.concat(apiSections);
		} else {
			// FILL CATEGORY OBJECT
			this.sidebarFilterCategories = a;
		}
	}

	private renameArrayKeys(arrayValue) {
		let newArray = arrayValue.map((value, key) => ({ value: value }));

		return newArray;
	}

	/**
	 * Process categories section object
	 */
	private categoriesSectionObject(categoriesName) {
		categoriesName = this.renameArrayKeys(categoriesName);

		let sectionObject = {
			Name: 'Category',
			Type: 'Checkbox',
			Value: categoriesName,
		};

		return sectionObject;
	}

	/**
	 * Get categories name from categories array of object
	 */
	private fetchSidebarFilterCategoriesText(categories) {
		let categoriesName: any[] = [];

		for (let a of categories) {
			categoriesName.push(a.name);
		}

		return categoriesName;
	}

	private _setCategory(cat: object) {
		// CLEAR CATEGORY
		let a = [];

		// SET IF EXISTS
		a = cat['categories'] !== undefined ? cat['categories'] : [];

		// FILL CATEGORY OBJECT
		this.categories = a;
	}

	private _findIProductsInCategory(catI: number, itemI: number) {
		if (catI === itemI) {
			return true;
		}

		return false;
	}

	private _addCategories(item) {
		if (this.categories !== undefined && this.categories.length > 0) {
			this.categories.forEach(c => {
				// ONLY ADD IF CAT3
				if (item['catId3']) {
					// ADD CATEGORIES SIDEBAR
					if (this._findIProductsInCategory(Number(c.id), Number(item['catId4']))) {
						// ONLY ADD IF DOESNT EXISTS
						c.num === undefined || c.num == null ? (c.num = 1) : c.num++;
					}
				}
			});
		}
	}

	/**
	 * Get sidebar informarion and process to make query
	 * string and regenerate IProduct listing
	 */
	getSidebarData(eventData) {
		this.tempSidebarData = {};
		if (this.mobileFilterComponent) {
			this.mobileFilterComponent.resetFilterData();
		}

		this.getMobileAppliedFiltersData();
		this.initializeNewFilters(eventData);
		this._init();
	}

	getMobileSidebarData(eventData) {
		if (!environment.production) {
			console.log('Filter Data', eventData);
		}

		this.tempSidebarData = eventData;
		this.changeDetector.detectChanges();
	}

	processMobileSectionDataToQueryParams() {
		// tslint:disable-next-line:forin
		for (let section in this.sidebarData) {
			this.sidebarComponent.updateURLQueryParameters(this.sidebarData[section], section);
		}
	}

	private initializeNewFilters(eventData) {
		this.noProductFound = false;
		if (this.sidebarComponent.productsNotLoaded !== undefined) {
			this.sidebarComponent.productsNotLoaded();
		}
		this.sidebarData = eventData;
		this.filterResult = '';
		this.filterDataToOdata(eventData);
	}

	/**
	 * Escape special character in oData param
	 */
	private escapeoDataQueryParam(param: string) {
		param = encodeURIComponent(param.replace(/'/g, '\'\''));
		param = encodeURIComponent(param.replace(/&/g, '%26'));

		return param;
	}

	/**
	 * Get sidebar data and create query string
	 */
	private encodeDataURI(property, dataArray) {
		let parameters = [];
		if (Array.isArray(dataArray) && dataArray.length > 0) {
			let dataArrayLength: number = dataArray.length;

			for (let data in dataArray) {
				/**
				 * This part can be used later for a complete $filter parameter
				 */
				if (typeof dataArray[data] === 'object') {
					parameters.push(' and price ge ' + dataArray[data].minPrice);
					parameters.push(' and price le ' + dataArray[data].maxPrice);
				} else {
					// tslint:disable-next-line:radix
					let currentIndex: number = parseInt(data) + 1;

					if (property === 'Category') {
						let firstParamPrefix: string;

						firstParamPrefix = this.isFirstCategoriesURLParam === true ? ' and (' : ' or ';

						this.isFirstCategoriesURLParam = false;

						let categoryID: number = this.getCategoryIDFromName(dataArray[data]);
						parameters.push(firstParamPrefix + 'catId4 eq ' + categoryID);

						if (currentIndex === dataArrayLength) {
							parameters.push(')');
						}
					} else if (property === 'Brand') {
						let firstParamPrefix: string;

						firstParamPrefix = this.isFirstBrandURLParam === true ? ' and (' : ' or ';

						this.isFirstBrandURLParam = false;

						parameters.push(firstParamPrefix + property.toLowerCase() + ' eq ' + '\'' + this.escapeoDataQueryParam(dataArray[data]) + '\'');

						if (currentIndex === dataArrayLength) {
							parameters.push(')');
						}
					} else if (property === 'Size (Ounces)') {
						let firstParamPrefix: string;

						firstParamPrefix = this.isFirstSizeURLParam === true ? ' and (' : ' or ';

						this.isFirstSizeURLParam = false;

						parameters.push(firstParamPrefix + 'size eq ' + '\'' + this.escapeoDataQueryParam(dataArray[data]) + '\'');

						if (currentIndex === dataArrayLength) {
							parameters.push(')');
						}
					} else if (property === 'Count') {
						let firstParamPrefix: string;

						firstParamPrefix = this.isFirstCountURLParam === true ? ' and (' : ' or ';

						this.isFirstCountURLParam = false;

						parameters.push(firstParamPrefix + property.toLowerCase() + ' eq ' + dataArray[data]);

						if (currentIndex === dataArrayLength) {
							parameters.push(')');
						}
					} else if (property === 'Weight') {
						let firstParamPrefix: string;

						firstParamPrefix = this.isFirstWeightURLParam === true ? ' and (' : ' or ';

						this.isFirstWeightURLParam = false;

						parameters.push(firstParamPrefix + property.toLowerCase() + ' eq ' + '\'' + this.escapeoDataQueryParam(dataArray[data]) + '\'');

						if (currentIndex === dataArrayLength) {
							parameters.push(')');
						}
					} else if (property === 'Diet') {
						let firstParamPrefix: string;

						firstParamPrefix = this.isFirstDietURLParam === true ? ' and (' + property.toLowerCase() + '/any(d: ' : ' or ';

						this.isFirstDietURLParam = false;

						parameters.push(firstParamPrefix + 'd eq ' + '\'' + this.escapeoDataQueryParam(dataArray[data]) + '\'');

						if (currentIndex === dataArrayLength) {
							parameters.push('))');
						}
					} else if (property === 'Type') {
						let firstParamPrefix: string;

						firstParamPrefix = this.isFirstTypesURLParam === true ? ' and (types/any(d: ' : ' or ';

						this.isFirstTypesURLParam = false;

						parameters.push(firstParamPrefix + 'd eq ' + '\'' + this.escapeoDataQueryParam(dataArray[data]) + '\'');

						if (currentIndex === dataArrayLength) {
							parameters.push('))');
						}
					} else if (property === 'Rating') {
						// tslint:disable-next-line:radix
						let lowerRating: number = parseInt(dataArray[data]);
						let upperRating = lowerRating + 1;

						let firstParamPrefix: string;

						firstParamPrefix = this.isFirstRatingURLParam === true ? ' and (' : ' or ';

						this.isFirstRatingURLParam = false;

						parameters.push(firstParamPrefix + '(' + property.toLowerCase() + ' ge ' + lowerRating + ' and ' + property.toLowerCase() + ' le ' + upperRating + ')');

						if (currentIndex === dataArrayLength) {
							parameters.push(')');
						}
					} else {
						parameters.push(' and ' + property + ' eq ' + '\'' + this.escapeoDataQueryParam(dataArray[data]) + '\'');
					}
				}
			}

			let encodedUrl = parameters.join('');
			return encodedUrl;
		}

		return false;
	}

	/**
	 * Get category id from category name
	 */
	private getCategoryIDFromName(categoryName) {
		let categoryID = 0;

		if (this.sidebarFilterCategories.length > 0) {
			for (let categoryObject of this.sidebarFilterCategories) {
				if (categoryObject.name === categoryName) {
					categoryID = categoryObject.id;
					break;
				}
			}
		}

		return categoryID;
	}

	/**
	 * Summ up all sidebar data and append to create
	 * final query string
	 */
	private filterDataToOdata(dataObject) {
		if (dataObject !== undefined || typeof dataObject === 'object') {
			this.isFirstCategoriesURLParam = true;
			this.isFirstBrandURLParam = true;
			this.isFirstSizeURLParam = true;
			this.isFirstWeightURLParam = true;
			this.isFirstCountURLParam = true;
			this.isFirstTypesURLParam = true;
			this.isFirstDietURLParam = true;
			this.isFirstRatingURLParam = true;

			for (let property in dataObject) {
				if (dataObject.hasOwnProperty(property)) {
					let encodedData = this.encodeDataURI(property, dataObject[property]);

					if (encodedData !== false) {
						this.filterResult = this.filterResult + encodedData;
					}
				}
			}
		}
	}

	/**
	 * Get sort component data and process to HTTP request
	 */
	sortDataChange(eventData) {
		this.sortBy = eventData;

		this.noProductFound = false;

		this.orderResult = '$orderby=' + this.sortBy;

		if (this.sidebarComponent.productsNotLoaded !== undefined) {
			this.sidebarComponent.productsNotLoaded();
		}

		this._init();
	}

	updateProductsBySort(eventData) {
		this.sortDataChange(eventData);
	}

	removeMobileAppliedFilter(name, value, index) {
		this.sidebarComponent.removeInputField(name, value, index);
		this.changeDetector.detectChanges();
	}

	resetMobileFilter() {
		return this.checkObjectPropertiesEmpty(this.tempSidebarData);
	}

	private checkObjectPropertiesEmpty(object) {
		if (Object.keys(object).length === 0 && object.constructor === Object) {
			return true;
		}

		let tempArray = Object.keys(object).map(i => object[i]);

		let filterOptions = tempArray.filter(element => element.length > 0);

		if (filterOptions.length > 0) {
			return false;
		} else {
			return true;
		}
	}

	private _swipeActionsFilter(): boolean | void {
		try {
			if (this.swipeFilter === undefined || this.swipeFilterIcon === undefined) { return false; }

			let filterElement = this.swipeFilter.nativeElement;
			let iconElement = this.swipeFilterIcon.nativeElement;

			this.hammerService.SwipeUp(iconElement).subscribe(data => {
				this.openSidebar('up');
			});

			this.hammerService.SwipeLeftDownClose(filterElement).subscribe(data => {
				if (data.swipe === 'down') {
					this.openSidebar('down');
				}
				if (data.swipe === 'left') {
					this.openSidebar('down');
					history.pushState(null, null, location.href);
				}
			});
		} catch (error) {
			console.log(error);
		}
	}
}

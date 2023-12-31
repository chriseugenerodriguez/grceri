import { Component, Input, OnDestroy, OnChanges, AfterViewInit, ViewChild, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, Inject, ElementRef } from '@angular/core';
import { DOCUMENT } from '@angular/common';

// CHILDREN
import { SortComponent } from '../../shared/widgets/sort/sort.component';

// INTERFACES
import { IProduct } from '../../shared/interfaces/product/product.interface';

// SERVICES
import { SearchAPIService, HttpCancelService, SearchBarService, CategoryAPIService, SeoService, DeviceService, HammerService } from '../../shared/services';

// SEO
import { ActivatedRoute, Router } from '@angular/router';

// SIDEBAR
import { SidebarComponent } from '../../shared/widgets/sidebar/sidebar.component';
import { MobileFilterComponent } from '../../shared/widgets/mobile-filter/mobile-filter.component';

// RXJS
import { Subject, Subscription, forkJoin } from 'rxjs';

// ENV
import { environment } from '../../../environments/environment';

// COMPONENT
@Component({
	moduleId: module.id,
	selector: 'search',
	templateUrl: 'search.component.html',
	styleUrls: ['search.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent implements OnDestroy, OnInit, OnChanges, AfterViewInit {
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
	bothSearchForkJoinSubscription: Subscription;

	// SORT BY
	sortBy: any = null;

	// SIDEBAR FILTERS
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

	// PROCESS SEARCH PAGE URL QUERYPARAMS
	categoryID: number;
	queryText: string;

	// Applied Filters
	mobileAppliedFilters: any[];

	constructor(
		@Inject(DOCUMENT) private document: Document,
		private searchAPI: SearchAPIService,
		private router: Router,
		private route: ActivatedRoute,
		protected CS: CategoryAPIService,
		private SS: SeoService,
		private SBS: SearchBarService,
		private changeDetector: ChangeDetectorRef,
		private httpCancelService: HttpCancelService,
		public DS: DeviceService,
		private hammerService: HammerService
	) {
		// refreshes route
		this.router.routeReuseStrategy.shouldReuseRoute = () => false;

		this.isFirstCategoriesURLParam = true;
		this.isFirstBrandURLParam = true;
		this.isFirstSizeURLParam = true;
		this.isFirstWeightURLParam = true;
		this.isFirstCountURLParam = true;
		this.isFirstDietURLParam = true;
		this.isFirstRatingURLParam = true;
		this.isFirstTypesURLParam = true;
		this.filterResult = '';
		this.orderResult = '';

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

		this.getMobileAppliedFiltersData();
		this.changeDetector.detach();
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
			this.filterDataToOdata(queryParamsObject);
			this.changeDetector.detectChanges();
		}

		this._init();
	}

	/**
	 * Check Object is empty
	 */
	private checkEmptyObject(obj: object) {
		return Object.keys(obj).length === 0 && obj.constructor === Object;
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

	ngOnDestroy(): void {
		if (this.productsSubscription) {
			this.productsSubscription.unsubscribe();
		}
		if (this.sectionsSubscription) {
			this.sectionsSubscription.unsubscribe();
		}
		if (this.bothSearchForkJoinSubscription) {
			this.bothSearchForkJoinSubscription.unsubscribe();
		}

		this.httpCancelService.cancelPendingRequests();
		if (!environment.production && !this.httpCancelService) {
			console.log('canceled pending request');
		}
	}

	/**
	 * Process subscription result observable,
	 * render product listing with pagination
	 * and generate tags
	 */
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

		let productsObservable$ = this.searchAPI.getSearchPageContent(this.categoryID, this.filterResult, this.orderResult, this.queryText, this.page);

		let sectionsObservable$ = this.searchAPI.getSearchPageSidebar(this.categoryID, this.queryText);

		let observables$ = forkJoin([productsObservable$, sectionsObservable$]);

		this.bothSearchForkJoinSubscription = observables$.subscribe(([products, sections]) => {
			this.products$.next(products);
			this.sections$.next(sections);
		});
	}

	/**
	 * Process filterResult variable for query
	 */
	private processFilterResultForQuery() {
		this.filterResult = this.filterResult.replace(' and ', '');
	}

	/**
	 * Component engine fn to start creating subscriptions and generate
	 * products/sections listings
	 */
	private _init() {
		this._setIProducts();

		this.processProductsSubscription();
		this.processSectionsSubscription();
	}

	/**
	 * Process products subscription, initialize product listing variables
	 */
	private processProductsSubscription() {
		this.productsSubscription = this.products$.subscribe(res => {
			// PRODUCTS
			this.items = res['result'];

			this.noProductFound = this.items.length <= 0 ? true : false;

			this.sidebarComponent.productsLoaded();

			// SORT
			this.count = res['count'];
			this.page = res['page'];
			this.total = res['total'];

			this._setMeta();

			this.changeDetector.detectChanges();
		});
	}

	/**
	 * Process sections subscription, initialize section listing variables
	 */
	private processSectionsSubscription() {
		this.sectionsSubscription = this.sections$.subscribe(res => {
			// SIDEBAR
			this.sections = res['sidebar'];

			this.changeDetector.detectChanges();
		});
	}

	/**
	 * Get search page information and render products listing
	 */
	private _setIProducts() {
		this.route.queryParamMap.subscribe(params => {
			let paramsObj = { ...params.keys, ...params };

			this.categoryID = paramsObj['params']['cat_id'];
			this.queryText = paramsObj['params']['query'];
		});

		// SET PAGINATION
		this.setPagination(1);
	}

	/**
	 * Genrate meta tags for search results page
	 */
	private _setMeta() {
		// SEO
		this.SS.generateTags({
			title: 'Search results for: ' + this.queryText + ' - grceri',
			description: 'We found ' + this.total + ' search results for ' + this.queryText + '.',
			url: this.router.url,
		});
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
		// tslint:disable-next-line:quotemark
		param = encodeURIComponent(param.replace(/'/g, "''"));
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

					if (property === 'Brand') {
						let firstParamPrefix: string;

						firstParamPrefix = this.isFirstBrandURLParam === true ? ' and (' : ' or ';

						this.isFirstBrandURLParam = false;

						// tslint:disable-next-line:quotemark
						parameters.push(firstParamPrefix + property.toLowerCase() + ' eq ' + "'" + this.escapeoDataQueryParam(dataArray[data]) + "'");

						if (currentIndex === dataArrayLength) {
							parameters.push(')');
						}
					} else if (property === 'Size (Ounces)') {
						let firstParamPrefix: string;

						firstParamPrefix = this.isFirstSizeURLParam === true ? ' and (' : ' or ';

						this.isFirstSizeURLParam = false;

						// tslint:disable-next-line:quotemark
						parameters.push(firstParamPrefix + 'size eq ' + "'" + this.escapeoDataQueryParam(dataArray[data]) + "'");

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

						// tslint:disable-next-line:quotemark
						parameters.push(firstParamPrefix + property.toLowerCase() + ' eq ' + "'" + this.escapeoDataQueryParam(dataArray[data]) + "'");

						if (currentIndex === dataArrayLength) {
							parameters.push(')');
						}
					} else if (property === 'Diet') {
						let firstParamPrefix: string;

						firstParamPrefix = this.isFirstDietURLParam === true ? ' and (' + property.toLowerCase() + '/any(d: ' : ' or ';

						this.isFirstDietURLParam = false;

						// tslint:disable-next-line:quotemark
						parameters.push(firstParamPrefix + 'd eq ' + "'" + this.escapeoDataQueryParam(dataArray[data]) + "'");

						if (currentIndex === dataArrayLength) {
							parameters.push('))');
						}
					} else if (property === 'Type') {
						let firstParamPrefix: string;

						firstParamPrefix = this.isFirstTypesURLParam === true ? ' and (types/any(d: ' : ' or ';

						this.isFirstTypesURLParam = false;

						// tslint:disable-next-line:quotemark
						parameters.push(firstParamPrefix + 'd eq ' + "'" + this.escapeoDataQueryParam(dataArray[data]) + "'");

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
						// tslint:disable-next-line:quotemark
						parameters.push(' and ' + property + ' eq ' + "'" + this.escapeoDataQueryParam(dataArray[data]) + "'");
					}
				}
			}

			let encodedUrl = parameters.join('');
			return encodedUrl;
		}

		return false;
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
			this.isFirstCountURLParam = true;
			this.isFirstWeightURLParam = true;
			this.isFirstDietURLParam = true;
			this.isFirstTypesURLParam = true;
			this.isFirstRatingURLParam = true;

			for (let property in dataObject) {
				if (dataObject.hasOwnProperty(property)) {
					let encodedData = this.encodeDataURI(property, dataObject[property]);

					if (encodedData !== false) {
						this.filterResult = this.filterResult + encodedData;
					}
				}
			}

			if (this.filterResult !== '') {
				this.processFilterResultForQuery();
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
		this.changeDetector.detectChanges();
	}

	updateProductsBySort(eventData) {
		this.sortDataChange(eventData);
	}

	resetMobileFilter() {
		return this.checkObjectPropertiesEmpty(this.tempSidebarData);
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


	processMobileSectionDataToQueryParams() {
		// tslint:disable-next-line:forin
		for (let section in this.sidebarData) {
			this.sidebarComponent.updateURLQueryParameters(this.sidebarData[section], section);
		}
	}

	getMobileSearchSidebarData(eventData) {
		if (!environment.production) {
			console.log('Filter Data', eventData);
		}

		this.tempSidebarData = eventData;
		this.changeDetector.detectChanges();
	}

	removeMobileAppliedFilter(name, value, index) {
		this.sidebarComponent.removeInputField(name, value, index);
		this.changeDetector.detectChanges();
	}

	resetSearchMobileFilter() {
		return this.checkObjectPropertiesEmpty(this.tempSidebarData);
	}

	private checkObjectPropertiesEmpty(object) {
		if (Object.keys(object).length === 0 && object.constructor === Object) {
			return true;
		}

		let tempArray = Object.keys(object).map(i => object[i]);

		let filterOptions = tempArray.filter(element => element.length > 0);

		if (filterOptions.length > 0) { return false; } else { return true; }
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

import {
	Component, EventEmitter, Input, OnInit, Output, OnChanges, ChangeDetectionStrategy,
	AfterViewInit, SimpleChanges, QueryList, ViewChildren, ChangeDetectorRef
} from '@angular/core';
import { Location } from '@angular/common'

// SHARED
import { DynamicComponent } from './dynamic/dynamic.component';

// ROUTER
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

// ENV
import { environment } from '../../../../environments/environment';
import { DeviceService } from '../../services';

@Component({
	selector: 'sidebar',
	templateUrl: 'sidebar.component.html',
	styleUrls: ['sidebar.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent implements OnInit, OnChanges, AfterViewInit {
	// VIEWCHILD
	@ViewChildren('dynamiccomponent')
	dynamicComponents: QueryList<DynamicComponent>;
	dynamicComponentArray: any[];

	// INPUTS
	@Input('ssections') sSections: [];
	@Input('scategories') sCategories: [];
	@Input('sidebarcache') sidebarCache: {};

	// OUTPUT
	@Output() activeFilters: EventEmitter<any> = new EventEmitter<any>();

	// ARRAY
	toggle = {};

	sectionData: object = {};
	queryParameters: object = {};
	searchPageQueryParameters: object;

	// PLACEHOLDER
	nSections = Array(7).fill(1);

	// Applied Filters
	appliedFilters: any[] = [];

	constructor(private route: ActivatedRoute,
		private router: Router,
		private http: HttpClient,
		public changeDetector: ChangeDetectorRef,
		public DS: DeviceService,
		private location: Location) {
		this.dynamicComponentArray = [];
	}

	ngOnInit() {
		this.assignSidebarCacheToSection();
		this.getQueryParamtersAndProcess();
	}

	ngOnChanges(changes: SimpleChanges) {
		// this.processAppliedFilters();
		this.changeDetector.detectChanges();
	}

	ngAfterViewInit() {
		this.dynamicComponents.changes.subscribe(
			(comps: QueryList<DynamicComponent>) => {
				this.dynamicComponentArray = [];
				comps.toArray().forEach((item) => {
					this.dynamicComponentArray.push(item);
					this.changeDetector.detectChanges();
				});
			});

		this.changeDetector.detach();
	}

	// initializeSidebarComponentSectionData(sections){
	// 	this.sSections = sections;
	// 	if(this.sSections.length > 0){
	// 		console.log('sSections', this.sSections);
	// 		this.changeDetector.detectChanges();
	// 	}
	// }

	/**
	* Get query parameter and process for next iteration
	*/
	private getQueryParamtersAndProcess() {
		this.route.queryParamMap
			.subscribe((params: any) => {
				let orderObj = { ...params.keys, ...params };
				params = orderObj.params;

				this.processQueryParameters(params);
			});
	}

	/**
	* Assign sidebar cache informarion as sidebar sections information
	*/
	private assignSidebarCacheToSection() {
		if (this.sidebarCache) {
			if (this.sidebarCache['Size']) {
				this.sidebarCache['Size (Ounces)'] = this.sidebarCache['Size'];
				delete this.sidebarCache['Size'];
			}
			this.sectionData = this.sidebarCache;
			this.processAppliedFilters();
		}
	}

	/**
	* Get query parameter informarion and process for next iteration
	*/
	private processQueryParameters(params: any) {
		if (params.cat_id || params.query) {
			this.searchPageQueryParameters = [];
			this.searchPageQueryParameters['cat_id'] = params.cat_id;
			this.searchPageQueryParameters['query'] = params.query;
		}

		if (params.Category) {
			this.queryParameters['Category'] = params.Category;
		}
		if (params.Brand) {
			this.queryParameters['Brand'] = params.Brand;
		}
		if (params.Weight) {
			this.queryParameters['Weight'] = params.Weight;
		}
		if (params.Price) {
			this.queryParameters['Price'] = params.Price;
		}
		if (params.Size) {
			this.queryParameters['Size'] = params.Size;
		}
		if (params.Count) {
			this.queryParameters['Count'] = params.Count;
		}
		if (params.Diet) {
			this.queryParameters['Diet'] = params.Diet;
		}
		if (params.Rating) {
			this.queryParameters['Rating'] = params.Rating;
		}
		if (params.Type) {
			this.queryParameters['Type'] = params.Type;
		}
	}

	/**
	* Clear all applied filters
	*/
	clearAllFilters() {
		this.appliedFilters = [];
		this.sectionData = {};
		this.sidebarCache = {};

		if (this.dynamicComponentArray.length > 0) {
			for (let component of this.dynamicComponentArray) {
				component.manuallyResetAllDataOut();
			}
		}

		this.resetQueryParameters();

		this.activeFilters.emit(this.sectionData);

		this.changeDetector.detectChanges();
	}

	/**
	* Reset Query Parameters
	*/
	private resetQueryParameters() {
		this.queryParameters = {};
		if (this.searchPageQueryParameters) {
			this.queryParameters['cat_id'] = this.searchPageQueryParameters['cat_id'];
			this.queryParameters['query'] = this.searchPageQueryParameters['query'];
			this.addQueryParamsToURL(this.queryParameters);
		} else {
			this.addQueryParamsToURL();
		}
	}

	/**
	* Process sectionData to implement applied filters
	*/
	private processAppliedFilters() {
		if (Object.keys(this.sectionData).length > 0) {
			this.appliedFilters = [];

			for (let section in this.sectionData) {

				if (this.sectionData[section].length <= 0) {
					continue;
				}

				if (section === 'Price') {
					let title = this.processPriceAppliedFilterstitle(section);
					let value = 0;

					this.insertAppliedFiltersData(section, value, title);
				} else if (section === 'Rating') {
					for (let key in this.sectionData[section]) {
						if (key) {
							// tslint:disable-next-line:radix
							let star_value = parseInt(this.sectionData[section][key]);
							let next_star_value = star_value + 1;
							let title = star_value + ' - ' + next_star_value + ' Stars';
							let value = this.sectionData[section][key];

							this.insertAppliedFiltersData(section, value, title);
						}

					}
				} else {
					for (let key in this.sectionData[section]) {
						if (key) {
							this.insertAppliedFiltersData(section,
								this.sectionData[section][key],
								this.sectionData[section][key]);
						}
					}
				}
			}
		}
	}

	/**
	* Process name and value pair for applied filters
	* and insert to appliedFilters array
	*/
	private insertAppliedFiltersData(name, value, title) {
		let filterData = {
			name,
			value,
			title
		};

		this.appliedFilters.push(filterData);
	}

	/**
	* Process Price value for applied section
	*/
	private processPriceAppliedFilterstitle(section) {
		let title = '$' + this.sectionData[section][0].minPrice +
			' - ' + '$' + this.sectionData[section][0].maxPrice;

		return title;
	}

	/**
	* Clear a specific filter
	*/
	removeInputField(name, value, index) {
		this.appliedFilters.splice(index, 1);

		if (name === 'Price') {
			this.processSectionDataToQueryParams(name, undefined);

			delete this.sectionData[name];

			this.manuallyRefreshDynamicComponentFields(name);

			this.activeFilters.emit(this.sectionData);
			return false;
		}

		this.removeArrayElementByValue(this.sectionData[name], value);

		this.mergeSectionDataToCache(name);

		this.manuallyRefreshDynamicComponentFields(name);

		this.processSectionDataToQueryParams(name, this.sectionData[name]);

		this.activeFilters.emit(this.sectionData);

		this.changeDetector.detectChanges();
	}

	private manuallyRefreshDynamicComponentFields(sectionName) {
		let currentComponent = this.currentComponentInformation(sectionName);

		if (currentComponent !== false) {

			if (sectionName === 'Price') {
				let currentSectionInformation: any[] = [];

				currentComponent.manuallySetDataOut(currentSectionInformation);
			} else {
				let currentSectionInformation: any[] = [];

				currentSectionInformation = this.sectionData[sectionName] !== undefined
					? this.sectionData[sectionName] : '';

				currentComponent.manuallySetDataOut(currentSectionInformation);
			}
		}
	}

	private currentComponentInformation(sectionName) {
		let currentComponent: any;

		if (this.dynamicComponentArray.length > 0) {
			for (let component of this.dynamicComponentArray) {
				if (component.sectionName === sectionName) {
					currentComponent = component;
					break;
				}
			}
		}

		if (currentComponent === undefined) {
			return false;
		} else {
			return currentComponent;
		}
	}

	/**
	* Get specific sectiondata and merge with sidebar cache
	*/
	private mergeSectionDataToCache(name) {
		this.sidebarCache[name] = this.sectionData[name];

		if (this.sectionData[name].length <= 0) {
			delete this.sectionData[name];
			delete this.sidebarCache[name];
		}
	}

	/**
	* Remove array element by value
	*/
	private removeArrayElementByValue(arr, what) {
		let a = arguments, L = a.length, ax;
		while (L > 1 && arr.length) {
			what = a[--L];
			while ((ax = arr.indexOf(what)) !== -1) {
				arr.splice(ax, 1);
			}
		}
		return arr;
	}

	/**
  * Get dynamic component section informarion
  * and send beck to Category component
  */
	changeFilterStatus(eventData: string[], filterOption: string) {
		// this.sectionData[filterOption] = eventData;
		//
		// this.processAppliedFilters();
		//
		// let priceRangeData = (filterOption === 'Price') ?
		// 	this.processPriceSectionDataForQueryParams(eventData) :
		// 	eventData;
		//
		// this.processSectionDataToQueryParams(filterOption, priceRangeData);

		this.updateURLQueryParameters(eventData, filterOption);

		this.activeFilters.emit(this.sectionData);

		this.changeDetector.detectChanges();
	}

	updateURLQueryParameters(eventData: string[], filterOption: string){
		this.sectionData[filterOption] = eventData;

		this.processAppliedFilters();

		let priceRangeData = (filterOption === 'Price') ?
			this.processPriceSectionDataForQueryParams(eventData) :
			eventData;

		this.processSectionDataToQueryParams(filterOption, priceRangeData);
	}

	/**
	* Get price section object and assign to array
	*/
	private processPriceSectionDataForQueryParams(data: any) {
		if (data.length <= 0) {
			return undefined;
		}

		let priceRange: any[] = [];
		priceRange.push(data[0].minPrice);
		priceRange.push(data[0].maxPrice);
		return priceRange;
	}

	/**
	* Get sidebar section information and process to query parameters
	*/
	private processSectionDataToQueryParams(section: string, data: any) {
		section = (section === 'Size (Ounces)') ? 'Size' : section;

		if (this.searchPageQueryParameters) {
			let newQueryParameters = {
				'cat_id': this.searchPageQueryParameters['cat_id'],
				'query': this.searchPageQueryParameters['query'],
				...this.queryParameters
			}

			this.queryParameters = newQueryParameters;
			// this.queryParameters['cat_id'] = this.searchPageQueryParameters['cat_id'];
			// this.queryParameters['query'] = this.searchPageQueryParameters['query'];
		}

		if (data === undefined || data.length <= 0) {
			delete this.queryParameters[section];
		} else {
			if (!environment.production) {
				console.log('Section Data before', data);
			}
			let sectionData = encodeURIComponent(JSON.stringify(data));
			if (!environment.production) {
				console.log('Section Data AFTER', sectionData);
			}
			this.queryParameters[section] = sectionData;
		}

		let removeQueryParams = this.checkQueryParamsEmpty();

		if (removeQueryParams) {
			this.addQueryParamsToURL();
		} else {
			this.addQueryParamsToURL(this.queryParameters);
		}
	}

	/**
	* Add query params to URL upon having data
	*/
	addQueryParamsToURL(queryParameters: any = undefined) {
		const url = (queryParameters === undefined) ? this.router
			.createUrlTree([], {
				relativeTo: this.route
			}).toString() : this.router
				.createUrlTree([], {
					relativeTo: this.route,
					queryParams: queryParameters
				}).toString();

		this.location.go(url);
	}

	/**
	* Check whether query params are empty
	*/
	private checkQueryParamsEmpty() {
		return Object.keys(this.queryParameters).length === 0 &&
			this.queryParameters.constructor === Object;
	}

	/**
  * Get previously selected choices and send back to
  * Dynamic component
  */
	getSidebarCacheData(type) {
		if (this.sidebarCache[type] !== undefined &&
			this.sidebarCache[type].length > 0) {
			return this.sidebarCache[type];
		}

		return [];
	}

	/**
	* Make products loaded
	*/
	productsLoaded() {
		if (this.dynamicComponentArray.length > 0) {
			for (let c of this.dynamicComponentArray) {
				c.productsLoadedDynamicComponent();
			}
		}
	}

	/**
	* Make products not loaded
	*/
	productsNotLoaded() {
		if (this.dynamicComponentArray.length > 0) {
			for (let c of this.dynamicComponentArray) {
				c.productsNotLoadedDynamicComponent();
			}
		}
	}
}

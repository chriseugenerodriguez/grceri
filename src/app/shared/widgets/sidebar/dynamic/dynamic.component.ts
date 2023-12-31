import { Input, Component, OnInit, AfterViewInit, OnChanges, ChangeDetectorRef, ChangeDetectionStrategy,
	Output, EventEmitter } from '@angular/core';
import { Options, ChangeContext, PointerType } from 'ng5-slider';

@Component({
	selector: 'dynamic',
	templateUrl: './dynamic.component.html',
	styleUrls: ['dynamic.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynamicComponent implements OnInit, OnChanges, AfterViewInit {
	// INPUT
	@Input() dataIn: any[] = [];
	@Input() dataOut: any[] = [];
	@Input() sidebarCache: any[] = [];

	// OUTPUT
	@Output() activeFilters: EventEmitter<String[]> = new EventEmitter<String[]>();

	// OBJECT
	nData = Array(10).fill(1);
	list: any[] = [];

	// ARRAY
	seeMore = {};
	options: Options = {
		floor: 0,
		ceil: 100000,
		step: 1
	};

	// STRING
	type = '';

	// NUMBER
	floor: number;
	ceil: number;
	minValue = 0;
	maxValue = 1000;
	initialMinValue: number;
	initialMaxValue: number;
	previousMinValue: number;
	previousMaxValue: number;

	// EVENT EMITTER
	triggerFocus: EventEmitter<PointerType> = new EventEmitter<PointerType>();

	// INITIAL INPUTS
	uniqueID = '';
	initialFieldsLoaded = 8;
	fieldsLoaded: number;
	collapsable = false;
	isProductsLoaded: boolean;
	isPriceSliderActivated: boolean;

	/// Section
	sectionName = '';

	// Slider/Chart data
	priceSliderChartData: any[];
	priceSliderValue: any[];
	priceSliderCount: any[];

	constructor(public changeDetector: ChangeDetectorRef) {
		this.uniqueID = this.getUniqueID();
		this.fieldsLoaded = this.initialFieldsLoaded;
		this.isProductsLoaded = true;

		this.priceSliderValue = [];
		this.priceSliderCount = [];
	}

	ngOnInit() {
		this.renderSidebarData();
	}

	ngOnChanges(){
		this.changeDetector.detectChanges();
	}

	ngAfterViewInit(){
		this.changeDetector.detach();
	}

	/**
	* Get random ID for input field
	*/
	getUniqueInputID(i = '') {
		let ID = this.uniqueID + i;
		return ID;
	}

	/**
	* Get random ID
	*/
	getUniqueID() {
		return '_' + Math.random().toString(36).substr(2, 9);
	}

	/**
	* Check wheather products are loaded if not disable input
	*/
	disableInputUntillProductLoaded() {
		if (this.isProductsLoaded === false) {
			return true;
		}

		return false;
	}

	/**
  * Get sections data from API and render sidebar
  * according to sections data
  */
	renderSidebarData() {
		if (this.dataIn !== undefined && this.dataIn[1] !== undefined) {
			this.type = this.dataIn[0];
			this.sectionName = this.dataIn[2];

			if (this.dataIn[0] === 'Slider') {
				this.processSliderAPIData();
				this.processSliderChartAPIData();
			} else {
				if (this.dataIn[1].length > this.initialFieldsLoaded) {
					this.seeMore[this.uniqueID] = true;
					this.collapsable = true;
				}

				this.list = this.dataIn[1];
			}
		}

		this.processExistingSidebarData();

		this.changeDetector.detectChanges();
	}

	/**
	* Process API slider value to render slider chart
	*/
	processSliderChartAPIData() {
		let minToMaxPriceValue: number[] = [];
		let minToMaxPriceCount: number[] = [];

		this.priceSliderChartData = this.dataIn[1];

		this.priceSliderChartData.sort((a, b) => parseFloat(a.value) - parseFloat(b.value));

		this.dataIn[1].forEach(function(element) {
			minToMaxPriceValue.push(element.value);
			minToMaxPriceCount.push(element.count);
		});

		this.priceSliderValue = minToMaxPriceValue;
		this.priceSliderCount = minToMaxPriceCount;
	}

	/**
  * Process slider data from API and
  * render ng5-slider with min and max
  * value of API
  */
	processSliderAPIData() {
		let minMax = this.getMinMaxValueOfArray();
		let minPrice = minMax.min;
		let maxPrice = minMax.max;

		this.minValue = minPrice;
		this.maxValue = maxPrice;

		// this.minValue = parseInt(this.dataIn[1].minPrice);
		// this.maxValue = parseInt(this.dataIn[1].maxPrice);

		if (this.initialMinValue === undefined && this.initialMaxValue === undefined) {
			this.initialMinValue = this.minValue;
			this.initialMaxValue = this.maxValue;
		}

		let newOptions: Options = Object.assign({}, this.options);

		newOptions.floor = this.minValue;
		newOptions.ceil = this.maxValue;

		this.options = newOptions;

		this.triggerFocus.emit(PointerType.Min);

		// let slider_data = {
		// 	minPrice: parseInt(this.dataIn[1].minPrice),
		// 	maxPrice: parseInt(this.dataIn[1].maxPrice)
		// }

		let slider_data = {
			minPrice: minPrice,
			maxPrice: maxPrice
		}

		this.list[0] = slider_data;
	}

	/**
	* Convert floating to round value
	*/
	private priceRangeMinMax(value) {
			// tslint:disable-next-line:no-bitwise
			return value | 0;
	}

	/**
	* Get the lowest value from an array
	*/
	private lowestValueOfArray(array) {
		let minimum = Math.min.apply(Math, array);
		return minimum;
	}

	/**
	* Get the biggest value from an array
	*/
	private biggestValueOfArray(array) {
		let maximum = Math.max.apply(Math, array);
		return maximum;
	}

	/**
	* Get min max value from dataIn Object
	*/
	private getMinMaxValueOfArray() {
		let minMaxValue: number[] = [];

		this.dataIn[1].forEach(function(element) {
			minMaxValue.push(element.value);
		});

		let min = this.lowestValueOfArray(minMaxValue);
		min = this.priceRangeMinMax(min);

		let max = this.biggestValueOfArray(minMaxValue);
		max = this.priceRangeMinMax(max);

		let minMax = {
			min,
			max
		}

		return minMax;
	}

	/**
  * Get previously selected sidebar informarion
  * and merge with newly selected choices/slider
  * informarion
  */
	processExistingSidebarData() {
		if (this.sidebarCache.length > 0 || this.dataOut.length > 0) {
			if (this.type === 'Slider') {
				// tslint:disable-next-line:radix
				this.minValue = parseInt(this.sidebarCache[0].minPrice);
				// tslint:disable-next-line:radix
				this.maxValue = parseInt(this.sidebarCache[0].maxPrice);

				this.previousMinValue = this.minValue;
				this.previousMaxValue = this.maxValue;

				if (this.minValue === this.initialMinValue && this.maxValue === this.initialMaxValue) {
					this.isPriceSliderActivated = false;
				} else {
					this.isPriceSliderActivated = true;
				}
			} else {
				let newDataOut: any[] = this.dataOut.concat(this.sidebarCache);

				if (newDataOut.length > 0) {
					this.dataOut = newDataOut.filter(function (item, pos) {
						return newDataOut.indexOf(item) === pos;
					});
				}
			}
		}
	}

	/**
	* Disable apply button when prices range is not changed
	*/
	disableApplyButton() {
		if (this.isProductsLoaded === false) {
			return true;
		}

		if (this.initialMinValue === this.minValue && this.initialMaxValue === this.maxValue) {
			return true;
		}

		if (this.previousMinValue === this.minValue && this.previousMaxValue === this.maxValue) {
			return true;
		}

		return false;
	}

	/**
	* Select/Deselect input checkbox/radio according to dataOut
	*/
	activeFilter(value): boolean {
		// IF EXISTS
		if (this.dataOut.length <= 0) {
			return false;
		}

		return this.dataOut.findIndex(x => x === value) >= 0;
	}

	/**
	* Reset all input (check/radio/slider) if user
	* click clear all from applied filters
	*/
	manuallyResetAllDataOut() {
		this.dataOut = [];

		if (this.sectionName === 'Price') {
			this.isPriceSliderActivated = false;

			this.minValue = this.initialMinValue;
			this.maxValue = this.initialMaxValue;
		}
	}

	/**
	* Reset selected input (check/radio/slider) if user
	* click specific one from applied filters
	*/
	manuallySetDataOut(dataOut) {
		this.dataOut = dataOut;

		if (this.sectionName === 'Price') {
			this.isPriceSliderActivated = false;

			this.minValue = this.initialMinValue;
			this.maxValue = this.initialMaxValue;
		}
	}

	/**
	* When click cancel button in price slider reset min/max value
	* from slider and send API request if slider is already applied
	*/
	resetPriceRange() {
		if (this.initialMinValue !== undefined && this.initialMaxValue !== undefined) {
			this.minValue = this.initialMinValue;
			this.maxValue = this.initialMaxValue;

			if (this.isPriceSliderActivated !== undefined || this.isPriceSliderActivated === true) {
				this.isPriceSliderActivated = false;
				this.dataOut = [];

				this.activeFilters.emit(this.dataOut);
			}
		}

		this.changeDetector.detectChanges();
	}

	/**
	* Apply price range slider to API
	*/
	submitPriceRange() {
		this.dataOut = [];

		let data = {
			minPrice: this.minValue,
			maxPrice: this.maxValue
		};

		this.previousMinValue = this.minValue;
		this.previousMaxValue = this.maxValue;

		this.dataOut.push(data);

		this.isPriceSliderActivated = true;

		this.activeFilters.emit(this.dataOut);

		this.changeDetector.detectChanges();
	}

	/**
	* Upon clicking a field ssend selected input to category component
	*/
	changeFilter(event, value: String) {
		// IF CHECKED
		if (event.target.checked) {
			// PUSH VALUE
			this.dataOut.push(value);
		} else {
			// REMOVE VALUE
			this.dataOut = this.dataOut.filter(i => i !== value);
		}

		// PUSH TO SIDEBAR
		this.activeFilters.emit(this.dataOut);

		this.changeDetector.detectChanges();
	}

	/**
	* Expand or collapse section fields according to see more/see fewer selection
	*/
	expandCollapseFields() {
		if (this.collapsable === true) {

			let list_length = this.list.length;

			if (list_length === this.fieldsLoaded) {
				if (list_length < this.initialFieldsLoaded) {
					this.collapsable = false;
				} else {
					this.fieldsLoaded = this.initialFieldsLoaded;
					this.seeMore[this.uniqueID] = !this.seeMore[this.uniqueID];
				}
			} else if (this.fieldsLoaded < list_length) {
				let difference = list_length - this.fieldsLoaded;

				if (difference === this.fieldsLoaded) {
					this.seeMore[this.uniqueID] = !this.seeMore[this.uniqueID];
					this.fieldsLoaded = this.fieldsLoaded + this.initialFieldsLoaded;
				} else if (difference > this.fieldsLoaded) {
					this.fieldsLoaded = this.fieldsLoaded + this.initialFieldsLoaded;
				} else {
					this.seeMore[this.uniqueID] = !this.seeMore[this.uniqueID];
					this.fieldsLoaded = this.fieldsLoaded + difference;
				}
			}
		}

		this.changeDetector.detectChanges();
	}

	productsLoadedDynamicComponent() {
		this.isProductsLoaded = true;

		let newOptions: Options = Object.assign({}, this.options);

		newOptions.disabled = false;

		this.options = newOptions;

		this.changeDetector.detectChanges();
	}

	productsNotLoadedDynamicComponent() {
		this.isProductsLoaded = false;
		let newOptions: Options = Object.assign({}, this.options);

		newOptions.disabled = true;

		this.options = newOptions;

		this.changeDetector.detectChanges();
	}

	onUserChangeStart(changeContext: ChangeContext): void {
		this.getChangeContextString(changeContext);
		this.changeDetector.detectChanges();
	}

	onUserChange(changeContext: ChangeContext): void {
		this.getChangeContextString(changeContext);
		this.changeDetector.detectChanges();
	}

	onUserChangeEnd(changeContext: ChangeContext): void {
		this.getChangeContextString(changeContext);
		this.changeDetector.detectChanges();
	}

	getChangeContextString(changeContext: ChangeContext): void {
		if (changeContext.pointerType === PointerType.Min) {
			this.minValue = changeContext.value;
		} else {
			this.maxValue = changeContext.highValue;
		}

		this.changeDetector.detectChanges();
	}

	/**
	* Rename section name according to requirements
	*/
	renameSection(section) {
		return (section === 'Size (Ounces)') ? 'Size' : section;
	}
}

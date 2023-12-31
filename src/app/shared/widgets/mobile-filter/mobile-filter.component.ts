import {
	Component, EventEmitter, Input, AfterViewInit, Output, OnChanges,
	SimpleChanges, ChangeDetectorRef, ChangeDetectionStrategy
} from '@angular/core';

@Component({
	selector: 'mobile-filter',
	templateUrl: 'mobile-filter.component.html',
	styleUrls: ['mobile-filter.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MobileFilterComponent implements OnChanges, AfterViewInit {
	// INPUTS
	@Input('ssections') sSections: [];
	@Input('scategories') sCategories: [];
	@Input('sidebarcache') sidebarCache: {};

	// OUTPUT
	@Output() activeMobileFilters: EventEmitter<any> = new EventEmitter<any>();

	// SECTION
	currentSection: object;
	sectionDetailsDisabled: boolean;

	constructor(public changeDetector: ChangeDetectorRef) {
		this.currentSection = {};
		this.sectionDetailsDisabled = true;
	}

	ngOnChanges(changes: SimpleChanges) {
		this.changeDetector.detectChanges();
	}

	ngAfterViewInit() {
		this.changeDetector.detach();
	}

	sectionDetails(object) {
		this.currentSection = object;
		this.sectionDetailsDisabled = false;
	}

	disableSectionDetails() {
		this.sectionDetailsDisabled = true;
	}

	departmentDetails() {
		this.currentSection = {
			Name: 'Departments'
		};
		this.sectionDetailsDisabled = false;
	}

	getMobileFilterCacheData(type) {
		if (this.sidebarCache[type] !== undefined &&
			this.sidebarCache[type].length > 0) {
			return this.sidebarCache[type];
		}

		return [];
	}

	resetFilterData() {
		this.sidebarCache = {};
		this.sectionDetailsDisabled = true;
	}

	changeMobileFilterStatus(eventData: string[], filterOption: string) {
		this.sidebarCache[filterOption] = eventData;

		this.activeMobileFilters.emit(this.sidebarCache);
	}

	resetSidebarCache() {
		this.sidebarCache = {};
		this.sectionDetailsDisabled = true;
		this.changeDetector.detectChanges();
	}

}

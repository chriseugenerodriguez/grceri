import { Input, Component, OnInit, OnDestroy, OnChanges, SimpleChanges, Output, EventEmitter, ViewChild, ElementRef } from "@angular/core";
import { FormControl } from '@angular/forms';
import { BrandFilter } from '../../../../../../core/index';

import { Subscription } from 'rxjs';

@Component({
	selector: 'brand',
	templateUrl: './brand.component.html'
})

export class BrandComponent implements OnInit, OnDestroy {
	@Input() availableFilters: BrandFilter[] = [];
	@Input() activatedFilters: BrandFilter[] = [];
	@Output() activeFilters: EventEmitter<BrandFilter[]> = new EventEmitter<BrandFilter[]>();

	@ViewChild('searchTextbox') searchTextbox: ElementRef

	searchFilters: BrandFilter[] = [];
	brandSearchControl: FormControl = new FormControl('');
	hintPlaceHolder: string = '';
	private subs: Subscription[] = [];

	constructor() {
	}

	ngOnInit() {
		this.subs = [
			this.brandSearchControl.valueChanges.subscribe(res => {
				this.getSearchFilters(res);
			})
		];
		(this.searchTextbox.nativeElement as HTMLElement).focus()
	}

	get isTextActive() {
		return document.activeElement === this.searchTextbox.nativeElement;
	}

	onFocusSearchbox() {
		this.getSearchFilters(this.brandSearchControl.value);
	}

	getSearchFilters(res) {
		if (res) {
			this.searchFilters = this.availableFilters.filter(i => i.name.toLowerCase().indexOf(res.toLowerCase()) >= 0);
			if (this.searchFilters.length > 0) {
				this.hintPlaceHolder = res + this.searchFilters[0].name.substr(res.length);
			}
		} else {
			this.searchFilters = [];
		}
	}

	public filterActive(brand): boolean {
		return this.activatedFilters.findIndex(x => x === brand) >= 0;
	}

	public onFilterListItemClick(brand) {
		const f = this.activatedFilters.findIndex(i => i == brand);
		if (f < 0) {
			this.activatedFilters.push(brand);
		}
		this.activeFilters.emit(this.activatedFilters);
		this.searchFilters = [];
	}

	public changeFilterStatus(event, brand) {
		if (event.target.checked) {
			this.activatedFilters.push(brand);
		} else {
			this.activatedFilters = this.activatedFilters.filter(i => i != brand);
		}

		this.activeFilters.emit(this.activatedFilters);
	}

	ngOnDestroy() {
		this.subs.forEach(sub => sub.unsubscribe());
	}
}

import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Filter, Category } from '../../../../../core';

@Component({
	selector: 'sidebar',
	templateUrl: 'sidebar.component.html'
})
export class SidebarComponent implements OnInit {
	@Input() category: Category = null;
	@Input() availableFilters: Filter = { rating: [], category: [], brand: [], price: null };
	@Input() activatedFilters: Filter = { rating: [], category: [], brand: [], price: null };
	@Output() activeFilters: EventEmitter<Filter> = new EventEmitter<Filter>();

	public toggle = {};

	constructor() {
	}

	ngOnInit() {
	}

	public changeFilterStatus(event, filterOption) {
		this.activatedFilters[filterOption] = event;
		this.activeFilters.emit(this.activatedFilters);
	}
}

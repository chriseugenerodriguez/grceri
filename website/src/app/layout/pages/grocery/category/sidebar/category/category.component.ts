import { Input, Component, OnInit, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CategoryFilter } from '../../../../../../core/interfaces/filter.interface';
import { Subscription } from 'rxjs';

@Component({
	selector: 'category',
	templateUrl: './category.component.html',
})
export class CategoryComponent implements OnInit, OnChanges {
	@Input() availableFilters: CategoryFilter[] = [];
	@Input() activatedFilters: CategoryFilter[] = [];
	@Output() activeFilters: EventEmitter<CategoryFilter[]> = new EventEmitter<CategoryFilter[]>();

	parentCategories: CategoryFilter[] = [];
	dispCategories: CategoryFilter[] = [];
	private subs: Subscription[] = [];

	constructor() {
	}

	ngOnInit() {
	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes['availableFilters']) {
			this.dispCategories = this.availableFilters;
		}
	}

	public filterActive(category): boolean {
		return this.activatedFilters.findIndex(x => x === category) >= 0;
	}


	public changeFilterStatus(event, category) {
		if (event.target.checked) {
			this.activatedFilters = [...this.activatedFilters.filter(c => c.id !== category.id), category];
		} else {
			this.activatedFilters = this.activatedFilters.filter(i => i !== category);
		}

		this.activeFilters.emit(this.activatedFilters);
	}

	ngOnDestroy() {
		this.subs.forEach(sub => sub.unsubscribe());
	}
}

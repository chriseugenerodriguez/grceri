import { RatingFilter } from '../../../../../../core';

import { Input, Component, OnInit, Output, EventEmitter } from '@angular/core';
import * as lodash from 'lodash';

@Component({
	selector: 'rating',
	templateUrl: './rating.component.html'
})
export class RatingComponent implements OnInit {

	@Input() availableFilters: RatingFilter[] = [];
	@Input() activatedFilters: RatingFilter[] = [];
	@Output() activeFilters: EventEmitter<RatingFilter[]> = new EventEmitter<RatingFilter[]>();

	public stars = lodash.range(1, 6);

	constructor() {
	}

	ngOnInit() {
		console.log(this.availableFilters);
	}

	public filterActive(rating): boolean {
		return this.activatedFilters.findIndex(x => x === rating) >= 0;
	}

	public changeFilterStatus(event, rating: RatingFilter) {
		if (event.target.checked) {
			this.activatedFilters.push(rating);
		} else {
			this.activatedFilters = this.activatedFilters.filter(i => i.rate !== rating.rate);
		}
		this.activeFilters.emit(this.activatedFilters);
	}
}

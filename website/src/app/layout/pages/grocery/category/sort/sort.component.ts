import { ChangeDetectionStrategy, Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'sort',
	templateUrl: './sort.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SortComponent implements OnInit {

	grid: boolean;
	list: boolean;
	@Output() sortChanged = new EventEmitter<number>();

	public defaultSort: { text: string, value: number } = { text: 'Default Sorting', value: null };

	public sortList: Array<{ text: string, value: number }> = [
		{ text: 'Name: A to Z', value: 1 },
		{ text: 'Sort by Average Rating', value: 2 },
		{ text: 'Price: High to Low', value: 3 },
		{ text: 'Price: Low to High', value: 4 }
	];


	constructor() {
	}

	ngOnInit() {
		this.grid = true;
		this.list = false;
	}

	public switch(i) {
		if (i === 1) {
			this.grid = true;
			this.list = false;
		} else {
			this.list = true;
			this.grid = false;
		}
	}
}

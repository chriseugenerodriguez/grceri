import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'sort',
	templateUrl: './sort.component.html',
	styleUrls: ['sort.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SortComponent {
	// Input
	@Input() sortBy = null;

	// OUTPUT
	@Output() sortData: EventEmitter<string> = new EventEmitter<string>();

	public sortList: Array<{ text: string, value: string }> = [
		{ text: 'Relevance', value: 'productId' },
		{ text: 'Rating', value: 'rating desc' },
		{ text: 'Price: High to Low', value: 'highestVendorPrice desc' },
		{ text: 'Price: Low to High', value: 'lowestVendorPrice desc' }
	];


	constructor() {
	}

	onChange(value) {
		this.sortData.emit(value);
	}
}

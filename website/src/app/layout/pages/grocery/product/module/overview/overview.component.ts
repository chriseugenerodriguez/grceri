import { Component, Input, OnChanges } from '@angular/core';

// INTERFACE
import { Product } from '../../../../../../core';
import { ProductComponent } from '../../product.component';

@Component({
	selector: 'product-overview',
	templateUrl: 'overview.component.html',
})
export class ProductOverviewComponent implements OnChanges {
	@Input() data: Product;

	constructor(private PC: ProductComponent) {
	}

	ngOnChanges(): void {
	}

	scrollReview() {
		return this.PC.scrollReview();
	}

}

import { Component, Input } from '@angular/core';

// INTERFACE
import { Product } from '../../../../../../core';

@Component({
	selector: 'product-diet',
	templateUrl: 'diet.component.html',
})
export class ProductDietComponent {
	@Input() data: Product;

	// DIET
	dietPlus: boolean;
	dietMinus: boolean;

	constructor() {}

	diet(i) {
		if (i === 'plus') {
			this.dietPlus = true;
			this.dietMinus = false;
		} else {
			this.dietMinus = true;
			this.dietPlus = false;
		}
	}
}

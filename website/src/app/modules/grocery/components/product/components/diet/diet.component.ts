import { Component, Input } from '@angular/core';

// INTERFACE
import { IProduct } from '../../../../../../shared/interfaces';

@Component({
	selector: 'product-diet',
	templateUrl: 'diet.component.html',
})
export class ProductDietComponent {
	@Input() data: IProduct;

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

import { Component, Input } from '@angular/core';

// INTERFACE
import { Product } from '../../../../../../core';

@Component({
	selector: 'reviews-module',
	templateUrl: 'module.component.html',
})
export class ProductReviewsModuleComponent {
	@Input() data: Product;

	// IMAGES
	images: Array<Object>;

	constructor() {
	}
}

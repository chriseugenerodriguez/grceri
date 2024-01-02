import { Component, Input } from '@angular/core';

// SERVICE
import { SocialService, Product } from '../../../../../../core';

@Component({
	selector: 'product-social',
	templateUrl: 'social.component.html',
})
export class ProductSocialComponent {
	@Input() meta: Product;

	constructor(private SS: SocialService) {

	}

	social(a) {
		return this.SS.social(a, this.meta, 'product');
	}
}

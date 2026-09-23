import { Component, Input } from '@angular/core';

// SERVICE
import { SocialService, DeviceService } from '../../../../../../shared/services';

// INTERFACES
import { IProductDetails } from '../../../../../../shared/interfaces';

// ROUTER
import { Router } from '@angular/router';

// CORDOVA
declare var window: any;

@Component({
	selector: 'product-social',
	templateUrl: 'social.component.html',
	styleUrls: ['social.component.scss']
})
export class ProductSocialComponent {
	@Input() meta: IProductDetails;
	navigator = window.navigator as any;

	constructor(
		private router: Router,
		private DS: DeviceService,
		private SS: SocialService) {

	}

	social(a) {
		return this.SS.social(a, this.meta, 'product', this.router.url);
	}

	share() {
		return this.social('share');
	}
}

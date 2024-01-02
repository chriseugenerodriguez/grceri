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
		if (this.DS.isMobile) {
			window.plugins.socialsharing.shareWithOptions({
				subject: this.meta.title,
				message: this.meta.description,
				url: 'http://grceri.com' + this.router.url
			});
		} else {
			navigator.share({
				title: this.meta.title,
				text: this.meta.description,
				url: 'http://grceri.com' + this.router.url
			}).then((response) => {
				console.log(response);
			}).catch((error) => {
				console.log(error);
			});
		}
	}
}

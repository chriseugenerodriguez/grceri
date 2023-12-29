import { Input, Component, ChangeDetectionStrategy } from '@angular/core';

// ROUTER
import { Router } from '@angular/router';

// SERVICES
import { GoogleAnalyticsService } from '../../services';

// DOM
import { DomSanitizer } from '@angular/platform-browser';

@Component({
	selector: 'item',
	templateUrl: 'item.component.html',
	styleUrls: ['item.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})

export class ItemComponent {
	@Input() productID: number;
	@Input() cat: string;
	@Input() upc: number;
	@Input() name: string;
	@Input() Hprice: number;
	@Input() Lprice: number;
	@Input() images: string;
	@Input() brands: string;
	@Input() rating: number;
	@Input() ratingC: number;

	noImage: string;
	load: string;

	constructor(
		public GS: GoogleAnalyticsService,
		private _router: Router,
		public sanitizer: DomSanitizer
	) {
		this.load = require('../../../../assets/img/blank.jpg');
		this.noImage = require('../../../../assets/img/no-thumbnail.jpg');
	}

	product(i) {
		if (i) {
			return i.toString().toLowerCase().replace(/[^a-zA-Z0-9]/g, '-').replace(/-{2,}/g, '-')
		}
	}

	redirectToItemDetails($event) {
		// VARIABLE
		let url = '/grocery/' + this.product(this.name) + '/' + this.productID;
		$event.preventDefault();

		// GA
		this.GS.event('box', `${this.cat} - ${this.name} (${this.productID})`, 'click', 0);

		// NAVIGATE
		this._router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
			this._router.navigate([url])
		});
	}
}

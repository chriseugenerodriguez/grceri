import { Component, Input, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';

import { Subscription } from 'rxjs';

// SERVICES
import { DeviceService, ListsAPIService } from '../../../../../../shared/services';

// ENVIRONMENT
import { environment } from '../../../../../../../environments/environment';

@Component({
	selector: 'product-sliders',
	templateUrl: 'sliders.component.html',
	styleUrls: ['sliders.component.scss']
})
export class ProductSlidersComponent implements OnInit, OnDestroy {
	@Input() userID: number;
	@Input() productId: number;

	// ARRAYS
	productsViewed = [];
	productsWatched = [];
	sitems = Array(6).fill(1);

	// STRING
	env = environment;

	// SUBSCRIPTIONS
	subscriptions: any = new Subscription();

	constructor(
		public DS: DeviceService,
		private _changeDetector: ChangeDetectorRef,
		private LS: ListsAPIService) { }

	ngOnInit() {
		this._sliders();
	}

	ngOnDestroy() {
		this.subscriptions.unsubscribe();
	}

	private _sliders() {
		if (this.productId) {
			this.subscriptions.add(this.LS.getMostViewedProduct(this.productId).subscribe((res: any) => {
				this.productsViewed = res;
				this._changeDetector.detectChanges();
			}));

			this.subscriptions.add(this.LS.getMostWatchedProduct(this.productId).subscribe((res: any) => {
				this.productsWatched = res;
				this._changeDetector.detectChanges();
			}));
		}
	}
}

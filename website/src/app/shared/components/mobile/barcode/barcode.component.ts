import { Component, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';

// SERVICES
import { BarcodeService, HammerService } from '../../../services';

// ROUTER
import { Router } from '@angular/router';

// RXJS
import { Subscription } from 'rxjs';

@Component({
	selector: 'mobile-barcode',
	templateUrl: './barcode.component.html'
})
export class MobileBarcodeComponent implements AfterViewInit, OnDestroy {
	@ViewChild('barcode', { static: false }) barecodePopupElem: any;

	private routerChangeSubscription: Subscription;

	constructor(
		private hammerService: HammerService,
		public BS: BarcodeService,
		public router: Router) {
		this.checkRouterChanges();
	}

	ngAfterViewInit() {
		this._hammerInteractions();

		this.BS.barcodePopup = this.barecodePopupElem;
	}

	ngOnDestroy() {
		if (this.routerChangeSubscription) {
			this.routerChangeSubscription.unsubscribe();
		}
	}

	checkRouterChanges() {
		this.routerChangeSubscription = this.router.events.subscribe((val) => {
			this.BS.closeScanner();
		});
	}

	private _hammerInteractions() {
		const el = this.barecodePopupElem.nativeElement;
		if (el) {
			this.hammerService.SwipeLeftDownClose(el).subscribe((data) => {
				if (data.swipe === 'down') {
					this.BS.closeScanner();
				}
				if (data.swipe === 'left') {
					this.BS.closeScanner();
					history.pushState(null, null, location.href);
				}
			});
		}
	}
}

import {
	Component, OnInit, AfterViewInit, OnDestroy, Input, Output, EventEmitter,
	ChangeDetectionStrategy, ChangeDetectorRef
} from '@angular/core';

// SERVICES
import { GoogleAnalyticsService, ProductAPIService } from '../../../../../../shared/services';

// INTERFACES
import { IProductVendors } from '../../../../../../shared/interfaces/product/product-vendors.interface';

// RXJS
import { Subject, Subscription } from 'rxjs';

// ENV
import { environment } from '../../../../../../../environments/environment';

@Component({
	selector: 'product-vendors',
	templateUrl: 'vendors.component.html',
	styleUrls: ['vendors.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductVendorsComponent implements OnInit, AfterViewInit, OnDestroy {
	// INPUT
	@Input() productID: number;

	// OUTPUT
	@Output() getProductVendorsOutput: EventEmitter<any> = new EventEmitter<any>();

	// BOOLEAN
	moreVendor = false;

	// SUBJECTS
	private productVendors$ = new Subject<IProductVendors>();

	// SUBSCRIPTIONS
	productVendorsSubscription: Subscription;

	vendors: IProductVendors;

	constructor(
		public GS: GoogleAnalyticsService,
		private changeDetector: ChangeDetectorRef,
		private productAPI: ProductAPIService) {
	}

	ngOnInit() {
		this.processProductVendorsSubscription();
	}

	ngAfterViewInit() {
		this.changeDetector.detach();
	}

	ngOnDestroy() {
		if (this.productVendorsSubscription) {
			this.productVendorsSubscription.unsubscribe();
		}
	}

	gEvent(is: any) {
		this.GS.event('button', `Vendor Offer - ${is.vendor} (${is.websiteName})`, 'click', 0);
	}

	private processProductVendorsSubscription() {
		this.productAPI.getProductVendors(this.productID).subscribe((res) => {
			this.productVendors$.next(res);
		});

		this.renderProductVendorsSubscriptionDataToComponent();
	}

	/**
	* Get product vendors subscription data and render to component
	*/
	private renderProductVendorsSubscriptionDataToComponent() {
		this.productVendorsSubscription = this.productVendors$.subscribe(res => {
			this.vendors = res;

			this.getProductVendorsOutput.emit(this.vendors);

			this.changeDetector.detectChanges();
		});
	}

	private checkVendorFreeShipping(shippingCost: any) {
		if (!shippingCost || isNaN(shippingCost)) {
			return true;
		} else {
			return false;
		}
	}
}

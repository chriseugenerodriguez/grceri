import { Component, Input, Output, EventEmitter, OnInit, AfterViewInit, OnDestroy,
	ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

// COMPONENT
import { ProductComponent } from '../../product.component';

// SERVICES
import { ProductAPIService } from '../../../../../../shared/services/api/api.service';

// INTERFACES
import { IProductOverview } from '../../../../../../shared/interfaces/product/product-overview.interface';

// rxjs
import { Subject, Subscription } from 'rxjs';

// ENV
import { environment } from '../../../../../../../environments/environment';

@Component({
	selector: 'product-overview',
	templateUrl: 'overview.component.html',
	styleUrls: ['overview.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductOverviewComponent implements OnInit, AfterViewInit, OnDestroy {
	@Input() productID: number;

	// OUTPUT
	@Output() getOverview: EventEmitter<any> = new EventEmitter<any>();

	private productOverview$ = new Subject<IProductOverview>();

	productOverviewSubscription: Subscription;

	data: IProductOverview;

	constructor(private PC: ProductComponent, private changeDetector: ChangeDetectorRef, private productAPI: ProductAPIService) {
	}

	ngOnInit(): void {
		this.processProductOverviewSubscription();
	}

	ngAfterViewInit(){
		this.changeDetector.detach();
	}

	ngOnDestroy(): void {
		if (this.productOverviewSubscription) {
			this.productOverviewSubscription.unsubscribe();
		}
	}

	/**
	* Process product carousel data from API
	*/
	private processProductOverviewSubscription() {
		this.productAPI.getProductOverview(this.productID).subscribe((res) => {
			this.productOverview$.next(res);
		});

		this.renderProductOverviewSubscriptionDataToComponent();
	}

	/**
	* Get product overview subscription data and render to component
	*/
	private renderProductOverviewSubscriptionDataToComponent() {
		this.productOverviewSubscription = this.productOverview$.subscribe(res => {
			this.data = res;

			this.emitOutputDataToParentComponent();

			this.changeDetector.detectChanges();
		});
	}

	/**
	* When subscription is done output data to parent component
	*/
	private emitOutputDataToParentComponent() {
		let outputData = {
			brand: this.data.brand,
			description: this.data.description
		}

		this.getOverview.emit(this.data);
	}

	scrollReview() {
		return this.PC.scrollReview();
	}

	urlPart(i) {
		if (i) {
			return i.toString().toLowerCase().replace(/[^a-zA-Z0-9]/g, '-').replace(/-{2,}/g, '-')
		}
	}

}

import { Component, Input, OnInit, OnDestroy, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

// RXJS
import { Subscription, Subject } from 'rxjs';

// SERVICES
import { ProductAPIService } from '../../../../../../shared/services';


@Component({
	selector: 'product-history',
	templateUrl: 'history.component.html',
	styleUrls: ['history.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductHistoryComponent implements OnInit, OnDestroy, AfterViewInit {
	// INPUT
	@Input() productId: number;

	// NUMBER
	lowestPrice: number;
	highestPrice: number;
	averagePrice: number;
	priceVolatility: number;
	timeFrame = 365;

	// SUBSCRIPTION
	productHistorySubscription: Subscription;

	// SUBJECT
	productHistory$ = new Subject();

	// ARRAY
	lineChartLabels: Array<any>;
	lineChartOptions: any;
	lineChartColors: Array<any>;

	// OBJECT
	history: Object;
	lineChartData: Object;

	constructor(
		private changeDetector: ChangeDetectorRef,
		private productAPI: ProductAPIService
	) {
		// this.lineChartLabels = [];

		// this.lineChartOptions = {
		// 	responsive: true,
		// 	elements: {
		// 		point: {
		// 			radius: 0,
		// 		},
		// 	},
		// 	tooltips: {
		// 		enabled: false,
		// 	},
		// 	scales: {
		// 		xAxes: [
		// 			{
		// 				display: false,
		// 			},
		// 		],
		// 		yAxes: [
		// 			{
		// 				display: false,
		// 			},
		// 		],
		// 	},
		// };

		// this.lineChartColors = [
		// 	{
		// 		// grey
		// 		backgroundColor: 'rgba(204,236,214,.5)',
		// 		borderColor: 'rgba(72,182,106.5)',
		// 	},
		// ];
	}

	ngOnInit() {
		this.processProductHistorySubscription();
	}

	ngAfterViewInit() {
		this.changeDetector.detach();
	}

	ngOnDestroy() {
		if (this.productHistorySubscription) {
			this.productHistorySubscription.unsubscribe();
		}
	}

	onPriceHistoryChange(time: number) {
		this.timeFrame = time;

		this.processProductHistorySubscription();
	}

	private processProductHistorySubscription() {
		this.productAPI.getProductHistory(this.productId, this.timeFrame).subscribe((res) => {
			this.productHistory$.next(res);
		});

		this.renderProductHistorySubscriptionDataToComponent();
	}

	/**
	* Get product history subscription data and render to component
	*/
	private renderProductHistorySubscriptionDataToComponent() {
		this.productHistorySubscription = this.productHistory$.subscribe(res => {
			this.history = res;

			// CHART
			this.lineChartData = res['result'];
			this.lineChartLabels = res['dates'];

			// CALCULATE INSIGHTS
			this.highestPrice = res['highestPrice'];
			this.lowestPrice = res['lowestPrice'];
			this.averagePrice = res['averagePrice'];
			this.priceVolatility = (this.highestPrice - this.lowestPrice) * 10;

			this.changeDetector.detectChanges();
		});
	}
}

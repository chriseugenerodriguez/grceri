import { Component, Input, OnInit, OnDestroy, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

// SERVICES
import { ProductAPIService } from '../../../../../../shared/services/api/api.service';

// INTERFACES
import { IProductNutrition } from '../../../../../../shared/interfaces/product/product-nutrition.interface';

// rxjs
import { Subject, Subscription } from 'rxjs';

// ENV
import { environment } from '../../../../../../../environments/environment';

@Component({
	selector: 'product-nutrition',
	templateUrl: 'nutrition.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductNutritionComponent implements OnInit, AfterViewInit, OnDestroy {
	@Input() productID: number;

	private productNutrition$ = new Subject<IProductNutrition>();

	// SUBSCRIPTIONS
	productNutritionSubscription: Subscription;

	// nutrition
	public nutrition: any;
	public fat: number;
	public saturated: number;
	public cholesterol: number;
	public sodium: number;
	public carbs: number;
	public sugars: number;
	public fiber: number;
	public cal_fat: number;

	data: IProductNutrition;


	constructor(private productAPI: ProductAPIService, private changeDetector: ChangeDetectorRef) {

		// this.api.nutritionix('search/item?upc=' + this.data.upc).subscribe(res => {
		// 	this.nutrition = res['foods'][0];

		// 	this.fat = (this.nutrition.nf_total_fat / 65) * 100;
		// 	this.saturated = (this.nutrition.nf_saturated_fat / 20) * 100;
		// 	this.cholesterol = (this.nutrition.nf_cholesterol / 300) * 100;
		// 	this.sodium = (this.nutrition.nf_sodium / 2400) * 100;
		// 	this.carbs = (this.nutrition.nf_total_carbohydrate / 300) * 100;
		// 	this.fiber = (this.nutrition.nf_dietary_fiber / 25) * 100;
		// });
	}

	ngOnInit(): void {
		this.processProductNutritionSubscription();
	}

	ngAfterViewInit(){
		this.changeDetector.detach();
	}

	ngOnDestroy(): void {
		if (this.productNutritionSubscription) {
			this.productNutritionSubscription.unsubscribe();
		}
	}

	/**
	* Process product carousel data from API
	*/
	private processProductNutritionSubscription() {
		this.productAPI.getProductNutrition(this.productID).subscribe((res) => {
			this.productNutrition$.next(res);
		});

		this.renderProductNutritionSubscriptionDataToComponent();
	}

	/**
	* Get product nutrition subscription data and render to component
	*/
	private renderProductNutritionSubscriptionDataToComponent() {
		this.productNutritionSubscription = this.productNutrition$.subscribe(res => {
			this.data = res;

			this.changeDetector.detectChanges();
		});
	}
}

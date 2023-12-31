import { Component, Input } from '@angular/core';

// INTERFACE
import { Product } from '../../../../../../core';

@Component({
	selector: 'product-nutrition',
	templateUrl: 'nutrition.component.html',
})
export class ProductNutritionComponent {
	@Input() data: Product;

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


	constructor() {

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
}

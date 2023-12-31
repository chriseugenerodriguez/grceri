import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';

// FORMS
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// KENDO
import { DialogModule } from '@progress/kendo-angular-dialog';
import { DropDownListModule } from '@progress/kendo-angular-dropdowns';

// CHILDREN
import { ProductFeedbackComponent } from './feedback/feedback.component';
import { ProductAddedComponent } from './added/added.component';
import { ProductCompareComponent } from './compare/compare.component';
import { ProductComparePageComponent } from './compare/page/page.component';
import { ProductCarouselComponent } from './carousel/carousel.component';
import { ProductReviewsModuleComponent } from './reviews/module.component';
import { ProductReviewsModuleImagesComponent } from './reviews/module/images/images.component';
import { ProductReviewsModuleReviewComponent } from './reviews/module/review/review.component';
import { ProductReviewsFormComponent } from './reviews/form/form.component';
import { ProductReviewsComponent } from './reviews/reviews/reviews.component';
import { ProductReviewsSingleComponent } from './reviews/single/single.component';
import { ProductSocialComponent } from './social/social.component';
import { ProductNutritionComponent } from './nutrition/nutrition.component';
import { ProductOverviewComponent } from './overview/overview.component';
import { ProductDietComponent } from './diet/diet.component';
import { ProductSellersComponent } from './sellers/sellers.component';
import { ProductSellersPageComponent } from './sellers/page/page.component';

// MODULES
import { ItemModule } from '../../category/item/item.module';

// PROVIDERS
import { Modules, SocialService } from '../../../../../core';
import { ItemComponent } from '../../category/item/item.component';


// IMPORT MODULES, DECLARE COMPONENTS
@NgModule({
	imports: [
		CommonModule,
		BrowserModule,
		RouterModule,
		DialogModule,
		DropDownListModule,
		FormsModule,
		ReactiveFormsModule,

		// MODULES
		Modules,
		ItemModule,
	],
	declarations: [
		ProductFeedbackComponent,
		ProductAddedComponent,
		ProductCompareComponent,
		ProductComparePageComponent,
		ProductCarouselComponent,
		ProductSocialComponent,
		ProductReviewsModuleComponent,
		ProductReviewsModuleImagesComponent,
		ProductReviewsModuleReviewComponent,
		ProductReviewsFormComponent,
		ProductReviewsComponent,
		ProductReviewsSingleComponent,
		ProductNutritionComponent,
		ProductOverviewComponent,
		ProductDietComponent,
		ProductSellersComponent,
		ProductSellersPageComponent

	],
	exports: [
		ProductFeedbackComponent,
		ProductAddedComponent,
		ProductCompareComponent,
		ProductComparePageComponent,
		ProductCarouselComponent,
		ProductSocialComponent,
		ProductReviewsModuleComponent,
		ProductReviewsModuleImagesComponent,
		ProductReviewsModuleReviewComponent,
		ProductReviewsFormComponent,
		ProductReviewsComponent,
		ProductReviewsSingleComponent,
		ProductNutritionComponent,
		ProductOverviewComponent,
		ProductDietComponent,
		ProductSellersComponent,
		ProductSellersPageComponent
	],
	providers: [
		ItemComponent,
		SocialService
	]
})
export class ProductModuleModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// FORMS
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// CHILDREN
import { ProductDetailsComponent } from './details/details.component';
import { ProductFeedbackComponent } from './feedback/feedback.component';
import { ProductCompareComponent } from './compare/compare.component';
import { ProductComparePageComponent } from './compare/page/page.component';
import { ProductCarouselComponent } from './carousel/carousel.component';
import { ProductSocialComponent } from './social/social.component';
import { ProductNutritionComponent } from './nutrition/nutrition.component';
import { ProductVendorsComponent } from './vendors/vendors.component';
import { ProductOverviewComponent } from './overview/overview.component';
import { ProductDietComponent } from './diet/diet.component';
import { ProductSlidersComponent } from './sliders/sliders.component';
import { ProductHistoryComponent } from './history/history.component';

// MODULES
import { ItemComponent } from '../../../../../shared/components/item/item.component';
import { Modules } from '../../../../../shared/widgets/widgets.module';
import { ItemModule } from '../../../../../shared/components/item/item.module';
import { ListsCreateModule } from './../../../../../shared/components/modal/create/create.module';

// PROVIDERS
import { SocialService } from '../../../../../shared/services';

// BOOTSTRAP
import { ModalModule } from 'ngx-bootstrap/modal';
import { AlertModule } from 'ngx-bootstrap/alert';

// LAZY
import { LazyLoadImageModule } from 'ng-lazyload-image';

// IMPORT MODULES, DECLARE COMPONENTS
@NgModule({
	imports: [
		CommonModule,
		RouterModule,
		FormsModule,
		ReactiveFormsModule,
		AlertModule.forRoot(),
		LazyLoadImageModule,

		// MODULES
		Modules,
		ItemModule,
		ListsCreateModule,
		ModalModule.forRoot(),
	],
	declarations: [
		ProductDetailsComponent,
		ProductFeedbackComponent,
		ProductCompareComponent,
		ProductComparePageComponent,
		ProductCarouselComponent,
		ProductSocialComponent,
		ProductNutritionComponent,
		ProductVendorsComponent,
		ProductOverviewComponent,
		ProductDietComponent,
		ProductSlidersComponent,
		ProductHistoryComponent
	],
	exports: [
		ProductDetailsComponent,
		ProductFeedbackComponent,
		ProductCompareComponent,
		ProductComparePageComponent,
		ProductCarouselComponent,
		ProductSocialComponent,
		ProductNutritionComponent,
		ProductVendorsComponent,
		ProductOverviewComponent,
		ProductDietComponent,
		ProductSlidersComponent,
		ProductHistoryComponent
	],
	providers: [
		ItemComponent,
		SocialService
	],
	entryComponents: [
		ProductDetailsComponent,
		ProductFeedbackComponent,
		ProductCompareComponent,
		ProductComparePageComponent,
		ProductCarouselComponent,
		ProductSocialComponent,
		ProductNutritionComponent,
		ProductVendorsComponent,
		ProductOverviewComponent,
		ProductDietComponent,
		ProductSlidersComponent,
		ProductHistoryComponent
	]
})
export class ProductModuleModule { }

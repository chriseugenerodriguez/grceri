import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// RELATED
import { SidebarComponent } from './sidebar.component';

// CHILDREN
import { BrandComponent } from './brand/brand.component';
import { CategoryComponent } from './category/category.component';
import { PriceComponent } from './price/price.component';
import { RatingComponent } from './rating/rating.component';

// IMPORT MODULES, DECLARE COMPONENTS
@NgModule({
	imports: [
		CommonModule,
		RouterModule,
		FormsModule,
		ReactiveFormsModule
	],
	declarations: [
		SidebarComponent,
		BrandComponent,
		CategoryComponent,
		PriceComponent,
		RatingComponent
	],
	exports: [
		SidebarComponent,
		BrandComponent,
		CategoryComponent,
		PriceComponent,
		RatingComponent
	]
})
export class SidebarModule { }

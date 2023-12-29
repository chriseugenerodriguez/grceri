import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// ROUTER
import { RouterModule, Routes } from '@angular/router';

// RELATED
import { GroceryComponent } from './grocery.component';

// FORMS
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// RELATED
import { CategoryModule } from './components/category/category.module';
import { ProductModule } from './components/product/product.module';

// LOADING
import { LazyLoadImageModule } from 'ng-lazyload-image';

// ROUTES
export const ROUTES: Routes = [
	{ path: '', component: GroceryComponent }
];

// IMPORT MODULES, DECLARE COMPONENTS
@NgModule({
	imports: [
		RouterModule.forChild(ROUTES),
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		LazyLoadImageModule,

		// CHILDREN
		CategoryModule,
		ProductModule
	],
	declarations: [
		GroceryComponent
	],
	exports: [
		GroceryComponent
	],
	entryComponents: [
		GroceryComponent
	]
})
export class GroceryModule { }

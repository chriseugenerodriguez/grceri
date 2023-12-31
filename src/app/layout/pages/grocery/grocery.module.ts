import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// RELATED
import { GroceryComponent } from './grocery.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderModule } from '../../shared';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';

// IMPORT MODULES, DECLARE COMPONENTS
@NgModule({
	imports: [
		CommonModule,
		RouterModule,
		FormsModule,
		ReactiveFormsModule,
		HeaderModule,

		// CHILDREN
		CategoryModule,
		ProductModule
	],
	declarations: [
		GroceryComponent
	],
	exports: [
		GroceryComponent,

		// CHILDREN
		CategoryModule,
		ProductModule
	]
})
export class GroceryModule { }

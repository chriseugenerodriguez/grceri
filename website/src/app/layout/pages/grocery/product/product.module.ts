import { NgModule, Directive } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';

// RELATED
import { ProductComponent } from './product.component';

// MODULES
import { Modules } from '../../../../core';
import { ProductModuleModule } from './module/module.module';

// CHILD
import { ItemModule } from '../category/item/item.module';
import { ItemComponent } from '../category/item/item.component';

// KENDO
import { DropDownListModule } from '@progress/kendo-angular-dropdowns';

// IMPORT MODULES, DECLARE COMPONENTS
@NgModule({
	imports: [
		CommonModule,
		BrowserModule,
		RouterModule,
		BrowserAnimationsModule,
		DropDownListModule,
		ReactiveFormsModule,

		Modules,
		ItemModule,
		ProductModuleModule
	],
	declarations: [
		ProductComponent
	],
	exports: [
		ProductComponent
	],
	providers: [
		ItemComponent
	]
})
export class ProductModule { }

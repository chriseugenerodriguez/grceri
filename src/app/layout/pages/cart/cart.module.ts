import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

// RELATED
import { CartComponent } from './cart.component';

// KENDO
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';

// SLIDER
import { ItemComponent } from '../grocery/category/item/item.component';
import { Modules } from '../../../core';
import { ItemModule } from '../grocery/category/item/item.module';

// IMPORT MODULES, DECLARE COMPONENTS
@NgModule({
	imports: [
		CommonModule,
		RouterModule,
		FormsModule,
		DropDownsModule,

		Modules,
		ItemModule
	],
	declarations: [
		CartComponent,
	],
	exports: [
		CartComponent,
	],
	providers: [
		ItemComponent
	]
})
export class CartModule { }

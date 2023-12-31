import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// RELATED
import { PricingFreeComponent } from './free.component';

// IMPORT MODULES, DECLARE COMPONENTS
@NgModule({
	imports: [
		CommonModule,
		RouterModule
	],
	declarations: [
		PricingFreeComponent

	],
	exports: [
		PricingFreeComponent
	]
})
export class PricingFreeModule { }

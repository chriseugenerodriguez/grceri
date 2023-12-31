import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

// RELATED
import { PricingComponent } from './pricing.component';

// FORMS
import { FormsModule } from '@angular/forms';

// IMPORT MODULES, DECLARE COMPONENTS
@NgModule({
	imports: [
		RouterModule,
		CommonModule,
		FormsModule
	],
	declarations: [
		PricingComponent
	],
	exports: [
		PricingComponent
	],
	entryComponents: [
		PricingComponent
	]
})
export class PricingModule { }

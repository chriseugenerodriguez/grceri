import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// RELATED
import { PricingBasicComponent } from './basic.component';

// IMPORT MODULES, DECLARE COMPONENTS
@NgModule({
	imports: [
		CommonModule,
		RouterModule
	],
	declarations: [
		PricingBasicComponent

	],
	exports: [
		PricingBasicComponent
	]
})
export class PricingBasicModule { }

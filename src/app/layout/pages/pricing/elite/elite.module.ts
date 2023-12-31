import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// RELATED
import { PricingEliteComponent } from './elite.component';

// IMPORT MODULES, DECLARE COMPONENTS
@NgModule({
	imports: [
		CommonModule,
		RouterModule
	],
	declarations: [
		PricingEliteComponent

	],
	exports: [
		PricingEliteComponent
	]
})
export class PricingEliteModule { }

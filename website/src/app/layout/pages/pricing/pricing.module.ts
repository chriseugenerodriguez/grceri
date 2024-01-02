import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// RELATED
import { PricingComponent } from './pricing.component';

import { PricingBasicModule } from './basic/basic.module';
import { PricingFreeModule } from './free/free.module';
import { PricingEliteModule } from './elite/elite.module';


// KENDO
import { InputsModule } from '@progress/kendo-angular-inputs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

// IMPORT MODULES, DECLARE COMPONENTS
@NgModule({
	imports: [
		CommonModule,
		RouterModule,
		PricingFreeModule,
		PricingBasicModule,
		PricingEliteModule,

		FormsModule,
		BrowserModule,
		BrowserAnimationsModule,
		InputsModule
	],
	declarations: [
		PricingComponent

	],
	exports: [
		PricingComponent
	]
})
export class PricingModule { }

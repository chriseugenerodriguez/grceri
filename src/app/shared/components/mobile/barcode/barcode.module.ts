import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// RELATED
import { FormsModule } from '@angular/forms';
import { MobileBarcodeComponent } from './barcode.component';

// IMPORT MODULES, DECLARE COMPONENTS
@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		RouterModule
	],
	declarations: [
		MobileBarcodeComponent
	],
	exports: [
		MobileBarcodeComponent
	]
})
export class MobileBarcodeModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// RELATED
import { PoliciesPageComponent } from './page.component';

// IMPORT MODULES, DECLARE COMPONENTS
@NgModule({
	imports: [
		CommonModule
	],
	declarations: [
		PoliciesPageComponent
	],
	exports: [
		PoliciesPageComponent
	],
	entryComponents: [
		PoliciesPageComponent
	]
})
export class PoliciesPageModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// RELATED
import { ReportsComponent } from './reports.component';

// IMPORT MODULES, DECLARE COMPONENTS
@NgModule({
	imports: [
		CommonModule,
		FormsModule
	],
	declarations: [
		ReportsComponent
	],
	exports: [
		ReportsComponent
	]
})
export class ReportsModule { }

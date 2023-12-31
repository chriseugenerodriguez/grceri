import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// SLIDER
import { Ng5SliderModule } from 'ng5-slider';

// FORMGROUP
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// RELATED
import { SortComponent } from './sort.component';

// IMPORT MODULES, DECLARE COMPONENTS
@NgModule({
	imports: [
		CommonModule,
		RouterModule,
		FormsModule,
		ReactiveFormsModule,
		Ng5SliderModule
	],
	declarations: [
		SortComponent
	],
	exports: [
		SortComponent
	],
	entryComponents: [
		SortComponent
	]
})
export class SortModule { }

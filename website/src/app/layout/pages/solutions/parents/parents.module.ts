import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// RELATED
import { SolutionsParentsComponent } from './parents.component';

// MODULES
import { Modules } from '../../../../core';

// IMPORT MODULES, DECLARE COMPONENTS
@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		RouterModule,
		ReactiveFormsModule,

		Modules
	],
	declarations: [
		SolutionsParentsComponent

	],
	exports: [
		SolutionsParentsComponent
	]
})
export class SolutionsParentsModule { }

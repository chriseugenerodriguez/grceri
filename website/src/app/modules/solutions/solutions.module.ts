import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SolutionsComponent } from './solutions.component';

// CHILDREN
import { SolutionsStudentsComponent } from './components/students/students.component';
import { SolutionsParentsComponent } from './components/parents/parents.component';
import { SolutionsHostsComponent } from './components/hosts/hosts.component';
import { SolutionsCooksComponent } from './components/cooks/cooks.component';

// WIDGETS
import { FormSolutionsComponent } from './widgets/form/form.component';

// IMPORT MODULES, DECLARE COMPONENTS
@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		RouterModule,
		ReactiveFormsModule
	],
	declarations: [
		SolutionsComponent,
		SolutionsStudentsComponent,
		SolutionsParentsComponent,
		SolutionsHostsComponent,
		SolutionsCooksComponent,
		FormSolutionsComponent
	],
	exports: [
		SolutionsComponent,
		SolutionsStudentsComponent,
		SolutionsParentsComponent,
		SolutionsHostsComponent,
		SolutionsCooksComponent,
		FormSolutionsComponent
	],
	entryComponents: [
		SolutionsComponent
	]
})
export class SolutionsModule { }

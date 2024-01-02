import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SolutionsComponent } from './solutions.component';

// CHILDREN
import { SolutionsStudentsModule } from './students/students.module';
import { SolutionsParentsModule } from './parents/parents.module';
import { SolutionsHostsModule } from './hosts/hosts.module';
import { SolutionsCooksModule } from './cooks/cooks.module';

// IMPORT MODULES, DECLARE COMPONENTS
@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		RouterModule,
		ReactiveFormsModule,

		// CHILDREN
		SolutionsStudentsModule,
		SolutionsParentsModule,
		SolutionsHostsModule,
		SolutionsCooksModule
	],
	declarations: [
		SolutionsComponent

	],
	exports: [
		SolutionsComponent
	]
})
export class SolutionsModule { }

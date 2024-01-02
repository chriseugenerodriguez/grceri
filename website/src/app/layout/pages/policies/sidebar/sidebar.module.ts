import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// RELATED
import { PoliciesSidebarComponent } from './sidebar.component';
import { RouterModule } from '@angular/router';

// IMPORT MODULES, DECLARE COMPONENTS
@NgModule({
	imports: [
    CommonModule,
    RouterModule
	],
	declarations: [
		PoliciesSidebarComponent

	],
	exports: [
		PoliciesSidebarComponent
	]
})
export class PoliciesSidebarModule { }

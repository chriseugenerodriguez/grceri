import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// RELATED
import { PoliciesSidebarComponent } from './sidebar.component';
import { PoliciesPageComponent } from '../page/page.component';

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
	],
	entryComponents: [
		PoliciesSidebarComponent
	]
})
export class PoliciesSidebarModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// ROUTER
import { RouterModule, Routes } from '@angular/router';

// ROUTES
import { DashboardComponent } from './dashboard.component';

export const ROUTES: Routes = [
	{
		path: '', component: DashboardComponent
	}
]

// IMPORT MODULES, DECLARE COMPONENTS
@NgModule({
	imports: [
		RouterModule.forChild(ROUTES),
		CommonModule
	],
	declarations: [
		DashboardComponent
	],
	exports: [
		DashboardComponent
	],
	entryComponents: [
		DashboardComponent
	]
})
export class DashboardModule { }

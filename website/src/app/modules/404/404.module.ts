import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// ROUTER
import { Routes, RouterModule } from '@angular/router';

// RELATED
import { NotFoundComponent } from './404.component';

// ROUTES
export const ROUTES: Routes = [
	{ path: '', component: NotFoundComponent }
];

// IMPORT MODULES, DECLARE COMPONENTS
@NgModule({
	imports: [
		RouterModule.forChild(ROUTES),
		CommonModule
	],
	declarations: [
		NotFoundComponent
	],
	exports: [
		NotFoundComponent
	]
})
export class NotFoundModule { }

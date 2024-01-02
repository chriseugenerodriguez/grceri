import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

// RELATED
import { HomeComponent } from './home.component';

// SLIDER
import { Modules } from '../../shared/widgets/widgets.module';
import { ItemModule } from '../../shared/components/item/item.module';

// LOADING
import { LazyLoadImageModule } from 'ng-lazyload-image';

// ROUTES
export const ROUTES: Routes = [
	{ path: '', component: HomeComponent, pathMatch: 'full' }
];

// IMPORT MODULES, DECLARE COMPONENTS
@NgModule({
	imports: [
		CommonModule,
		RouterModule.forChild(ROUTES),
		LazyLoadImageModule,
		FormsModule,
		Modules,
		ItemModule
	],
	declarations: [
		HomeComponent
	],
	exports: [
		HomeComponent
	],
	entryComponents: [
		HomeComponent
	]
})
export class HomeModule { }

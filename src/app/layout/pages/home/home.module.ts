import { NgModule, Injectable, APP_INITIALIZER } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

// RELATED
import { HomeComponent } from './home.component';
import { HeaderModule } from '../../shared';

import { HttpClientModule } from '@angular/common/http';

// SLIDER
import { Modules } from '../../../core';
import { ItemModule } from '../grocery/category/item/item.module';
import { ItemComponent } from '../grocery/category/item/item.component';


// IMPORT MODULES, DECLARE COMPONENTS
@NgModule({
	imports: [
		CommonModule,
		RouterModule,
		HeaderModule,
		FormsModule,
		HttpClientModule,

		Modules,
		ItemModule
	],
	declarations: [
		HomeComponent,

	],
	exports: [
		HomeComponent,
	],
	providers: [
		ItemComponent
	]
})
export class HomeModule { }

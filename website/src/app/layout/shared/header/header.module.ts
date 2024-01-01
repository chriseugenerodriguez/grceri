import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// RELATED
import { HeaderComponent } from './header.component';

import { Modules, WINDOW_PROVIDERS } from '../../../core';
import { ShoppingCartComponent } from './cart/cart.component';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

// IMPORT MODULES, DECLARE COMPONENTS
@NgModule({
	imports: [
		CommonModule,
		RouterModule,
		Modules,
		BsDropdownModule.forRoot()
	],
	declarations: [
		HeaderComponent,
		ShoppingCartComponent

	],
	exports: [
		HeaderComponent,
		ShoppingCartComponent
	],
	providers: [
		WINDOW_PROVIDERS
	]
})
export class HeaderModule { }

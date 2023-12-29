import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// ROUTER
import { RouterModule, Routes } from '@angular/router';

// RELATED
import { FavoritesComponent } from './favorites.component';

// BOOTSTRAP
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

// ITEM
import { ItemModule } from '../../../../shared/components/item/item.module';

// ROUTES
export const ROUTES: Routes = [
	{ path: '', component: FavoritesComponent }
]

// IMPORT MODULES, DECLARE COMPONENTS
@NgModule({
	imports: [
		RouterModule.forChild(ROUTES),
		BsDropdownModule,
		CommonModule,
		ItemModule
	],
	declarations: [
		FavoritesComponent
	],
	exports: [
		FavoritesComponent
	],
	entryComponents: [
		FavoritesComponent
	]
})
export class FavoritesModule { }

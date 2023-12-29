import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// RELATED
import { FavoritesComponent } from './favorites.component';


// IMPORT MODULES, DECLARE COMPONENTS
@NgModule({
	imports: [
		CommonModule,
    RouterModule
	],
	declarations: [
    FavoritesComponent
	],
	exports: [
    FavoritesComponent
	]
})
export class FavoritesModule { }

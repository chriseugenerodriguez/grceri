import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// RELATED
import { FormsModule } from '@angular/forms';
import { ItemComponent } from './item.component';

// LOADING
import { LazyLoadImageModule } from 'ng-lazyload-image';

// IMPORT MODULES, DECLARE COMPONENTS
@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		RouterModule,
		LazyLoadImageModule
	],
	declarations: [
		ItemComponent
	],
	exports: [
		ItemComponent
	],
	entryComponents: [
		ItemComponent
	]
})
export class ItemModule { }

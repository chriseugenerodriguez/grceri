import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// RELATED
import { FormsModule } from '@angular/forms';
import { ItemComponent } from './item.component';

// IMPORT MODULES, DECLARE COMPONENTS
@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		RouterModule,
	],
	declarations: [
		ItemComponent,
	],
	exports: [
		ItemComponent,
	]
})
export class ItemModule { }

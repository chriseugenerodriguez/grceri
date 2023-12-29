import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// RELATED
import { ListsComponent } from './lists.component';

import { ListsCreateModule } from './create/create.module';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';

// IMPORT MODULES, DECLARE COMPONENTS
@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ListsCreateModule,
		DropDownsModule
	],
	declarations: [
		ListsComponent
	],
	exports: [
		ListsComponent
	]
})
export class ListsModule { }

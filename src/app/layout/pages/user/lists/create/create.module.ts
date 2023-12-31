import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// RELATED
import { ListsCreateComponent } from './create.component';

// KENDO
import { DialogModule } from '@progress/kendo-angular-dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';


// IMPORT MODULES, DECLARE COMPONENTS
@NgModule({
	imports: [
		CommonModule,
		FormsModule,

		DialogModule,
		BrowserAnimationsModule,
		DropDownsModule
	],
	declarations: [
		ListsCreateComponent
	],
	exports: [
		ListsCreateComponent
	]
})
export class ListsCreateModule { }

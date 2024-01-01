import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// RELATED
import { ListHistoryComponent } from './lists.component';


// IMPORT MODULES, DECLARE COMPONENTS
@NgModule({
	imports: [
		CommonModule,
    RouterModule
	],
	declarations: [
		ListHistoryComponent
	],
	exports: [
		ListHistoryComponent
	]
})
export class ListHistoryModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// RELATED
import { HistoryComponent } from './history.component';
import { RecentlyViewedModule } from './recent/recent.module';
import { ListHistoryModule } from './lists/lists.module';


// IMPORT MODULES, DECLARE COMPONENTS
@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		RecentlyViewedModule,
		ListHistoryModule
	],
	declarations: [
		HistoryComponent
	],
	exports: [
		HistoryComponent
	]
})
export class HistoryModule { }

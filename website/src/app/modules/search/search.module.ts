import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

// RELATED
import { SearchComponent } from './search.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SidebarModule } from '../../shared/widgets/sidebar/sidebar.module';
import { SortModule } from '../../shared/widgets/sort/sort.module';

// CHILD
import { ItemModule } from '../../shared/components/item/item.module';

// MODULES
import { Modules } from '../../shared/widgets/widgets.module';
import { NgxPaginationModule } from 'ngx-pagination';

// ROUTER
export const ROUTES: Routes = [
	{ path: '', component: SearchComponent }
];

// IMPORT MODULES, DECLARE COMPONENTS
@NgModule({
	imports: [
		CommonModule,
		RouterModule.forChild(ROUTES),
		FormsModule,
		ReactiveFormsModule,
		SidebarModule,
		SortModule,

		// MODULES
		Modules,
		ItemModule,
		NgxPaginationModule
	],
	declarations: [
		SearchComponent
	],
	exports: [
		SearchComponent
	],
	entryComponents: [
		SearchComponent
	]
})
export class SearchModule { }

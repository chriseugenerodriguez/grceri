import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// ROUTER
import { RouterModule, Routes } from '@angular/router';

// RELATED
import { CategoryComponent } from './category.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SidebarModule } from '../../../../shared/widgets/sidebar/sidebar.module';
import { SortModule } from '../../../../shared/widgets/sort/sort.module';

// CHILD
import { ItemModule } from '../../../../shared/components/item/item.module';

// MODULES
import { Modules } from '../../../../shared/widgets/widgets.module';
import { NgxPaginationModule } from 'ngx-pagination';

export const ROUTES: Routes = [
	{ path: ':cat', component: CategoryComponent },
	{ path: ':cat/:sub', component: CategoryComponent },
	{ path: ':cat/:sub/:subSub', component: CategoryComponent }

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
		NgxPaginationModule,
	],
	declarations: [
		CategoryComponent
	],
	exports: [
		CategoryComponent
	],
	entryComponents: [
		CategoryComponent
	]
})
export class CategoryModule { }

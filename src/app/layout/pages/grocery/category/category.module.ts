import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';

// RELATED
import { CategoryComponent } from './category.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SortComponent } from './sort/sort.component';
import { PaginationComponent } from './pagination/pagination.component';
import { SidebarModule } from './sidebar/sidebar.module';

// CHILD
import { ItemModule } from './item/item.module';

// MODULES
import { Modules } from '../../../../core';

// IMPORT MODULES, DECLARE COMPONENTS
@NgModule({
	imports: [
		CommonModule,
		RouterModule,
		FormsModule,
		ReactiveFormsModule,
		SidebarModule,
		DropDownsModule,

		// MODULES
		Modules,
		ItemModule
	],
	declarations: [
		CategoryComponent,
		SortComponent,
		PaginationComponent
	],
	exports: [
		CategoryComponent,
		SortComponent,
		PaginationComponent
	]
})
export class CategoryModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// RELATED
import { BlogCategoryComponent } from './category.component'
import { RouterModule } from '@angular/router';

// IMPORT MODULES, DECLARE COMPONENTS
@NgModule({
	imports: [
		CommonModule,
		RouterModule
	],
	declarations: [
		BlogCategoryComponent

	],
	exports: [
		BlogCategoryComponent
	],
	providers: []
})
export class BlogCategoryModule { }

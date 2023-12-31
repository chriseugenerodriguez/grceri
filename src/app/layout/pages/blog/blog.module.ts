import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// RELATED
import { BlogComponent } from './blog.component'

// CHILDREN
import { BlogSingleModule } from './single/single.module'
import { BlogCategoryModule } from './category/category.module';
import { BlogHomeModule } from './home/home.module';
import { BlogSearchModule } from './search/search.module';

// FORM
import { Modules } from '../../../core';


// IMPORT MODULES, DECLARE COMPONENTS
@NgModule({
	imports: [
		CommonModule,
		RouterModule,

		BlogSingleModule,
		BlogCategoryModule,
		BlogSearchModule,
		BlogHomeModule,

		Modules
	],
	declarations: [
		BlogComponent

	],
	exports: [
		BlogComponent
	],
	providers: []
})
export class BlogModule { }

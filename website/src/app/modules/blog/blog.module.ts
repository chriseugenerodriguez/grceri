import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// RELATED
import { BlogComponent } from './blog.component'

// CHILDREN
import { BlogSingleModule } from './components/single/single.module';
import { BlogCategoryModule } from './components/category/category.module';
import { BlogSearchModule } from './components/search/search.module';
import { BlogHomeModule } from './components/home/home.module';

// ROUTING
import { RouterModule } from '@angular/router';

// WIDGETS
import { FormSignUpComponent } from './widgets/form/form.component';

// FORMS
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// IMPORT MODULES, DECLARE COMPONENTS
@NgModule({
	imports: [
		CommonModule,
		RouterModule,
		FormsModule,
		ReactiveFormsModule,
		BlogSingleModule,
		BlogCategoryModule,
		BlogSearchModule,
		BlogHomeModule
	],
	declarations: [
		BlogComponent,
		FormSignUpComponent
	],
	exports: [
		BlogComponent,
		FormSignUpComponent
	],
	entryComponents: [
		BlogComponent
	]
})
export class BlogModule { }

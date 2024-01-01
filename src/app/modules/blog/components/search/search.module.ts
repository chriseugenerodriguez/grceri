import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// RELATED
import { BlogSearchComponent } from './search.component';

// IMPORT MODULES, DECLARE COMPONENTS
@NgModule({
	imports: [
		CommonModule,
		RouterModule
	],
	declarations: [
		BlogSearchComponent

	],
	exports: [
		BlogSearchComponent
	],
	providers: []
})
export class BlogSearchModule { }

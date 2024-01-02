import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// RELATED
import { BlogHomeComponent } from './home.component'

// IMPORT MODULES, DECLARE COMPONENTS
@NgModule({
	imports: [
		CommonModule,
		RouterModule
	],
	declarations: [
		BlogHomeComponent

	],
	exports: [
		BlogHomeComponent
	],
	providers: []
})
export class BlogHomeModule { }

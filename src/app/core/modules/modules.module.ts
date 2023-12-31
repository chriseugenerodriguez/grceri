import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// MODULES
import { sliderComponent, sliderItemElement } from './slider/slider.component';
import { sliderItemDirective } from './slider/slider.directive';
import { SearchComponent } from './search/search.component';
import { FormSolutionsComponent } from './form/solutions/form.component';
import { FormSignUpComponent } from './form/blog/form.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';

// JSONP
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';

// IMPORT MODULES, DECLARE COMPONENTS
@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		RouterModule,
		ReactiveFormsModule,

		HttpClientModule,
		HttpClientJsonpModule,
	],
	declarations: [
		sliderComponent,
		sliderItemDirective,
		sliderItemElement,
		SearchComponent,
		FormSolutionsComponent,
		FormSignUpComponent,
		BreadcrumbComponent
	],
	exports: [
		SearchComponent,
		sliderComponent,
		sliderItemDirective,
		sliderItemElement,
		FormSolutionsComponent,
		FormSignUpComponent,
		BreadcrumbComponent
	]
})
export class Modules { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// ROUTER
import { RouterModule } from '@angular/router';

// FORMS
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// BOOTSTRAP
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

// RELATED
import { PublicListComponent } from './public.component';

// LAZY LOAD
import { LazyLoadImageModule } from 'ng-lazyload-image';

// IMPORT MODULES, DECLARE COMPONENTS
@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		RouterModule,
		BsDropdownModule.forRoot(),
		LazyLoadImageModule,
	],
	declarations: [
		PublicListComponent
	],
	exports: [
		PublicListComponent
	]
})
export class PublicListModule { }

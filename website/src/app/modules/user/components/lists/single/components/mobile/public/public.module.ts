import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// ROUTER
import { RouterModule } from '@angular/router';

// FORMS
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// BOOTSTRAP
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

// LAZY LOAD
import { LazyLoadImageModule } from 'ng-lazyload-image';

// RELATED
import { MobilePublicListComponent } from './public.component';

// IMPORT MODULES, DECLARE COMPONENTS
@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		RouterModule,
		BsDropdownModule.forRoot(),
		LazyLoadImageModule
	],
	declarations: [
		MobilePublicListComponent
	],
	exports: [
		MobilePublicListComponent
	]
})
export class MobilePublicListModule { }

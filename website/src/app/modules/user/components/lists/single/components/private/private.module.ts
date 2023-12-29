import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

// ROUTER
import { RouterModule } from '@angular/router';

// FORMS
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// LAZY LOAD
import { LazyLoadImageModule } from 'ng-lazyload-image';

// BOOTSTRAP
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

// RELATED
import { PrivateListComponent } from './private.component';
import { ChangeLabelModule } from './../../../../../../../shared/components/modal/change-label/change-label.module';

// IMPORT MODULES, DECLARE COMPONENTS
@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		RouterModule,
		BsDropdownModule.forRoot(),
		LazyLoadImageModule,
		ChangeLabelModule
	],
	declarations: [
		PrivateListComponent
	],
	exports: [
		PrivateListComponent
	],
	providers: [
		DatePipe
	]
})
export class PrivateListModule { }

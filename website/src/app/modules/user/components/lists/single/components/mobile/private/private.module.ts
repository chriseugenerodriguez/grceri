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
import { MobilePrivateListComponent } from './private.component';

// MODULES
import { Modules } from '../../../../../../../../shared/widgets/widgets.module';
import { ChangeLabelModule } from './../../../../../../../../shared/components/modal/change-label/change-label.module';

// IMPORT MODULES, DECLARE COMPONENTS
@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		RouterModule,
		BsDropdownModule.forRoot(),
		LazyLoadImageModule,
		Modules,
		ChangeLabelModule
	],
	declarations: [
		MobilePrivateListComponent
	],
	exports: [
		MobilePrivateListComponent
	]
})
export class MobilePrivateListModule { }

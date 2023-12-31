import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

// ROUTER
import { RouterModule } from '@angular/router';

// FORMS
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// RELATED
import { ListsSingleComponent } from './single.component';

// BOOTSTRAP
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { AlertModule } from 'ngx-bootstrap/alert';

// MODULES
import { Modules } from '../../../../../shared/widgets/widgets.module';
import { MobilePublicListModule } from './components/mobile/public/public.module';
import { MobilePrivateListModule } from './components/mobile/private/private.module';
import { PublicListModule } from './components/public/public.module';
import { PrivateListModule } from './components/private/private.module';
import { ChangeLabelModule } from './../../../../../shared/components/modal/change-label/change-label.module';


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
		AlertModule.forRoot(),
		LazyLoadImageModule,
		Modules,
		MobilePublicListModule,
		MobilePrivateListModule,
		PublicListModule,
		PrivateListModule,
		ChangeLabelModule
	],
	declarations: [
		ListsSingleComponent
	],
	exports: [
		ListsSingleComponent
	],
	entryComponents: [
		ListsSingleComponent
	],
	providers: [
		DatePipe
	]
})
export class ListsSingleModule { }

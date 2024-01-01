import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// ROUTER
import { RouterModule } from '@angular/router';

// RELATED
import { HeaderComponent } from './header.component';
import { HeaderSidebarComponent } from './sidebar/sidebar.component';

// BOOTSTRAP
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

// WIDGETS
import { Modules } from '../../../shared/widgets/widgets.module';

// PROVIDERS
import {
	WINDOW_PROVIDERS,
	CategoryAPIService
} from '../../../shared/services';

// LOADING
import { LazyLoadImageModule } from 'ng-lazyload-image';

// IMPORT MODULES, DECLARE COMPONENTS
@NgModule({
	imports: [
		CommonModule,
		RouterModule,
		Modules,
		BsDropdownModule.forRoot(),
		LazyLoadImageModule
	],
	declarations: [
		HeaderComponent,
		HeaderSidebarComponent
	],
	exports: [
		HeaderComponent,
		HeaderSidebarComponent
	],
	providers: [
		WINDOW_PROVIDERS,
		CategoryAPIService
	],
	entryComponents: [
		HeaderComponent,
		HeaderSidebarComponent
	]
})
export class HeaderModule { }

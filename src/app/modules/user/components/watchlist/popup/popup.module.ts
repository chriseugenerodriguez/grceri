import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// ROUTER
import { RouterModule } from '@angular/router';

// RELATED
import { WatchlistPopupComponent } from './popup.component';

// LAZY
import { LazyLoadImageModule } from 'ng-lazyload-image';

// IMPORT MODULES, DECLARE COMPONENTS
@NgModule({
	imports: [
		CommonModule,
		RouterModule,
		LazyLoadImageModule
	],
	declarations: [
		WatchlistPopupComponent
	],
	exports: [
		WatchlistPopupComponent
	],
	entryComponents: [
		WatchlistPopupComponent
	]
})
export class WatchlistPopupModule { }

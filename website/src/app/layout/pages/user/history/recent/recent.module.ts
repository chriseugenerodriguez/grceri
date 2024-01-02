import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// RELATED
import { RecentlyViewedComponent } from './recent.component';


// IMPORT MODULES, DECLARE COMPONENTS
@NgModule({
	imports: [
		CommonModule,
    RouterModule
	],
	declarations: [
		RecentlyViewedComponent
	],
	exports: [
		RecentlyViewedComponent
	]
})
export class RecentlyViewedModule { }

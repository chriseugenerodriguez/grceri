import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// RELATED
import { MobileAppComponent } from './mobile-app.component';

// IMPORT MODULES, DECLARE COMPONENTS
@NgModule({
	imports: [
		CommonModule,
		RouterModule
	],
	declarations: [
		MobileAppComponent,
	],
	exports: [
		MobileAppComponent,
	]
})
export class MobileAppModule { }

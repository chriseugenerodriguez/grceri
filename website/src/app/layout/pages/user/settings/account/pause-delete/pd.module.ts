import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PauseDeleteComponent } from './pd.component';

// IMPORT MODULES, DECLARE COMPONENTS
@NgModule({
	imports: [
		CommonModule,
		RouterModule
	],
	declarations: [
		PauseDeleteComponent,
	],
	exports: [
		PauseDeleteComponent,
	]
})
export class PauseDeleteModule { }

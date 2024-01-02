import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RewardsComponent } from './rewards.component';

// IMPORT MODULES, DECLARE COMPONENTS
@NgModule({
	imports: [
		CommonModule,
		RouterModule
	],
	declarations: [
		RewardsComponent,
	],
	exports: [
		RewardsComponent,
	]
})
export class RewardsModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RewardsModule } from './rewards/rewards.module';

// IMPORT MODULES, DECLARE COMPONENTS
@NgModule({
	imports: [
		CommonModule,
		RouterModule,
		RewardsModule
	],
	declarations: [
	],
	exports: [
		RewardsModule
	]
})
export class ExtrasModule { }

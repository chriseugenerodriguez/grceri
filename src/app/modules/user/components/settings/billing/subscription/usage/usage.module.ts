import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// COMPONENTS
import { SettingsSubscriptionUsageComponent } from './usage.component';
import { SettingsSubscriptionCancelComponent } from '../cancel/cancel.component';

// MODULES
import { PlanListModule } from '../../../../../../../shared/components';

// BOOTSTRAP
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';

// IMPORT MODULES, DECLARE COMPONENTS
@NgModule({
	imports: [
		CommonModule,
		PlanListModule,
		ProgressbarModule.forRoot()
	],
	declarations: [
		SettingsSubscriptionUsageComponent,
		SettingsSubscriptionCancelComponent
	],
	exports: [
		SettingsSubscriptionUsageComponent
	]
})
export class SettingsSubscriptionUsageModule { }

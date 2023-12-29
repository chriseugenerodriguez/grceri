import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// CHILDREN
import { SettingsSubscriptionPlanComponent } from './subscription/plan/plan.component';
import { SettingsBillingPaymentComponent } from './payment/payment.component';
import { SettingsBillingSubscriptionComponent } from './subscription/subscription.component';
import { SettingsBillingPaymentBalanceComponent } from './payment/balance/balance.component';

// BAR RATING
// import { BarRatingModule } from 'ngx-bar-rating';

// MODULES
import { SettingsBillingPaymentAccountModule } from './payment/account/account.module';
import { SettingsSubscriptionUsageModule } from './subscription/usage/usage.module';
import { ChargeDueModule } from './../../../../../shared/components/modal/charge-due/charge-due.module';

// IMPORT MODULES, DECLARE COMPONENTS
@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		// BarRatingModule,
		SettingsBillingPaymentAccountModule,
		SettingsSubscriptionUsageModule,
		ChargeDueModule
	],
	declarations: [
		SettingsBillingPaymentComponent,
		SettingsBillingSubscriptionComponent,
		SettingsSubscriptionPlanComponent,
		SettingsBillingPaymentBalanceComponent
	],
	exports: [
		SettingsBillingPaymentComponent,
		SettingsBillingSubscriptionComponent
	]
})
export class BillingModule { }

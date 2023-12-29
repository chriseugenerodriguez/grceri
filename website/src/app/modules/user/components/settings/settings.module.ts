import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// ROUTER
import { RouterModule, Routes } from '@angular/router';

// BOOTSTRAP
import { AlertModule } from 'ngx-bootstrap/alert';

// RELATED
import { SettingsComponent } from './settings.component';

// CHILDREN
import { BillingModule } from './billing/billing.module';
import { AccountModule } from './account/account.module';

// ROUTES
import { NotificationsComponent } from './account/notifications/notifications.component';
import { SecurityComponent } from './account/security/security.component';
import { ProfileComponent } from './account/profile/profile.component';
import { SettingsBillingSubscriptionComponent } from './billing/subscription/subscription.component';
import { SettingsBillingPaymentComponent } from './billing/payment/payment.component';

import { GoogleUserAuthGuardService } from '../../../../shared/services/auth-guard/google-user.service';

export const ROUTES: Routes = [
	{
		path: '', component: SettingsComponent,
		children: [
			{ path: '', pathMatch: 'full', redirectTo: 'account' },
			{
				path: 'account',
				children: [
					{ path: '', pathMatch: 'full', redirectTo: 'profile' },
					{ path: 'notifications', component: NotificationsComponent },
					{ path: 'security', component: SecurityComponent, canActivate: [ GoogleUserAuthGuardService ] },
					{ path: 'profile', component: ProfileComponent },
				]
			},
			{
				path: 'billing',
				children: [
					{ path: '', pathMatch: 'full', redirectTo: 'history' },
					{ path: 'subscription', component: SettingsBillingSubscriptionComponent },
					{ path: 'payment', component: SettingsBillingPaymentComponent }
				]
			}
		]
	}
]

// IMPORT MODULES, DECLARE COMPONENTS
@NgModule({
	imports: [
		CommonModule,
		RouterModule.forChild(ROUTES),
		FormsModule,
		BillingModule,
		AccountModule,
		AlertModule.forRoot(),
	],
	declarations: [
		SettingsComponent
	],
	exports: [
		SettingsComponent
	],
	entryComponents: [
		SettingsComponent
	]
})
export class SettingsModule { }

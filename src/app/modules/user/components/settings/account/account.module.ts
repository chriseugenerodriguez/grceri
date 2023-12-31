import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// RELATED
import { SecurityModule } from './security/security.module';
import { ProfileModule } from './profile/profile.module';
import { NotificationsModule } from './notifications/notifications.module';

// IMPORT MODULES, DECLARE COMPONENTS
@NgModule({
	imports: [
		CommonModule,
		RouterModule,
		SecurityModule,
		ProfileModule,
		NotificationsModule
	],
	exports: [
		SecurityModule,
		ProfileModule,
		NotificationsModule
	]
})
export class AccountModule { }

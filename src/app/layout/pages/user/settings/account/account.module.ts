import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// RELATED
import { PasswordModule } from './password/password.module';
import { ProfileModule } from './profile/profile.module';
import { PauseDeleteModule } from './pause-delete/pd.module';
import { DataModule } from './manage-data/data.module';
import { NotificationsModule } from './notifications/notifications.module';

// IMPORT MODULES, DECLARE COMPONENTS
@NgModule({
	imports: [
		CommonModule,
		RouterModule,
		PasswordModule,
		ProfileModule,
		PauseDeleteModule,
		DataModule,
		NotificationsModule
	],
	exports: [
		PasswordModule,
		ProfileModule,
		PauseDeleteModule,
		DataModule,
		NotificationsModule
	]
})
export class AccountModule { }

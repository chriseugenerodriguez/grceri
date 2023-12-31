import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// RELATED
import { SecurityComponent } from './security.component';

// CHILDREN
import { SettingsSecurityPasswordComponent } from './password/password.component';
import { SettingsSecurityAuthComponent } from './auth/auth.component';
import { SettingsSecurityEmailComponent } from './email/email.component';

// IMPORT MODULES, DECLARE COMPONENTS
@NgModule({
	imports: [
		CommonModule,
		RouterModule
	],
	declarations: [
		SecurityComponent,
		SettingsSecurityPasswordComponent,
		SettingsSecurityAuthComponent,
		SettingsSecurityEmailComponent
	],
	exports: [
		SecurityComponent
	]
})
export class SecurityModule { }

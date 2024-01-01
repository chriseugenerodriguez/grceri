import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LoginModule } from './login/login.module';
import { RegisterModule } from './register/register.module';
import { ForgotPasswordModule } from './forgot-password/forgot-password.module';
import { CallbackModule } from './callback/callback.module';

// IMPORT MODULES, DECLARE COMPONENTS
@NgModule({
	imports: [
		CommonModule,
		RouterModule,
		LoginModule,
		RegisterModule,
		ForgotPasswordModule,
		CallbackModule
	],
	declarations: [
	],
	exports: [
		LoginModule,
		RegisterModule,
		ForgotPasswordModule,
		CallbackModule
	]
})
export class AuthModule { }

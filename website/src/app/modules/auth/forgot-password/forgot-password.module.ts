import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

// FORMS
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// RELATED
import { ForgotPasswordComponent } from './forgot-password.component';

// BOOTSTRAP
import { AlertModule } from 'ngx-bootstrap/alert';

// ROUTES
import { LoggedInService } from '../../../shared/services';

export const ROUTES: Routes = [
	{ path: '', component: ForgotPasswordComponent, canActivate: [LoggedInService] }
]

// IMPORT MODULES, DECLARE COMPONENTS
@NgModule({
	imports: [
		CommonModule,
		RouterModule.forChild(ROUTES),
		FormsModule,
		ReactiveFormsModule,
		AlertModule
	],
	declarations: [
		ForgotPasswordComponent
	],
	exports: [
		ForgotPasswordComponent
	],
	entryComponents: [
		ForgotPasswordComponent
	]
})
export class ForgotPasswordModule { }

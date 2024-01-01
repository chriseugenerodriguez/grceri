import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// FORMS
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// ROUTER
import { RouterModule, Routes } from '@angular/router';

// RELATED
import { LoginComponent } from './login.component';

// BOOTSTRAP
import { AlertModule } from 'ngx-bootstrap/alert';

// SLIDER
import { Modules } from '../../../shared/widgets/widgets.module';

// SERVICES
import { AuthService, LoggedInService } from '../../../shared/services';

// SOCIAL LOGIN
import { SocialLoginModule, GoogleLoginProvider, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';

// ROUTES
export const ROUTES: Routes = [
	{ path: '', component: LoginComponent, canActivate: [LoggedInService] }
]

// IMPORT MODULES, DECLARE COMPONENTS
@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		RouterModule.forChild(ROUTES),
		ReactiveFormsModule,
		AlertModule,
		SocialLoginModule,
		Modules
	],
	declarations: [
		LoginComponent
	],
	exports: [
		LoginComponent
	],
	providers: [
		AuthService,
		{
			provide: 'SocialAuthServiceConfig',
			useValue: {
				autoLogin: false,
				providers: [
					{
						id: GoogleLoginProvider.PROVIDER_ID,
						provider: new GoogleLoginProvider('1096068654354-9eg92nrkfcfikpe8uqalk797dchfhcf8.apps.googleusercontent.com'),
					}
				],
			} as SocialAuthServiceConfig,
		}
	],
	entryComponents: [
		LoginComponent
	]
})
export class LoginModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// ROUTER
import { RouterModule, Routes } from '@angular/router';

// FORMS
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// RELATED
import { RegisterComponent } from './register.component';

// ALERT
import { AlertModule } from 'ngx-bootstrap/alert';

// SERVICES
import { ProductAPIService, SearchAPIService, UserAPIService, RegisterService, LoggedInService } from '../../../shared/services';
import { LoadingBarService } from '@ngx-loading-bar/core';

// PIPES
import { KeysPipe } from '../../../shared/pipes';

// SOCIAL LOGIN
import { SocialLoginModule, GoogleLoginProvider, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';

// ROUTES
export const ROUTES: Routes = [
	{
		path: '', canActivate: [LoggedInService], children: [
			{ path: '', component: RegisterComponent },
		]
	}
]

// IMPORT MODULES, DECLARE COMPONENTS
@NgModule({
	imports: [
		CommonModule,
		RouterModule.forChild(ROUTES),
		FormsModule,
		ReactiveFormsModule,
		SocialLoginModule,
		AlertModule.forRoot()
	],
	declarations: [
		RegisterComponent,
		KeysPipe
	],
	exports: [
		RegisterComponent
	],
	providers: [
		ProductAPIService,
		SearchAPIService,
		UserAPIService,
		RegisterService,
		LoadingBarService,
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
		RegisterComponent
	]
})
export class RegisterModule { }

// import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
//
// // ROUTER
// import { RouterModule, Routes } from '@angular/router';
//
// // FORMS
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//
// // RELATED
// import { RegisterComponent } from './register.component';
// import { CreditCardModule } from './components/credit-card/credit-card.module';
//
// // ALERT
// import { AlertModule } from 'ngx-bootstrap/alert';
//
// // SERVICES
// import { ProductAPIService, SearchAPIService, UserAPIService, RegisterService, LoggedInService } from '../../../shared/services';
//
// // PIPES
// import { KeysPipe } from '../../../shared/pipes';
//
// // ROUTES
// export const ROUTES: Routes = [
// 	{
// 		path: '', canActivate: [LoggedInService], children: [
// 			{ path: '', component: RegisterComponent },
// 			{ path: ':plan', component: RegisterComponent },
// 		]
// 	}
// ]
//
// // IMPORT MODULES, DECLARE COMPONENTS
// @NgModule({
// 	imports: [
// 		CommonModule,
// 		RouterModule.forChild(ROUTES),
// 		FormsModule,
// 		ReactiveFormsModule,
// 		CreditCardModule,
// 		AlertModule.forRoot()
// 	],
// 	declarations: [
// 		RegisterComponent,
// 		KeysPipe
// 	],
// 	exports: [
// 		RegisterComponent
// 	],
// 	providers: [
// 		ProductAPIService,
// 		SearchAPIService,
// 		UserAPIService,
// 		RegisterService
// 	],
// 	entryComponents: [
// 		RegisterComponent
// 	]
// })
// export class RegisterModule { }

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { TransferHttpCacheModule } from '@nguniversal/common';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';


// PAGES
import {
	HomeModule,
	CartModule,
	MobileAppModule,
	GroceryModule,
	NotFoundModule,
	UserModule,
	PricingModule,
	AuthModule,
	PoliciesModule,
	BlogModule,
	SolutionsModule
} from './layout/pages/index'

// SHARED
import {
	HeaderModule,
	FooterModule
} from './layout/shared/index'

// PROVIDERS
import {
	AuthGuardService,
	AuthService,
	API,
	LoggedInService,
	LocalStorage
} from './core/index';

// Import the Animations module
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CartService } from './core/services/cart.service';
import { ProductsService } from './core/services/product.service';

@NgModule({
	declarations: [
		AppComponent
	],
	imports: [
		BrowserModule.withServerTransition({ appId: 'grceri' }),
		AppRoutingModule,
		TransferHttpCacheModule,
		BrowserAnimationsModule,

		// PAGES
		HomeModule,
		CartModule,
		MobileAppModule,
		GroceryModule,
		NotFoundModule,
		UserModule,
		PricingModule,
		AuthModule,
		PoliciesModule,
		BlogModule,
		SolutionsModule,

		// SHARED
		HeaderModule,
		FooterModule
	],
	providers: [
		AuthGuardService,
		LoggedInService,
		AuthService,
		API,
		CartService,
		ProductsService,
		LocalStorage
	],
	bootstrap: [AppComponent]
})

export class AppBrowserModule { }

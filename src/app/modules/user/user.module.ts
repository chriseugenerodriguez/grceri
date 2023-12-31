import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';

// ROUTER
import { RouterModule } from '@angular/router';

// RELATED
import { UserComponent } from './user.component';

// CHILDREN
import { SettingsModule } from './components/settings/settings.module';
import { ListsModule } from './components/lists/lists.module';
import { HistoryModule } from './components/history/history.module';
import { FavoritesModule } from './components/favorites/favorites.module';
import { DashboardModule } from './components/dashboard/dashboard.module';
import { WatchlistModule } from './components/watchlist/watchlist.module';

// PROVIDERS
import {
	AuthGuardService,
	LoggedInService,
	AuthService,
	UserAPIService,
	SeoService,
	LinkTagService,
	GoogleAnalyticsService,
	ShoppingListAPIService,
	ModalService,
	SortingService
} from '../../shared/services';

// IMPORT MODULES, DECLARE COMPONENTS
@NgModule({
	imports: [
		RouterModule,
		CommonModule,

		// CHILDREN
		SettingsModule,
		ListsModule,
		HistoryModule,
		FavoritesModule,
		DashboardModule,
		WatchlistModule
	],
	declarations: [
		UserComponent
	],
	exports: [
		UserComponent,

		// CHILDREN
		SettingsModule,
		ListsModule,
		HistoryModule,
		FavoritesModule,
		DashboardModule,
		WatchlistModule
	],
	providers: [
		AuthGuardService,
		LoggedInService,
		AuthService,
		UserAPIService,
		SeoService,
		LinkTagService,
		GoogleAnalyticsService,
		ModalService,
		ShoppingListAPIService,
		DecimalPipe,
		SortingService
	],
	entryComponents: [
		UserComponent
	]
})
export class UserModule { }

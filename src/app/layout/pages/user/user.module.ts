import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

// RELATED
import { UserComponent } from './user.component';

// CHILDREN
import { SettingsModule } from './settings/settings.module';
import { SupportModule } from './support/support.module';
import { ReportsModule } from './reports/reports.module';
import { ListsModule } from './lists/lists.module';
import { HistoryModule } from './history/history.module';
import { FavoritesModule } from './favorites/favorites.module';
import { DashboardModule } from './dashboard/dashboard.module';

// IMPORT MODULES, DECLARE COMPONENTS
@NgModule({
	imports: [
		CommonModule,
		RouterModule,

		// CHILDREN
		SettingsModule,
		SupportModule,
		ListsModule,
		HistoryModule,
		ReportsModule,
		FavoritesModule,
		DashboardModule
	],
	declarations: [
		UserComponent
	],
	exports: [
		UserComponent,

		// CHILDREN
		SettingsModule,
		SupportModule,
		ListsModule,
		HistoryModule,
		ReportsModule,
		FavoritesModule,
		DashboardModule
	]
})
export class UserModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

// RELATED
import { WatchlistComponent } from './watchlist.component';

// MODULE
import { WatchlistTileModule } from './tile/tile.module';
import { WatchlistPopupModule } from './popup/popup.module';

// ROUTER
import { AuthGuardService } from '../../../../shared/services';

// BOOTSTRAP
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { AlertModule } from 'ngx-bootstrap/alert';

export const ROUTES: Routes = [
	{ path: '', component: WatchlistComponent, canActivate: [AuthGuardService] },
]

// IMPORT MODULES, DECLARE COMPONENTS
@NgModule({
	imports: [
		RouterModule.forChild(ROUTES),
		CommonModule,
		WatchlistTileModule,
		WatchlistPopupModule,
		BsDropdownModule,
		AlertModule.forRoot()
	],
	declarations: [
		WatchlistComponent
	],
	exports: [
		WatchlistComponent
	],
	entryComponents: [
		WatchlistComponent
	]
})
export class WatchlistModule { }

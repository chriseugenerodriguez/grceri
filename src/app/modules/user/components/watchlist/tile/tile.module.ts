import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// RELATED
import { WatchlistTileComponent } from './tile.component';

// LAZY
import { LazyLoadImageModule } from 'ng-lazyload-image';

// IMPORT MODULES, DECLARE COMPONENTS
@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		LazyLoadImageModule
	],
	declarations: [
		WatchlistTileComponent
	],
	exports: [
		WatchlistTileComponent
	],
	entryComponents: [
		WatchlistTileComponent
	]
})
export class WatchlistTileModule { }

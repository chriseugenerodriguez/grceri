import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// RELATED
import { ListsTileComponent } from './tile.component';

// BOOTSTRAP
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

// LAZY
import { LazyLoadImageModule  } from 'ng-lazyload-image';

// IMPORT MODULES, DECLARE COMPONENTS
@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		RouterModule,
		LazyLoadImageModule,
		BsDropdownModule.forRoot()
	],
	declarations: [
		ListsTileComponent
	],
	exports: [
		ListsTileComponent
	],
	entryComponents: [
		ListsTileComponent
	]
})
export class ListsTileModule { }

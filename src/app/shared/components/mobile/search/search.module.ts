import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// RELATED
import { FormsModule } from '@angular/forms';
import { MobileSearchComponent } from './search.component';

// WIDGETS
import { Modules } from '../../../widgets/widgets.module';

// LAZY
import { LazyLoadImageModule } from 'ng-lazyload-image';

// IMPORT MODULES, DECLARE COMPONENTS
@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		RouterModule,
		Modules,
		LazyLoadImageModule
	],
	declarations: [
		MobileSearchComponent
	],
	exports: [
		MobileSearchComponent
	]
})
export class MobileSearchModule { }

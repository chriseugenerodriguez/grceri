import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

// RELATED
import { ListsComponent } from './lists.component';
import { ListsTileModule } from './tile/tile.module';
import { FilterComponent } from './filter/filter.component';
import { ListsSingleModule } from './single/single.module';
import { ListOptionsModule } from '../../../../shared/components/modal/list-options/list-options.module';
import { ListsCreateModule } from './../../../../shared/components/modal/create/create.module';
import { ChangeLabelModule } from './../../../../shared/components/modal/change-label/change-label.module';
import { EditLabelModule } from './../../../../shared/components/modal/edit-label/edit-label.module';
import { FilterListsModule } from './../../../../shared/components/modal/filter-lists/filter-lists.module';

// BOOTSTRAP
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { AlertModule } from 'ngx-bootstrap/alert';

// AUTH
import { AuthGuardService } from '../../../../shared/services';

// ROUTER
import { ListsSingleComponent } from './single/single.component';

export const ROUTES: Routes = [
	{ path: '', component: ListsComponent, canActivate: [AuthGuardService] },
	{ path: 'following', component: ListsComponent, canActivate: [AuthGuardService] },
	{ path: 'discover', component: ListsComponent },
	{ path: ':id', component: ListsSingleComponent }
]

// IMPORT MODULES, DECLARE COMPONENTS
@NgModule({
	imports: [
		RouterModule.forChild(ROUTES),
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		ListsTileModule,
		ListsSingleModule,
		ListOptionsModule,
		ListsCreateModule,
		ChangeLabelModule,
		EditLabelModule,
		FilterListsModule,
		BsDropdownModule.forRoot(),
		AlertModule.forRoot()
	],
	declarations: [
		ListsComponent,
		FilterComponent
	],
	exports: [
		ListsComponent
	],
	entryComponents: [
		ListsComponent
	]
})
export class ListsModule { }

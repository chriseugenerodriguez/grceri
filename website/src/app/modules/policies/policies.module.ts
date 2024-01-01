import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

// RELATED
import { PoliciesComponent } from './policies.component';
import { PoliciesSidebarModule } from './components/sidebar/sidebar.module';

// CHILDREN
import { PoliciesPageModule } from './components/page/page.module';

// PROVIDERS
import { CMSService } from '../../shared/services/cms/cms.service';

// ROUTES
import { PoliciesPageComponent } from './components/page/page.component';

export const ROUTES: Routes = [
	{ path: '', component: PoliciesComponent,
		children: [
			{ path: '', pathMatch: 'full', redirectTo: 'terms-of-use' },
			{ path: ':page', component: PoliciesPageComponent }
		]
	}
];

// IMPORT MODULES, DECLARE COMPONENTS
@NgModule({
	imports: [
		RouterModule.forChild(ROUTES),
		CommonModule,
		PoliciesPageModule,
		PoliciesSidebarModule
	],
	declarations: [
		PoliciesComponent
	],
	exports: [
		PoliciesComponent
	],
	providers: [
		CMSService
	],
	entryComponents: [
		PoliciesComponent
	]
})
export class PoliciesModule { }

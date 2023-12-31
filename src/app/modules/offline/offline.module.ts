import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

// ROUTER
import { RouterModule, Routes } from '@angular/router';

import { OfflineComponent } from './offline.component';

// ROUTES
export const ROUTES: Routes = [
	{ path: '', component: OfflineComponent }
];

@NgModule({
    imports: [
        RouterModule.forChild(ROUTES),
		CommonModule,
    ],
    exports: [],
    declarations: [OfflineComponent],
    providers: [],
})
export class OfflineModule { }

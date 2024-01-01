import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// RELATED
import { NotificationsComponent } from './notifications.component';

// IMPORT MODULES, DECLARE COMPONENTS
@NgModule({
	imports: [
		CommonModule,
		RouterModule
	],
	declarations: [
		NotificationsComponent,
	],
	exports: [
		NotificationsComponent,
	]
})
export class NotificationsModule { }

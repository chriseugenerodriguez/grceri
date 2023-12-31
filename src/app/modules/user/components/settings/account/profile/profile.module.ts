import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// CHILDREN
import { ProfileComponent } from './profile.component';
import { SettingsProfilePersonalComponent } from './personal/personal.component';
import { SettingsProfileImageComponent } from './image/image.component';

// IMPORT MODULES, DECLARE COMPONENTS
@NgModule({
	imports: [
		CommonModule,
		RouterModule
	],
	declarations: [
		ProfileComponent,
		SettingsProfilePersonalComponent,
		SettingsProfileImageComponent
	],
	exports: [
		ProfileComponent
	]
})
export class ProfileModule { }

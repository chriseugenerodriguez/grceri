import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// RELATED
import { FormsModule } from '@angular/forms';
import { MobileVoiceComponent } from './voice.component';

// IMPORT MODULES, DECLARE COMPONENTS
@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		RouterModule
	],
	declarations: [
		MobileVoiceComponent
	],
	exports: [
		MobileVoiceComponent
	]
})
export class MobileVoiceModule { }

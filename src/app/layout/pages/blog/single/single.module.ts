import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// RELATED
import { BlogSingleComponent } from './single.component';

// META
import { SocialService } from '../../../../core';


// IMPORT MODULES, DECLARE COMPONENTS
@NgModule({
	imports: [
		CommonModule,
		RouterModule,
		FormsModule,
	],
	declarations: [
		BlogSingleComponent

	],
	exports: [
		BlogSingleComponent
	],
	providers: [
		SocialService
	]
})
export class BlogSingleModule { }

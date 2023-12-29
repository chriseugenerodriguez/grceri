import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// RELATED
import { BlogSingleComponent } from './single.component';

// META
import { SocialService } from '../../../../core';

// DISQUS
import { DisqusModule } from 'ngx-disqus';

// IMPORT MODULES, DECLARE COMPONENTS
@NgModule({
	imports: [
		CommonModule,
		RouterModule,
		FormsModule,
		DisqusModule.forRoot('grceri-com-blog')
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

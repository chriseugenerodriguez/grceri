import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// RELATED
import { CreditCardComponent } from './credit-card.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// IMPORT MODULES, DECLARE COMPONENTS
@NgModule({
	imports: [
		CommonModule,
		RouterModule,
		FormsModule,
		ReactiveFormsModule
	],
	declarations: [
		CreditCardComponent,
	],
	exports: [
		CreditCardComponent,
	]
})
export class CreditCardModule { }

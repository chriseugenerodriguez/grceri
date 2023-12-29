import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// CHILDREN
import { SettingsBillingPaymentAccountComponent } from './account.component';

import { EditPaymentMethodModule, AddPaymentMethodModule } from '../../../../../../../shared/components';

// BOOTSTRAP
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

// LOADING
import { LazyLoadImageModule } from 'ng-lazyload-image';

// IMPORT MODULES, DECLARE COMPONENTS
@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		LazyLoadImageModule,
		BsDropdownModule,
		EditPaymentMethodModule,
		AddPaymentMethodModule
	],
	declarations: [
		SettingsBillingPaymentAccountComponent
	],
	exports: [
		SettingsBillingPaymentAccountComponent
	]
})
export class SettingsBillingPaymentAccountModule { }

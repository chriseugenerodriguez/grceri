import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// ROUTER
import { RouterModule, Routes } from '@angular/router';

// FORMS
import { ReactiveFormsModule } from '@angular/forms';

// RELATED
import { ProductComponent } from './product.component';

// MODULES
import { Modules } from '../../../../shared/widgets/widgets.module';
import { ItemModule } from '../../../../shared/components/item/item.module';

// CHILD
import { ItemComponent } from '../../../../shared/components/item/item.component';

// CHILDREN
import { ProductModuleModule } from './components/module.module';

export const ROUTES: Routes = [
	{ path: ':product/:productId', component: ProductComponent }
];

// IMPORT MODULES, DECLARE COMPONENTS
@NgModule({
	imports: [
		CommonModule,
		RouterModule.forChild(ROUTES),
		ReactiveFormsModule,

		Modules,
		ItemModule,
		ProductModuleModule,
	],
	declarations: [
		ProductComponent
	],
	exports: [
		ProductComponent
	],
	providers: [
		ItemComponent
	],
	entryComponents: [
		ProductComponent
	]
})
export class ProductModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// MODULES
import { SliderComponent, sliderItemElement } from './slider/slider.component';
import { sliderItemDirective } from './slider/slider.directive';
import { SortModule } from './sort/sort.module';
import { SidebarModule } from './sidebar/sidebar.module';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { MobileBreadcrumbComponent } from './mobile-breadcrumb/mobile-breadcrumb.component';
import { MobileFilterComponent } from './mobile-filter/mobile-filter.component';
import { CreditCardModule } from './credit-card/credit-card.module';

// IMPORT MODULES, DECLARE COMPONENTS
@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		RouterModule,
		ReactiveFormsModule,
		SortModule,
		SidebarModule,
		CreditCardModule
	],
	declarations: [
		SliderComponent,
		sliderItemDirective,
		sliderItemElement,
		SearchBarComponent,
		BreadcrumbComponent,
		MobileBreadcrumbComponent,
		MobileFilterComponent
	],
	exports: [
		SearchBarComponent,
		SliderComponent,
		sliderItemDirective,
		sliderItemElement,
		BreadcrumbComponent,
		MobileBreadcrumbComponent,
		MobileFilterComponent
	],
	entryComponents: [
		MobileFilterComponent,
		BreadcrumbComponent,
		MobileBreadcrumbComponent,
		SliderComponent,
		SearchBarComponent
	],
	bootstrap: [SearchBarComponent]
})
export class Modules { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// SLIDER
import { Ng5SliderModule } from 'ng5-slider';

// FORMGROUP
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// RELATED
import { SidebarComponent } from './sidebar.component';

// CHILDREN
import { DepartmentComponent } from './department/department.component';
import { DynamicComponent } from './dynamic/dynamic.component';
import { SliderChartComponent } from './slider-chart/slider-chart.component';


// NG4 CHARTS
import { NgChartsModule } from 'ng2-charts';

// IMPORT MODULES, DECLARE COMPONENTS
@NgModule({
	imports: [
		CommonModule,
		RouterModule,
		FormsModule,
		ReactiveFormsModule,
		Ng5SliderModule,
		NgChartsModule,
	],
	declarations: [
		SidebarComponent,
		DepartmentComponent,
		DynamicComponent,
		SliderChartComponent
	],
	exports: [
		SidebarComponent,
		DepartmentComponent,
		DynamicComponent
	],
	entryComponents: [
		SidebarComponent,
		DynamicComponent,
		DepartmentComponent
	]
})
export class SidebarModule { }

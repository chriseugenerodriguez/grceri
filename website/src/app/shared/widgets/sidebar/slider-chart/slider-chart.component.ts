import { Component, Input, OnInit, OnChanges, ChangeDetectorRef } from '@angular/core';
import { ChartOptions } from 'chart.js';
@Component({
	selector: 'slider-chart',
	templateUrl: 'slider-chart.component.html',
})
export class SliderChartComponent implements OnInit, OnChanges {
	@Input() priceSliderCount: any[] = [];
	@Input() priceSliderValue: any[] = [];

	lineChartData: Array<any>;
	lineChartLabels: Array<any>;
	lineChartOptions: any;
	lineChartColors: Array<any>;
	lineChartLegend: boolean;
	lineChartType: ChartOptions;

	constructor(private changeDetector: ChangeDetectorRef) {
		this.lineChartData = [
			{
				data: [],
				label: '',
				borderWidth: 1,
			},
		];

		this.lineChartLabels = [];

		this.lineChartOptions = {
			responsive: true,
			elements: {
				point: {
					radius: 0,
				},
			},
			tooltips: {
				enabled: false,
			},
			scales: {
				xAxes: [
					{
						display: false,
					},
				],
				yAxes: [
					{
						display: false,
					},
				],
			},
			colors: [
				{
					// grey
					backgroundColor: 'rgba(204,236,214,.5)',
					borderColor: 'rgba(72,182,106.5)',
				},
			]
		};

		this.lineChartLegend = false;
	}

	ngOnInit() {
		let newlineChartData: Array<any> = Object.assign([{}], this.lineChartData);

		newlineChartData[0].data = this.priceSliderCount;

		this.lineChartData = newlineChartData;
		this.lineChartLabels = this.priceSliderValue;
	}

	ngOnChanges() {
		this.changeDetector.detectChanges();
	}
}

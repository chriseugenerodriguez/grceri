import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
	moduleId: module.id,
	selector: 'pricing-basic',
	templateUrl: 'basic.component.html'
})
export class PricingBasicComponent implements OnInit {

	constructor(title: Title,) {
		title.setTitle('Pricing - Grceri');
	}

	ngOnInit() {

	}
}

import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
	moduleId: module.id,
	selector: 'pricing-free',
	templateUrl: 'free.component.html'
})
export class PricingFreeComponent implements OnInit {

	constructor(title: Title,) {
		title.setTitle('Pricing - Grceri');
	}

	ngOnInit() {

	}
}

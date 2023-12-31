import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
	moduleId: module.id,
	selector: 'pricing-elite',
	templateUrl: 'elite.component.html'
})
export class PricingEliteComponent implements OnInit {

	constructor(title: Title,) {
		title.setTitle('Pricing - Grceri');
	}

	ngOnInit() {

	}
}

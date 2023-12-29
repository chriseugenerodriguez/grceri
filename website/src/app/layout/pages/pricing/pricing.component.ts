import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AuthService } from '../../../core';

@Component({
	moduleId: module.id,
	selector: 'pricing',
	templateUrl: 'pricing.component.html'
})
export class PricingComponent implements OnInit {

	constructor(title: Title, private AS: AuthService) {
		title.setTitle('Pricing - Grceri');
	}

	ngOnInit() {

	}

	login() {
		return this.AS.isAuthenticated();
	}
}

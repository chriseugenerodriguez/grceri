import { Component, OnInit, OnDestroy } from '@angular/core';

// SERVICES
import { AuthService, SeoService, HttpCancelService, GoogleAnalyticsService } from '../../shared/services';

// ROUTER
import { Router } from '@angular/router';

// ENV
import { environment } from '../../../environments/environment';

@Component({
	moduleId: module.id,
	selector: 'pricing',
	templateUrl: 'pricing.component.html',
	styleUrls: ['pricing.component.scss'],
})
export class PricingComponent implements OnInit, OnDestroy {
	constructor(public GS: GoogleAnalyticsService, private AS: AuthService, private SS: SeoService, private router: Router, private httpCancelService: HttpCancelService) {
		// SEO
		this.SS.generateTags({
			title: 'Our Pricing - grceri',
			description: 'Simple Monthly pricing plans to start saving money over time with our advanced grocery search. Buy groceries, Beverages, Fresh Food, Breakfast & Cereal Online.',
			url: this.router.url,
		});

		// IF LOGGED IN
		if (this.AS.isAuthenticated()) {
			// REDIRECT TO GROCERIES PAGE
			this.router.navigate(['/user']);
		}
	}

	ngOnInit(): void {}

	ngOnDestroy(): void {
		this.httpCancelService.cancelPendingRequests();
		if (!environment.production && !this.httpCancelService) {
			console.log('canceled pending request');
		}
	}

	login() {
		return this.AS.isAuthenticated();
	}
}

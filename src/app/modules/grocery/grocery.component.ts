import { Component, OnInit, OnDestroy } from '@angular/core';

// SERVICES
import { CategoryAPIService, HttpCancelService, SeoService, GoogleAnalyticsService, SearchBarService } from '../../shared/services';

// ROUTER
import { Router } from '@angular/router';

// ENV
import { environment } from '../../../environments/environment';

// LOCATION
import { Location } from '@angular/common';

// COMPONENT
@Component({
	moduleId: module.id,
	selector: 'grocery',
	templateUrl: 'grocery.component.html',
	styleUrls: ['grocery.component.scss'],
})

// CLASS
export class GroceryComponent implements OnInit, OnDestroy {
	public lists: any;

	// MOBILE SORT
	sort = {};

	// STRING
	// load = require('../../../assets/img/blank.jpg');
	load = './assets/img/blank.jpg';

	constructor(
		public location: Location,
		public GS: GoogleAnalyticsService,
		public SBS: SearchBarService,
		private router: Router,
		private CS: CategoryAPIService,
		private SS: SeoService,
		private httpCancelService: HttpCancelService) {
		// SEO
		this.SS.generateTags({
			title: 'All Groceries - grceri',
			description: 'See all the groceries sold online today, choose any of the available categories below to get started.',
			url: this.router.url,
		});
	}

	ngOnInit() {
		// If no default value in Status input, set filter to empty array
		this.list();
	}

	ngOnDestroy(): void {
		this.httpCancelService.cancelPendingRequests();
		if (!environment.production && !this.httpCancelService) {
			console.log('canceled pending request');
		}
	}

	list() {
		this.CS.getCat().subscribe(r => {
			if (r) {
				this.lists = r[0]['categories'];
			}
		});
	}

	gEvent(name) {
		this.GS.event('link', `Groceries - ${name} (Category)`, 'click', 0);
	}

	private url(i) {
		return i['name'].toLowerCase().replace(/(?:( and )|(&)|(,)|(\s)|[/])+/g, '-');
	}
}

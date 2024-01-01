import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID, HostListener } from '@angular/core';

// ROUTER
import { Router } from '@angular/router';

// COMPONENT
import { ItemComponent } from '../../shared/components/item/item.component';

// SERVICES
import { AuthService, HttpCancelService, CategoryAPIService, SeoService, GoogleAnalyticsService, BarcodeService, InstallPWAService, ListsAPIService } from '../../shared/services';

// ENV
import { environment } from '../../../environments/environment';
import { DOCUMENT } from '@angular/common';

// COMPONENT
@Component({
	moduleId: module.id,
	selector: 'home-app',
	templateUrl: 'home.component.html',
	styleUrls: ['home.component.scss']
})

// CLASS
export class HomeComponent implements OnInit, OnDestroy {
	// BOOLEAN
	scrolling = false;
	moreC = false;

	searchInputText: any;
	category: any;
	// load = require('../../../assets/img/blank.jpg');
	load = './assets/img/blank.jpg';

	// CMS
	latest: any;

	// // S - DATA
	// schema = {
	// 	'@context': 'http://schema.org',
	// 	'@type': 'WebSite',
	// 	'url': 'https://grceri.com/',
	// 	'potentialAction': {
	// 		'@type': 'SearchAction',
	// 		'target': 'https://grceri.com/search?cat_id=&query={search_term_string}',
	// 		'query-input': 'required name=search_term_string'
	// 	}
	// }

	env = environment;

	// ARRAYS
	listsFollowed = [];
	listsViewed = [];
	listsWatched = [];
	citems = Array(10).fill(1);
	witems = Array(7).fill(1);
	nitems = Array(7).fill(1);

	constructor(
		@Inject(DOCUMENT) private document: Document,
		public IS: InstallPWAService,
		public BS: BarcodeService,
		public GS: GoogleAnalyticsService,
		public router: Router,
		private AS: AuthService,
		private IC: ItemComponent,
		@Inject(PLATFORM_ID) private platform: any,
		private CS: CategoryAPIService,
		private SS: SeoService,
		private httpCancelService: HttpCancelService,
		private LS: ListsAPIService) {
		// SEO
		this.SS.generateTags({
			title: 'Online Grocery Shopping Store | Online Grocery Database - grceri',
			description: 'Shop Online for best Grocery products like Baking, beverages, coffee, frozen food, Condiments, Sauces & spices, Gift baskets, Gluten Free, International, and kosher foods.',
			url: this.router.url
		});

		this.searchInputText = '';
	}

	ngOnInit() {
		this.list();
		this.getLists();
	}

	ngOnDestroy(): void {
		this.httpCancelService.cancelPendingRequests();
		if (!environment.production && !this.httpCancelService) {
			console.log('canceled pending request');
		}
	}


	@HostListener('window:scroll', ['$event']) // for window scroll events
	onScroll() {
		if (this.env.mobile) {
			let elementTarget = document.querySelector('.app-viewer.mobile') as HTMLElement;

			this.scrolling = window.scrollY > (elementTarget.offsetTop + elementTarget.offsetHeight) ? true : false;
		}
	}


	getLists() {
		this.LS.getMostViewed().subscribe((res: any) => {
			this.listsViewed = res;
			if (!environment.production) {
				console.log('this.listsViewed', this.listsViewed);
			}
		});

		this.LS.getMostWatched().subscribe((res: any) => {
			this.listsWatched = res;
		});
	}

	login() {
		return this.AS.isAuthenticated();
	}

	list() {
		this.CS.getCat().subscribe(r => {
			if (r) {
				this.category = r && r[0] && r[0]['categories'] ? r[0]['categories'] : null;
			}
		});
	}

	onNewInput(input) {
		if (input === this.searchInputText) {
			this.searchInputText = input + '*##1*1##*';
		} else {
			this.searchInputText = input;
		}
	}

	url(i) {
		return i['name'].toLowerCase().replace(/(?:( and )|(&)|(,)|(\s)|[/])+/g, '-');
	}

	moreCat() {
		this.moreC = !this.moreC;
	}

	lower(i) {
		return i.toLowerCase();
	}

	product(i) {
		return this.IC.product(i);
	}

	gEvent(name) {
		this.GS.event('image', `Home - ${name} (Category)`, 'click', 0);
	}
}

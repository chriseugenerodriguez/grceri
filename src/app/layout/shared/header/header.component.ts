import { Component, OnInit } from '@angular/core';

import { DomSanitizer } from '@angular/platform-browser';

// SERVICES
import { AuthService, WINDOW } from '../../../core/index';
import { Router, NavigationStart, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
	moduleId: module.id,
	selector: 'header-app',
	templateUrl: 'header.component.html'
})
export class HeaderComponent implements OnInit {
	public lists = [];
	public profile: any;
	public other: any = false;
	public clear: any = false;

	public classList: any[] = [];

	public navIsFixed = false;

	public currentUrl: any = '';

	constructor(
		private AS: AuthService,
		public router: Router,
		public activatedRoute: ActivatedRoute,
		public sanitizer: DomSanitizer,
		private http: HttpClient,
		// @Inject(DOCUMENT) private document: Document,
		// @Inject(WINDOW) private window
	) {

		// this.router.events.subscribe(path => {

		// 	if (path instanceof NavigationStart) {

		// 		this.currentUrl = path.url;

		// 		if (
		// 			this.currentUrl.startsWith('/groceries/') ||
		// 			this.currentUrl.startsWith('/grocery/') ||
		// 			this.currentUrl.match(/^\/cart$/) ||
		// 			this.currentUrl.match(/^\/checkout$/) ||
		// 			this.currentUrl.match(/^\/confirmation$/)
		// 		) {
		// 			this.other = true;
		// 		} else {
		// 			this.other = false;
		// 		}

		// 		if (
		// 			this.currentUrl.match(/^\/groceries$/) ||
		// 			this.currentUrl.match(/^\/pricing$/)
		// 		) {
		// 			this.clear = true;
		// 		} else {
		// 			this.clear = false;
		// 		}
		// 	}
		// });

		// activatedRoute.params.subscribe(() => {
		// 	this.currentUrl = this.router.url;
		// });

		// activatedRoute.url.subscribe(
		// 	url => {
		// 		this.currentUrl = this.router.url;
		// 	}
		// );

	}

	logOut() {
		this.AS.logout();
	}

	login() {
		return this.AS.isAuthenticated();
	}

	isUser(value: string): boolean {
		return /^\/user(\/|$)/.test(value);
	}

	private url(i) {
		return i['name'].toLowerCase().replace(/(?:( and )|(&)|(,)|(\s)|[/])+/g, '-');
	}

	photoURL(i) {
		return this.sanitizer.bypassSecurityTrustResourceUrl(i);
	}

	// ngAfterContentInit() {

	// 	if (
	// 		this.currentUrl.startsWith('/groceries/') ||
	// 		this.currentUrl.startsWith('/grocery/') ||
	// 		this.currentUrl.match(/^\/cart$/) ||
	// 		this.currentUrl.match(/^\/checkout$/) ||
	// 		this.currentUrl.match(/^\/confirmation$/)
	// 	) {
	// 		this.other = true;
	// 	} else {
	// 		this.other = false;
	// 	}

	// 	if (
	// 		this.currentUrl.match(/^\/groceries$/) ||
	// 		this.currentUrl.match(/^\/pricing$/)
	// 	) {
	// 		this.clear = true;
	// 	} else {
	// 		this.clear = false;
	// 	}

	// }

	ngOnInit() {
		this.list();

		if (this.AS.userProfile) {
			this.profile = this.AS.userProfile;
		} else {
			this.AS.getProfile((err, profile) => {
				this.profile = profile;
			});
		}

	}

	// @HostListener('window:scroll', [])
	// onWindowScroll() {
	// 	//if (this.router.url === '/' || this.router.url === '/user') {
	// 		let number = this.window.pageYOffset || this.document.documentElement.scrollTop || this.document.body.scrollTop || 0;
	// 		if (number > 0) {
	// 			this.navIsFixed = true;
	// 		} else if (this.navIsFixed && number < 10) {
	// 			this.navIsFixed = false;
	// 		}
	// 	//}
	// }

	isStripe(value: string): boolean {
		let boolean: boolean;
		if (
			value === '/'
		) {
			boolean = true;
		} else {
			boolean = false;
		}

		return boolean;
	}

	public list() {
		this.http.get('/assets/json/category.json').subscribe(res => {
			this.lists = res['groceries']['categories'];
		});
	}

}

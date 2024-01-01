import {
	Component, OnInit, HostListener, PLATFORM_ID,
	Inject, AfterViewInit, OnDestroy, ChangeDetectorRef, ElementRef, ViewChild
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

// SERVICES
import { AuthService, CategoryAPIService, ProfileAPIService, GoogleAnalyticsService, HammerService } from '../../../shared/services';

// ROUTER
import { Router, ActivatedRoute } from '@angular/router';

// SSR
import { isPlatformBrowser } from '@angular/common';
import { Location } from '@angular/common';

// RXJS
import { Subscription } from 'rxjs';

// ENVIRONMENT
import { environment } from '../../../../environments/environment';

@Component({
	moduleId: module.id,
	selector: 'header-app',
	templateUrl: 'header.component.html',
	styleUrls: ['header.component.scss']
})
export class HeaderComponent implements OnInit, AfterViewInit, OnDestroy {
	@ViewChild('swipeNav', { static: false }) swipeNav: ElementRef;

	// OBJECT
	lists: any;
	profile: any;
	classList: any[] = [];

	// BOOLEAN
	other = false;
	clear = false;
	navIsFixed = false;
	expanded: boolean;
	isCategoriesDropdownHidden = true;
	sideNav = false;

	// STRING
	currentUrl: any = '';
	searchInputText: string;
	env = environment;
	// load: string = require('../../../../assets/img/blank.jpg');
	load = './assets/img/blank.jpg';

	// MOBILE
	mobile: boolean;

	// PAGE
	disableHeaderSearch: boolean;

	// SUBSCRIPTION
	private _subscriptions: any = new Subscription();

	constructor(
		@Inject(DOCUMENT) private document: Document,
		public GS: GoogleAnalyticsService,
		private AS: AuthService,
		public router: Router,
		private location: Location,
		public activatedRoute: ActivatedRoute,
		public sanitizer: DomSanitizer,
		private CS: CategoryAPIService,
		private changeDetector: ChangeDetectorRef,
		private _profileService: ProfileAPIService,
		@Inject(PLATFORM_ID) private platform: any,
		private hammerService: HammerService
	) {
		this.searchInputText = '';
		this.isMobile();
		this.disableHeaderSearch = false;
	}

	@HostListener('window:resize', ['$event'])
	onResize(event) {
		this.resetNav();
		this.isMobile();
	}

	ngAfterViewInit() {
		this.isMobile();
		this._hammerInteractions();
		this.changeDetector.detectChanges();
	}

	ngOnDestroy() {
		this._subscriptions.unsubscribe();
	}

	private isMobile() {
		if (isPlatformBrowser(this.platform)) {
			this.mobile = (window.innerWidth < 767) ? true : false;
		}
	}

	onNewInput(input) {
		if (input === this.searchInputText) {
			this.searchInputText = input + '*##1*1##*';
		} else {
			this.searchInputText = input;
		}
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

	ngOnInit() {
		this.checkCurrentRoute();
		this.list();
		if (this.AS.userProfile) {
			this.profile = this.AS.userProfile;
		} else {
			if (this.AS.isAuthenticated()) {
				this._subscriptions.add(this._profileService.getProfile().subscribe((res) => {
					if (res) {
						this.profile = res;
					}
				}));
			}
		}
	}

	checkCurrentRoute() {
		this._subscriptions.add(this.router.events.subscribe((val) => {
			let currentURL = this.location.path();
			if (currentURL.indexOf('/groceries/') !== -1) {
				this.disableHeaderSearch = true;
			} else if (currentURL.indexOf('/search?') !== -1) {
				this.disableHeaderSearch = true;
			} else {
				this.disableHeaderSearch = false;
			}
		}));
	}

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

	list() {
		this.CS.getCat().subscribe((r) => {
			if (r) {
				this.lists = r[0]['categories'];
			}
		});
	}

	gEvent(name) {
		this.GS.event('link', `Header - ${name} (Category)`, 'click', 0);
	}

	resetNav() {
		this.sideNav = false;
		this.document.body.classList.remove('is-active');
		this.document.body.classList.add('is-not-active');
	}

	addNav() {
		this.sideNav = true;
		this.document.body.classList.add('is-active');
		this.document.body.classList.remove('is-not-active');
	}

	private _hammerInteractions() {
		const swipe = this.swipeNav.nativeElement;
		const sidemenu = document.getElementById('sidenavbg');

		this.hammerService.SwipeRight(swipe).subscribe((data) => {
			this.addNav()
		});

		this.hammerService.SwipeLeftDownClose(sidemenu).subscribe((data) => {
			if (data.swipe === 'left') {
				this.resetNav()
				history.pushState(null, null, location.href);
			}

			if (data.swipe === 'down') {
				this.resetNav()
			}
		});
	}
}

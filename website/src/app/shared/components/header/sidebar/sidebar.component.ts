import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, Inject, ElementRef, ViewChild } from '@angular/core';
import { DOCUMENT } from '@angular/common';

// SERVICES
import { GoogleAnalyticsService, AuthService, InstallPWAService } from '../../../../shared/services';

@Component({
	moduleId: module.id,
	selector: 'header-sidebar-app',
	templateUrl: 'sidebar.component.html',
	styleUrls: ['sidebar.component.scss']
})
export class HeaderSidebarComponent implements OnInit, OnDestroy {
	@Input() data: any = [];

	// SIDEBAR
	@Input() show: boolean;
	@Output() close: EventEmitter<boolean> = new EventEmitter();
	lists: any;

	// VIEWCHILD
	@ViewChild('sideMenu', { static: false }) sideMenu: ElementRef;

	constructor(
		@Inject(DOCUMENT) private document: Document,
		public GS: GoogleAnalyticsService,
		private AS: AuthService,
		public IS: InstallPWAService,
	) { }

	ngOnInit() {
		// SUBSCRIBE
		this._close();

		// RESET
		this.showMenu(0);
	}

	ngOnDestroy() {
		this.close.unsubscribe();
	}

	gEvent(name) {
		this.GS.event('link', `Header - ${name} (Category)`, 'click', 0);
	}

	showMenu(index: number) {
		this.lists = this.document.querySelectorAll('div[data-sidebar-id]');

		this.lists.forEach(element => {
			// IF MATCH
			if (Number(element.dataset.sidebarId) === index) {
				element.classList.remove('side-nav__container__content__section-right');
				element.classList.add('side-nav__container__content__section-visible');
			} else {
				// RESET
				element.classList.remove('side-nav__container__content__section-visible');
				element.classList.add('side-nav__container__content__section-right')
			}
		});
	}

	resetNav() {
		this.close.emit(false);
		this.document.body.classList.remove('is-active');
	}

	login() {
		return this.AS.isAuthenticated();
	}

	private url(i) {
		return i['name'].toLowerCase().replace(/(?:( and )|(&)|(,)|(\s)|[/])+/g, '-');
	}

	private _close() {
		this.close.subscribe((res) => {
			if (res) {
				this.document.body.classList.add('is-active');
			} else {
				this.document.body.classList.remove('is-active');
			}
		});
	}
}

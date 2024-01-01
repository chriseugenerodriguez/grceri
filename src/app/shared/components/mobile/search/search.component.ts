import {
	Component, OnInit, AfterViewInit, HostListener,
	ViewChild
} from '@angular/core';

// SERVICES
import { SearchBarService, AuthService, VoiceService, BarcodeService, HammerService, ModalService } from '../../../services';

// ROUTER
import { Router } from '@angular/router';

@Component({
	selector: 'mobile-search',
	templateUrl: './search.component.html'
})
export class MobileSearchComponent implements OnInit, AfterViewInit {
	@ViewChild('searchbarpopup', { static: false }) searchBarPopup: any;

	// STRING
	searchQuery: string;

	// STRING
	// load = require('../../../../../assets/img/blank.jpg');
	load = './assets/img/blank.jpg';

	constructor(
		private AS: AuthService,
		public VS: VoiceService,
		public SBS: SearchBarService,
		private router: Router,
		public BS: BarcodeService,
		private MS: ModalService,
		private hammerService: HammerService) {
		this.searchQuery = '';
	}

	ngOnInit() {
	}

	ngAfterViewInit() {
		this._hammerInteractions();

		this.SBS.searchBarPopup = this.searchBarPopup;
	}

	private url(i) {
		if (i) {
			return i.toLowerCase().replace(/(?:( and )|(&)|(,)|(\s)|[/])+/g, '-');
		}

		return '';
	}

	private removeLeadingAndTrailingSpace(query) {
		query = query.trim();
		query = query.replace(/^\s+|\s+$/g, '');

		return query;
	}

	private _hammerInteractions() {
		let el = this.searchBarPopup.nativeElement;
		if (el) {
			this.hammerService.SwipeLeftDownClose(el).subscribe((data) => {
				if (data.swipe === 'down') {
					this.MS.close();
				}
				if (data.swipe === 'left') {
					this.MS.close();
					history.pushState(null, null, location.href);
				}
			});
		}
	}

	search(event) {
		let value = event.target.value;

		if (value === '') {
			return false;
		}

		let query: string = this.removeLeadingAndTrailingSpace(value);

		if (!this.AS.isAuthenticated()) {
			this.SBS.setRecentlySearchedText(query);
		} else {
			this.SBS.setRecentlySearchedTextToAPI(query);
		}

		this.router.navigate(['/search'], { queryParams: { cat_id: '', query } });

		this.SBS.disableSeachPopup();
	}

	removeAllRecentlySearchedText() {
		this.SBS.clearAllRecetlySearcedText();
	}
}

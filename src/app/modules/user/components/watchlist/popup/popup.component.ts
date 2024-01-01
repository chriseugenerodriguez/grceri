import { Component, Input, ViewChild, AfterViewInit, ViewEncapsulation } from '@angular/core';

// SERVICES
import { ModalService } from '../../../../../shared/services';

@Component({
	moduleId: module.id,
	selector: 'watchlist-popup',
	templateUrl: 'popup.component.html',
	styleUrls: ['popup.component.scss'],
	encapsulation: ViewEncapsulation.None
})

// CLASS
export class WatchlistPopupComponent implements AfterViewInit {
	@ViewChild('popup', {static: false}) watchlistPopup: any;

	// OBJECT
	data: any;
	date: any = {};

	// STRING
	// load = require('../../../../../../assets/img/blank.jpg');
	load = './assets/img/blank.jpg';

	constructor(
		private MS: ModalService
	) {
		this.tileData();
	}

	ngAfterViewInit() {
		this.MS.watchListsPopupModal = this.watchlistPopup;
	}

	private tileData() {
		this.MS.watchList$.subscribe((res) => {
			if (res) {
				this.data = res;

				this.date[0] = res.updatedAt.split('T')[0].split('-');
				this.date[1] = res.lastViewed.split('T')[0].split('-');

				this.date[0] = `${this.date[0][1]}/${this.date[0][2]}/${this.date[0][0]}`;
				this.date[1] = `${this.date[1][1]}/${this.date[1][2]}/${this.date[1][0]}`;
			}
		});
	}
}

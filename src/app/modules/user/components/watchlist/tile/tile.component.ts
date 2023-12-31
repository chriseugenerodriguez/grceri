import { Component, OnInit, OnChanges, Input, OnDestroy } from '@angular/core';

// RXJS
import { Subscription } from 'rxjs';

// SERVICES
import { LocalStorage, UserAPIService, ModalService } from '../../../../../shared/services';

@Component({
	moduleId: module.id,
	selector: 'watchlist-tile',
	templateUrl: 'tile.component.html',
	styleUrls: ['tile.component.scss']
})

// CLASS
export class WatchlistTileComponent implements OnInit, OnChanges, OnDestroy {
	@Input() data: any;
	@Input('bookmarked') productAddedToBookmark: boolean;

	// STRING
	load = require('../../../../../../assets/img/blank.jpg');

	// OBJECT
	config = {
		class: 'watchlist-popup',
		animated: false,
		backdrop: true
	};

	// SUBSCRIPTIONS
	subscriptions: any;

	constructor(
		private LS: LocalStorage,
		private US: UserAPIService,
		public MS: ModalService
	) {
		this.subscriptions = new Subscription();
	}

	ngOnInit(): void {
		this.MS.data$.next(undefined);
	}

	ngOnChanges(): void {

	}

	ngOnDestroy(): void {
		this.subscriptions.unsubscribe();
	}

	bookmark() {
		if (this.productAddedToBookmark === undefined) {
			return false;
		}
		let message: any = this.MS.processModalAlertInformation('clear-message', 'confirmed');
		this.MS.data$.next(message);
		let userId = this.LS.get('userId');
		if (userId) {
			let productObject = {
				uid: userId,
				productID: this.data.productId
			};

			if (this.productAddedToBookmark === false) {
				this.subscriptions.add(this.US.postProduct(productObject).subscribe((res: any) => {
					if (res.success) {
						this.productAddedToBookmark = true;
						message = this.MS.processModalAlertInformation('success', this.data.title + ' has been added to your favorites ');
						this.MS.data$.next(message);
					}
				}, (error) => {
					message = this.MS.processModalAlertInformation('danger', 'Error when adding product to your favorites ');
					this.MS.data$.next(message);
				}));
			} else {
				this.subscriptions.add(this.US.deleteProduct(productObject).subscribe((res: any) => {
					if (res.success) {
						this.productAddedToBookmark = false;

						message = this.MS.processModalAlertInformation('success', this.data.title + ' has been removed from your favorites. ');
						this.MS.data$.next(message);
					}
				}, (error) => {
					message = this.MS.processModalAlertInformation('danger', 'Error when removing product from favorites. ');
					this.MS.data$.next(message);
				}));
			}
		} else {

		}
	}

	delete() {
		let message: any = this.MS.processModalAlertInformation('clear-message', 'confirmed');
		this.MS.data$.next(message);
		let userId = this.LS.get('userId');

		if (userId) {
			let productObject = {
				uid: userId,
				productID: this.data.productId
			};

			this.subscriptions.add(this.US.removeFromWatchList(productObject).subscribe((res: any) => {
				if (res.success) {
					message = this.MS.processModalAlertInformation('delete-watchlist-item', this.data.title + ' has been successfully removed. ');
					this.MS.data$.next(message);
				}
			}, (error) => {
				message = this.MS.processModalAlertInformation('danger', 'Error when removing product ');
				this.MS.data$.next(message);
			}));
		}
	}
}

import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

// SEO
import { Meta, Title } from '@angular/platform-browser';

// SERVICES
import { LocalStorage, ModalService, PlanAPIService, HttpCancelService, UserAPIService, SessionStorage, SortingService, HammerService } from '../../../../shared/services';

// RXJS
import { Subscription } from 'rxjs';
import { Subject } from 'rxjs/internal/Subject';

// BOOTSTRAP
import { AlertComponent } from 'ngx-bootstrap/alert';

// ENV
import { environment } from '../../../../../environments/environment';

@Component({
	moduleId: module.id,
	selector: 'watchlist',
	templateUrl: 'watchlist.component.html',
	styleUrls: ['watchlist.component.scss'],
})
export class WatchlistComponent implements OnInit, OnDestroy, AfterViewInit {

	@ViewChild('watchlist', { static: false }) watchListHeader: ElementRef;
	@ViewChild('watchlistcontainer', { static: false }) watchListContainer: ElementRef;

	// NUMBER
	id: number = this.LS.get('userId');

	// SUBSCRIPTIONS
	_subscriptions: any = new Subscription();

	// ARRAY
	nitems = Array(10).fill(1);
	message: Array<object> = [];

	// BOOLEAN
	loading = false;

	// OBJECT
	watchlists = [];
	bookmarkList: any[] = [];

	// NUMBER
	watchlistsMaxLimit: number;
	watchlistsCloseLimit: number;

	constructor(
		private US: UserAPIService,
		private LS: LocalStorage,
		private meta: Meta,
		private title: Title,
		public SS: SortingService,
		private MS: ModalService,
		private _sessionStorage: SessionStorage,
		private _planAPIService: PlanAPIService,
		private httpCancelService: HttpCancelService,
		private hammerService: HammerService
	) {
		this.meta.updateTag({ name: 'robots', content: 'noindex, nofollow' });
		this.title.setTitle('My Watchlists - grceri');
	}
	ngAfterViewInit(): void {
		this._hammerInteractions();
	}

	ngOnInit() {
		this.MS.data$.next(undefined);
		this.getWatchlists();
		this.fetchModalMessage();
		this.getSavedProducts();
	}

	ngOnDestroy() {
		this._subscriptions.unsubscribe();

		this.httpCancelService.cancelPendingRequests();
		if (!environment.production && !this.httpCancelService) {
			console.log('canceled pending request');
		}
	}

	private _fetchPlanLimits() {
		this._subscriptions.add(this._planAPIService.getPlanLimits().subscribe((res) => {
			if (res && res.planLimits && res.planLimits['watchlist'] && res.plan !== 'Elite') {
				this.watchlistsMaxLimit = res.planLimits['watchlist'];

				this.watchlistsCloseLimit = this._planAPIService.getMaxCloseLimits(this.watchlistsMaxLimit);

				this._watchlistsUserRestriction();
			}
		}));
	}

	private fetchModalMessage(): void {
		this._subscriptions.add(
			this.MS.fetchModalData().subscribe(res => {
				if (res) {
					if (res.type === 'delete-watchlist-item' && res.value) {
						this.message = [];
						this._message('success', res.value, res.linkTitle, res.listId);
						this.getWatchlists();

						this._sessionStorage.set('refreshPlanLimit', true);
					} else if (res.type === 'clear-message') {
						this.message = [];
					} else if (res.type === 'watchlist-close-limit-error') {
						this.message = [];
						this._message(res.type, res.value, res.linkTitle, res.listId);
					} else if ((res.type === 'success' || res.type === 'danger') && res.value) {
						this.message = [];
						this._message(res.type, res.value, res.linkTitle, res.listId);
					}
				}
			})
		);
	}

	private _message(a: any, b: any, c: any = '', d: any) {
		this.message.push({
			type: a,
			value: b,
			linkTitle: c,
			listId: d,
		});
	}

	private _close(a: AlertComponent) {
		this.message = this.message.filter(i => i !== a);
	}

	private getSavedProducts() {
		this._subscriptions.add(
			this.US.getSaved(this.id).subscribe((res: any) => {
				if (res) {
					this.bookmarkList = res;
				}
			})
		);
	}

	private getWatchlists() {
		if (this.id) {
			this.loading = true;

			this._subscriptions.add(
				this.US.getWatchlists(this.id).subscribe(
					res => {
						if (!environment.production) {
							console.log('watchlist products', res);
						}

						// SEND TO SORT
						this.SS.results(res, 'title', 5, 10000, 2, 0);
					},
					err => {
						if (!environment.production) {
							console.log('an error has occured', err);
						}

						// LOADING
						this.loading = false;

						this.watchlists = [];
					},
					() => {
						// LOADING
						this.loading = false;

						this._fetchPlanLimits();
					}
				));

			this._subscriptions.add(
				this.SS.next$.subscribe((res) => {
					this.watchlists = res;
				}));
		}
	}

	private _watchlistsUserRestriction() {
		let watchlistsLength: number = this.watchlists.length;

		if (watchlistsLength === this.watchlistsMaxLimit) {
			let message: any = this.MS.processModalAlertInformation('watchlist-close-limit-error', 'You have reached your max. ');
			this.MS.data$.next(message);
		} else if (watchlistsLength >= this.watchlistsCloseLimit) {
			let watchlistsLeft: number = this.watchlistsMaxLimit - watchlistsLength;
			let message: any = this.MS.processModalAlertInformation('watchlist-close-limit-error', 'You are getting close your max, you only have ' + watchlistsLeft + ' left. ');
			this.MS.data$.next(message);
		}
	}

	private _hammerInteractions() {
		if (this.watchListHeader.nativeElement) {
			this.hammerService.SwipeLeftDownClose(this.watchListHeader.nativeElement).subscribe((data) => {
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

	checkItemBookmarked(productId: number): boolean {
		let found: any = this.bookmarkList.find(obj => obj.productId === productId);
		if (found) {
			return true;
		}

		return false;
	}
}

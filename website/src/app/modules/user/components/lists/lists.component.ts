import { Component, OnInit, OnDestroy } from '@angular/core';

// SEO
import { Meta, Title } from '@angular/platform-browser';

// SERVICES
import { LocalStorage, CommonService, ExcelService, ListLabelAPIService, SessionStorage, PlanAPIService, HttpCancelService, ModalService, AuthService, ShoppingListAPIService, SortingService } from '../../../../shared/services';

// INTERFACES
import { IList } from '../../../../shared/interfaces';

// ROUTER
import { Router } from '@angular/router';

// BOOTSTRAP
import { AlertComponent } from 'ngx-bootstrap/alert';

// SUBSCRIPTIONS
import { Subscription } from 'rxjs';

// ENV
import { environment } from '../../../../../environments/environment';

@Component({
	moduleId: module.id,
	selector: 'lists',
	templateUrl: 'lists.component.html',
	styleUrls: ['lists.component.scss'],
})

// CLASS
export class ListsComponent implements OnInit, OnDestroy {
	// OBJECT
	lists = [];
	section = [];
	config = {
		class: 'modal-popup',
		animated: false,
		backdrop: true,
	};

	// NUMBER
	id: number = this.LS.get('userId');

	// STRING
	name = 'My Lists';
	url: string;
	selectedListId: string;

	// BOOLEAN
	loading = false;
	discover: boolean;

	// ARRAY
	nitems = Array(6).fill(1);
	message: Array<object> = [];
	userLabels: string[];
	filteredLabels: string[] = [];
	listLabels: any = {};

	// NUMBER
	listsMaxLimit: number;
	listsCloseLimit = 0;

	// SUBSCRIPTIONS
	private _subscriptions: any = new Subscription();

	constructor(
		private router: Router,
		public AS: AuthService,
		public MS: ModalService,
		private LS: LocalStorage,
		private SLS: ShoppingListAPIService,
		private _planAPIService: PlanAPIService,
		private meta: Meta,
		private title: Title,
		private _sessionStorage: SessionStorage,
		private _commonService: CommonService,
		private _excelService: ExcelService,
		private httpCancelService: HttpCancelService,
		public listLabelService: ListLabelAPIService,
		private SS: SortingService
	) { }

	ngOnInit() {
		this.MS.data$.next(undefined);
		this._init();
		this._getLists();
		this.refreshUserLists();
		this._listUpdatedInfoMessage();
		this._getUserLabels();
	}

	ngOnDestroy() {
		this._subscriptions.unsubscribe();

		this.httpCancelService.cancelPendingRequests();
		if (!environment.production && !this.httpCancelService) {
			console.log('canceled pending request');
		}
	}

	private _init() {
		let userId: number = this.LS.get('userId');
		this.listLabelService.processListLabels(userId).subscribe((res) => res);
	}

	private _getUserLabels() {
		this._subscriptions.add(this.listLabelService.getUserLabels().subscribe((res) => {
			if (res) {
				this.userLabels = res;
			}
		}))
	}

	private _listUpdatedInfoMessage() {
		if (this._sessionStorage.get('listDeleted') !== null) {
			this._message('success', 'List has been successfully deleted.');
			this._sessionStorage.remove('listDeleted');
		}
	}

	private _fetchPlanLimits() {
		this._subscriptions.add(this._planAPIService.getPlanLimits().subscribe((res) => {
			if (res && res.planLimits && res.planLimits['shoppingLists'] && res.plan !== 'Elite') {
				this.listsMaxLimit = Number(res.planLimits['shoppingLists']);

				this.listsCloseLimit = this._planAPIService.getMaxCloseLimits(this.listsMaxLimit);
				if (!environment.production) {
					console.log('close limit', this.listsCloseLimit);
				}

				this._listsUserRestriction(this.listsMaxLimit, this.lists.length);
			}
		}));
	}

	private refreshUserLists() {
		this._subscriptions.add(this.MS.fetchModalData().subscribe(
			res => {
				if (res && res.value) {
					switch (res.type) {
						case 'update-list-labels':
							this.listLabels[res.value] = res.listId;
							this.filteredLabels = [];
							this.lists = this.listLabelService.userLists;
							break;
						case 'dynamic-change-label':
							this.selectedListId = res.listId;
							this.MS.openChangeLabelModal(this.config);
							break;
						case 'empty-message':
							this.message = [];
							break;
						case 'export-list':
							this._exportList(res.listId);
							break;
						case 'success-list-created':
							this._sessionStorage.set('refreshPlanLimit', true);
							this._message('success', res.value);
							break;
						case 'membership-watchlist-error':
							if (res.value === 'List has been successfully created.') {
								this._getLists();
							}
							break;
						case 'membership-list-error':
							this._message(res.type, res.value);
							break;
						case 'list-close-limit-error':
							this.message = [];
							this._message(res.type, res.value, res.linkTitle, res.listId);
							break;
						case 'success-options-deletelist':
							this._deleteList(res.listId);
							break;
						case 'danger':
							this._message(res.type, res.value);
							break;
						case 'success':
							this._message(res.type, res.value);
							break;

						default:
							break;
					}
				}
			},
			error => error
		));
	}

	private _deleteList(listId: any) {
		this._subscriptions.add(this.SLS.deleteShoppinglist(this.id, listId).subscribe((res: any) => {
			if (res.success) {
				this.listTileAction({ type: 'delete', listId: listId });
			}
		}));
	}

	private _getLists() {
		this.url = this.router.url;

		if (this.url === '/lists/discover') {
			// TITLE
			this.name = 'Discover Lists';
			this.loading = true;

			this._subscriptions.add(this.SLS.getDiscoverLists().subscribe(
				res => {
					if (!environment.production) {
						console.log('my lists', res);
					}

					this.SS.results(res, 'title', 5, 10000, 3, 3);
				},
				err => {
					if (!environment.production) {
						console.log('an error has occured', err);
					}

					// LOADING
					this.loading = false;

					this.lists = [];
				},
				() => {
					// LOADING
					this.loading = false;

					if (!environment.production) {
						console.log('discovered lists', this.lists);
					}
				}
			));
		}

		if (this.id) {
			if (this.url === '/lists') {
				// TITLE
				this.name = 'My Lists';
				this.loading = true;

				this._subscriptions.add(this.SLS.getLists(this.id).subscribe(
					res => {
						if (!environment.production) {
							console.log('my lists', res);
						}

						this.SS.results(res, 'title', 5, 10000, 3, 3);
					},
					err => {
						if (!environment.production) {
							console.log('an error has occured', err);
						}

						// LOADING
						this.loading = false;

						this.lists = [];
					},
					() => {
						// LOADING
						this.loading = false;

						if (!environment.production) {
							console.log('lists', this.lists);
						}

						this.listLabelService.userLists = this.lists;

						this._listsLabels();
						this._fetchPlanLimits();
					}
				));
			}
			if (this.url === '/lists/following') {
				// TITLE
				this.name = 'My Following Lists';
				this.loading = true;

				this._subscriptions.add(this.SLS.getFollowedLists(this.id).subscribe(
					res => {
						if (!environment.production) {
							console.log('followed lists', res);
						}

						this.SS.results(res, 'title', 5, 10000, 3, 3);
					},
					err => {
						if (!environment.production) {
							console.log('an error has occured', err);
						}

						// LOADING
						this.loading = false;

						this.lists = [];
					},
					() => {
						// LOADING
						this.loading = false;

						if (!environment.production) {
							console.log('followed lists', this.lists);
						}
					}
				));
			}
		} else {
			this.lists = [];
		}

		if (this.url === '/lists' || this.url === '/lists/following') {
			// META
			this.meta.updateTag({ name: 'robots', content: 'noindex, nofollow' });
		}

		this._subscriptions.add(
			this.SS.next$.subscribe((res) => {
				this.lists = res;

				if (this.lists !== undefined) {
					this.discover = false;

					if (this.url === '/lists/discover' || this.url === '/lists/following') {
						this.discover = true;
					} else {
						this.discover = false;
					}
				}
			}));

		// META
		this.title.setTitle(`${this.name} - grceri`);
	}

	private _listsLabels() {
		this.lists.forEach(element => {
			this._getUserListLabels(element.id);
		});
	}

	private _getUserListLabels(listId: string) {
		this._subscriptions.add(this.listLabelService.getUserListLabels(this.id, listId).subscribe((res) => {
			if (res) {
				this.listLabels[listId] = res;
			}
		}));
	}

	private _listsUserRestriction(max: number, listsLength: number) {
		if (max <= listsLength) {
			let message: any = this.MS.processModalAlertInformation('list-close-limit-error', 'You have reached your max. ');
			this.MS.data$.next(message);
		} else {
			let listsLeft: number = max - listsLength;
			let message: any = this.MS.processModalAlertInformation('list-close-limit-error', 'You are getting close your max, you only have ' + listsLeft + ' left. ');
			this.MS.data$.next(message);
		}
	}

	private _message(a: any, b: any, c: any = '', d: any = '') {
		this.message.push({
			type: a,
			value: b,
			linkTitle: c,
			listId: d
		})
	}

	close(a: AlertComponent) {
		this.message = this.message.filter((i) => i !== a);
	}

	listTileAction($event: any) {
		if ($event) {
			switch ($event.type) {
				case 'delete':
					this.lists = this.lists.filter((data: IList) => data.id !== $event.listId);
					this._message('success', 'List has been deleted successfully.');
					break;
				case 'open-options':
					this.message = [];
					this.MS.obj['listId'] = $event.listId;
					this.MS.openListOptionsModal(this.config);
				case 'refresh-labels':
					this.listLabelService.listLabel$.next($event.labels);
					this._getUserLabels();
					this.filteredLabels = [];
					break;
				default:
					break;
			}
		}
	}

	private _exportList(listId: any) {
		let list: any = this.lists.find((list: IList) => list.id === listId);

		if (list.productCount && list.productCount > 0) {
			let items: any[] = list['list'].map(obj => {
				return {
					Title: obj.title,
					UPC: obj.upc,
					URL: 'https://grceri.com/grocery/' + this._commonService.product(obj.title) + '/' + obj.productId,
					Brand: obj.brand,
					Price: obj.price,
				};
			});

			this._excelService.exportAsExcelFile(items, list['title']);
		} else {
			this._message('danger', 'The list has no item to export.');
			this.MS.close();
		}
	}

	refreshLists($event: any) {
		if ($event) {
			this.lists = $event;
		}
	}

	listLabelActions($event: any) {
		if ($event) {
			this._childComponentActions($event);
		}
	}

	editLabelActions($event: any) {
		if ($event) {
			this._childComponentActions($event);
		}
	}

	mobileFilterLabels($event) {
		if ($event) {
			this._childComponentActions($event);
		}
	}

	private _childComponentActions($event) {
		switch ($event.type) {
			case 'refresh-labels':
				this.listLabelService.listLabel$.next($event.labels);
				this._listsLabels();
				break;
			case 'filter-labels':
				const filteredLabels: string[] = $event.labels;
				this.lists = this._getFilteredLists(filteredLabels);
				break;
			default:
				break;
		}
	}

	refreshListsByLabels($event) {
		if ($event) {
			this._childComponentActions($event);
		}
	}

	private _getFilteredLists(labels: string[] = []): any[] {
		if (labels.length <= 0) {
			return this.listLabelService.userLists;
		}

		const lists = [];

		for (const [key, value] of Object.entries(this.listLabels)) {
			const flag: boolean = this._commonService.hasSimilarArrayValue(value, labels);
			if (flag) {
				const list = this.listLabelService.userLists.find((list) => list.id === key);
				lists.push(list);
			}
		}

		return lists;
	}
}

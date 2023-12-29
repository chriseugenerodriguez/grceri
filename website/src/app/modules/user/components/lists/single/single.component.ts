import { Component, OnInit, OnDestroy, Inject, HostListener, PLATFORM_ID } from '@angular/core';

// ROUTER
import { Router, ActivatedRoute } from '@angular/router';

// SEO
import { Meta } from '@angular/platform-browser';

// SERVICES
import {
	ModalService,
	DeviceService,
	LocalStorage,
	ExcelService,
	ShoppingListAPIService,
	HttpCancelService,
	SessionStorage,
	ListLabelAPIService,
	CommonService
} from '../../../../../shared/services';
import { ListService } from '../../../services/list.service';

// BOOTSTRAP
import { AlertComponent } from 'ngx-bootstrap/alert';

// RXJS
import { Subscription } from 'rxjs';

// ENV
import { environment } from '../../../../../../environments/environment';

// PLATFORM
import { isPlatformBrowser } from '@angular/common';

@Component({
	moduleId: module.id,
	selector: 'lists-single',
	templateUrl: 'single.component.html',
	styleUrls: ['single.component.scss'],
})

// CLASS
export class ListsSingleComponent implements OnInit, OnDestroy {
	config = {
		animated: false,
		backdrop: true,
	};

	// ARRAY
	nitems = Array(10).fill(1);

	// NUMBER
	id: number = this.LS.get('userId') === null || this.LS.get('userId') === undefined ? 0 : this.LS.get('userId');;

	// STRING
	load = require('../../../../../../assets/img/blank.jpg');
	listId: any;

	// ARRAY
	message: Array<object> = [];
	listLabels: any;
	userLabels: string[];

	// SUBSCRIPTIONS
	subscriptions: any = new Subscription();

	@HostListener('window:resize', ['$event'])
	onResize(event) {
		if (isPlatformBrowser(this.platform)) {
			this.message = [];
		}
	}

	constructor(
		@Inject(PLATFORM_ID) private platform: any,
		public DS: DeviceService,
		private LS: LocalStorage,
		private SLS: ShoppingListAPIService,
		private MS: ModalService,
		private router: ActivatedRoute,
		private route: Router,
		private ES: ExcelService,
		private meta: Meta,
		private httpCancelService: HttpCancelService,
		public commonService: CommonService,
		public listService: ListService,
		private _listLabelService: ListLabelAPIService,
		private _sessionStorage: SessionStorage
	) {
		this.meta.updateTag({ name: 'robots', content: 'noindex, nofollow' });
	}

	ngOnInit() {
		this.MS.data$.next(undefined);
		this._init();
		this.fetchConfirmationMessage();
		this.getListId();
		this.getUserListLabels();
	}

	ngOnDestroy() {
		this.subscriptions.unsubscribe();
		if (this.listService.subscriptions) {
			this.listService.subscriptions.unsubscribe();
		}

		this.httpCancelService.cancelPendingRequests();
		if (!environment.production && !this.httpCancelService) {
			console.log('canceled pending request');
		}
	}

	private _init() {
		let userId: number = this.LS.get('userId');
		this._listLabelService.processListLabels(userId).subscribe((res) => res);
	}

	getUserListLabels() {
		let userId: number = this.LS.get('userId');
		this.subscriptions.add(this._listLabelService.getUserListLabels(userId, this.listId).subscribe((res) => {
			if (res) {
				this.listLabels = res;
			}
		}));
	}

	private _message(a: any, b: any, c: any = '', d: any = 0) {
		this.message.push({
			type: a,
			value: b,
			linkTitle: c,
			listId: d,
		});
	}

	close(a: AlertComponent) {
		this.message = this.message.filter(i => i !== a);
	}

	undoAddListItem(listId: any, productID: number): void {
		this.listService.isLoggedIn(this.listService.single);

		let obj: any = {
			uid: Number(this.id),
			listId,
			productID: Number(productID),
		};
		this.subscriptions.add(this.SLS.deleteShoppinglistItem(this.id, listId, productID).subscribe(res => {
			let message: any = this.MS.processModalAlertInformation('success', 'Action undone.');
			this.MS.openMessageModal(this.config);
			this.MS.data$.next(message);
			this.updateList();
		}));
	}

	undoAddFollowList($event: any): void {
		this.listService.isLoggedIn(this.listService.single);

		$event.preventDefault();
		this.message = [];
		this.MS.data$.next(undefined);

		this.subscriptions.add(this.SLS.unfollowShoppinglist(this.id, this.listId).subscribe((res: any) => {
			if (res.success) {
				this.listService.followListTitle = true;
				let message: any = this.MS.processModalAlertInformation('success', 'Action undone.');
				this.MS.data$.next(message);
			}
		}));
	}

	setAlertType(type: string): string {
		if (type === 'undo-following') {
			return 'success';
		}

		return type;
	}

	private fetchConfirmationMessage(): void {
		this.subscriptions.add(this.MS.fetchModalData().subscribe((res: any) => {
			if (res) {
				switch (res.type) {
					case 'empty-message':
						this.message = [];
						break;
					case 'success-deleteall':
						if (this.listService.checked.length > 0) {
							let list: object = {
								'name': this.listService.single['title'],
								'description': this.listService.single['description'],
								'visibility': this.listService.single['visibility'],
								'list': []
							};

							this.subscriptions.add(this.SLS.updateShoppinglistItems(this.id, this.listId, list).subscribe(res => {
								let message: any = this.MS.processModalAlertInformation('success', 'Products have been deleted successfully. ');
								this.MS.data$.next(message);
								this.listService.single['list'] = [];
								this.listService.checked = [];
							}));
						}
						break;
					case 'success-selectall':
						Array.prototype.push.apply(this.listService.checked, this.listService.single['list']);
						this.listService.single['list'] = [];
						break;
					case 'success-uncheckall':
						if (this.listService.checked.length > 0) {
							Array.prototype.push.apply(this.listService.single['list'], this.listService.checked);
							this.listService.checked = [];
						}
						break;
					case 'success-deletecompleted':
						if (this.listService.checked.length > 0) {
							let productIDS: any = this.listService.single['list'].map(obj => obj.productId);
							let list: object = {
								'name': this.listService.single['title'],
								'description': this.listService.single['description'],
								'visibility': this.listService.single['visibility'],
								'list': productIDS
							};

							this.subscriptions.add(this.SLS.updateShoppinglistItems(this.id, this.listId, list).subscribe(res => {
								let message: any = this.MS.processModalAlertInformation('success', 'Products have been deleted successfully. ');
								this.MS.data$.next(message);
								this.listService.checked = [];
							}));
						}
						break;
					case 'success-movecopy':
						this.subscriptions.add(this.SLS.userShoppingList(this.id).subscribe((res: any) => {
							if (res) {
								let message: any = this.MS.processModalAlertInformation('process-movecopy', 'confirmed');
								this.MS.data$.next(message);
								res = res.length > 0 ? res.filter((list) => list.id !== this.listService.single['id']) : [];
								this.SLS.shoppingList = res;
								this.SLS.selectedShoppingList = 0;
								this.MS.openSelectListsModal(this.config);
							}
						}));
						break;
					case 'success-process-movecopy':
						let productIDS: any[] = (this.listService.checked && this.listService.checked.length > 0) ? this.listService.checked.map(obj => obj.productId) : [];

						this.subscriptions.add(this.SLS.getList(this.id, res.listId).subscribe((data: any) => {
							let selectedIDS: any[] = (data['list'] && data['list'].length > 0) ? data['list'].map((obj) => obj.productId) : [];
							selectedIDS = selectedIDS.concat(productIDS);
							selectedIDS = [...new Set(selectedIDS)];

							let list: object = {
								'name': data['title'],
								'description': data['description'],
								'visibility': data['visibility'],
								'list': selectedIDS
							}

							this.subscriptions.add(this.SLS.updateShoppinglistItems(this.id, data.id, list).subscribe(
								res => {
									// if (res) {
									let message: any = this.MS.processModalAlertInformation('success', 'Product has been successfully moved. ');
									this.MS.data$.next(message);
									// }
								},
								error => {
									let message: any;
									if (error.status === 400) {
										message = this.MS.processModalAlertInformation('danger', 'Product already moved to the list');
									} else {
										message = this.MS.processModalAlertInformation('danger', 'Error when adding product');
									}
									this.MS.data$.next(message);
									if (!environment.production) {
										console.log('Shopping List Error');
									}
								}
							));
						}));
						break;
					case 'success-deletelist':
						this.subscriptions.add(this.SLS.deleteShoppinglist(this.id, this.listId).subscribe((res: any) => {
							if (res.success) {
								this._sessionStorage.set('refreshPlanLimit', true);
								this._sessionStorage.set('listDeleted', true);
								this.route.navigate(['/lists']);
							}
						}));
						break;
					case 'success-exportlist':
						let list: any[] = this.listService.single['list'].map(obj => {
							return {
								Title: obj.title,
								UPC: obj.upc,
								URL: 'https://grceri.com/grocery/' + this.commonService.product(obj.title) + '/' + obj.productId,
								Brand: obj.brand,
								Price: obj.price,
							};
						});
						this.ES.exportAsExcelFile(list, this.listService.single['title']);
						break;

					default:
						if ((res.type === 'success' || res.type === 'danger' || res.type === 'undo-following') && res.value) {
							this.message = [];
							if (res.value) {
								this._message(res.type, res.value, res.linkTitle, res.listId);
							}
						}
						break;
				}
			}
		}));
	}

	private getListId() {
		this.listService.isLoggedIn(this.listService.single);

		this.subscriptions.add(this.router.paramMap.subscribe(params => {
			this.listId = params.get('id');

			this.listService.listId = this.listId;
			this.listService.getList();
			this.listService.getFollowingList();
		}));
	}

	private updateList() {
		this.listService.isLoggedIn(this.listService.single);

		this.subscriptions.add(this.SLS.getList(this.id, this.listId).subscribe(res => {
			this.listService.single = res;
		}));
	}
}

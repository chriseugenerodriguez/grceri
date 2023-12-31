import { Injectable } from '@angular/core';

// SEO
import { Title } from '@angular/platform-browser';

// ROUTER
import { Router } from '@angular/router';

// RXJS
import { Subscription } from 'rxjs';

// SERVICES
// import { ShoppingListAPIService } from '../../api/shopping-list.service';
// import { UserAPIService } from '../../api/user.service';
// import { LocalStorage } from '../../local-storage/local-storage.service';
// import { AuthService } from '../../auth/auth.service';
// import { ModalService } from '../../modal/modal.service';
import {
	ShoppingListAPIService, UserAPIService,
	LocalStorage, AuthService, ModalService
} from '../../../shared/services';

// ENV
import { environment } from '../../../../environments/environment';

@Injectable()
export class ListService {
	loading: boolean;
	followListTitle: boolean;
	hideCompleted: boolean;

	user: any[];
	checked: any[];
	single: {};
	followingLists: any[];
	subscriptions: any;
	listId: any;
	config = {
		animated: false,
		backdrop: true,
	};

	userId: number = this._LS.get('userId') === null || this._LS.get('userId') === undefined ? 0 : this._LS.get('userId');

	constructor(
		private _router: Router,
		private _SLS: ShoppingListAPIService,
		private _LS: LocalStorage,
		private _AS: AuthService,
		private _US: UserAPIService,
		private _MS: ModalService,
		private _title: Title,
	) {
	}

	getList() {
		this._resetList();
		this.isLoggedIn(this.single);

		this.subscriptions.add(this._SLS.getList(this.userId, this.listId).subscribe(
			res => {
				this.single = res;

				this.isLoggedIn(res);

				if (this.single['isOwner']) {
					// TITLE
					this._title.setTitle(`${this.single['title']} | My Lists - grceri`);

					this._getSaved();
					this._getViewed();
				} else {
					// TITLE
					this._title.setTitle(`${this.single['title']} | Discover Lists - grceri`);
				}

				this.loading = false;
			},
			err => {
				if (!environment.production) {
					console.log('an error has occured', err);
				}

				this.loading = false;
				this.single = [];
			},
			() => {
				this.loading = false;

				if (!environment.production) {
					console.log('service single list', this.single);
				}
			}
		));
	}

	private _resetList() {
		this.subscriptions = new Subscription();
		this.loading = true;
		this.followListTitle = true;
		this.hideCompleted = false;

		this.user = [];
		this.checked = [];
		this.single = {};
	}

	private _getSaved() {
		this.isLoggedIn(this.single);

		if (this.userId > 0) {
			this.subscriptions.add(this._US.getSaved(this.userId).subscribe(res => {
				this.user['favorites'] = res;
			}));
		} else {
			this.user['favories'] = null;
		}
	}

	private _getViewed() {
		this.isLoggedIn(this.single);

		if (this.userId > 0) {
			this.subscriptions.add(this._US.getViewedProducts(this.userId).subscribe(res => {
				this.user['viewed'] = res;
			}));
		} else {
			this.user['viewed'] = null;
		}
	}

	getFollowingList() {
		this.isLoggedIn(this.single);

		if (this.userId > 0) {
			this.subscriptions.add(this._SLS.getFollowedLists(this.userId).subscribe((res: any) => {
				this.followingLists = res;

				let followList: any = this.followingLists.find(obj => obj.id === this.listId);
				if (followList) {
					this.followListTitle = false;
				} else {
					this.followListTitle = true;
				}
			}));
		}
	}

	shareList(): void {
		let message: any = this._MS.processModalAlertInformation('share-list', 'confirmed', '', this.single['id']);
		this._MS.openShareListModal(this.config);
		this._MS.data$.next(message);
	}

	followList(): any {
		if (!this._AS.isAuthenticated()) {
			this._router.navigate(['/login']);
			return false;
		}

		let title: string = this.single['title'];

		if (this.followingLists === undefined) {
			return false;
		}
		this._MS.data$.next(undefined);
		if (this.followListTitle) {
			this.subscriptions.add(this._SLS.followShoppinglist(this.userId, this.listId).subscribe((res: any) => {
				if (res.success) {
					this.followListTitle = false;
					let message: any = this._MS.processModalAlertInformation('undo-following', 'You have successfully followed ' + title + ' list. ');
					this._MS.data$.next(message);
				}
			}));
		} else {
			this.subscriptions.add(this._SLS.unfollowShoppinglist(this.userId, this.listId).subscribe((res: any) => {
				if (res.success) {
					this.followListTitle = true;
					let message: any = this._MS.processModalAlertInformation('success', 'You have successfully unfollowed ' + title + ' list. ');
					this._MS.data$.next(message);
				}
			}));
		}
	}

	exportList() {
		this.isLoggedIn(this.single);

		let message: any = this._MS.processModalAlertInformation('exportlist', 'Are you sure to download the list? ');
		this._MS.openConfirmationModal(this.config);
		this._MS.data$.next(message);
	}

	updateListInformation(title: string, description: string, url: string) {
		this.subscriptions.add(this._SLS.getList(this.userId, url).subscribe(res => {
			// this.single = res;
			if (res) {
				let obj: object = {
					'list': res['list'].map(obj => obj.productId),
					'name': title,
					'visibility': res['visibility'],
					description,
				};

				this.subscriptions.add(this._SLS.updateShoppinglistItems(this.userId, res['id'], obj).subscribe((res: any) => {
					if (res.success) {
						let message: any = this._MS.processModalAlertInformation('success', 'List has been updated successfully. ');
						this._MS.data$.next(message);
						this.single['title'] = title;
					}
				}));
			}
		}));
	}

	deleteList() {
		let message: any = this._MS.processModalAlertInformation('deletelist', 'Are you sure to delete the list? ');
		this._MS.openConfirmationModal(this.config);
		this._MS.data$.next(message);
	}

	deleteAllItems(): any {
		this.isLoggedIn(this.single);

		if (this.checked.length <= 0) {
			return false;
		}
		let message: any = this._MS.processModalAlertInformation('deleteall', 'Are you sure to delete all items? ');
		this._MS.data$.next(message);
		this._MS.openConfirmationModal(this.config);
	}

	selectAll(): any {
		this.isLoggedIn(this.single);

		if (this.single['list'].length <= 0) {
			return false;
		}

		let message: any = this._MS.processModalAlertInformation('selectall', 'Are you sure to select all items? ');
		this._MS.data$.next(message);
		this._MS.openConfirmationModal(this.config);
	}

	deleteCompleted(): void {
		this.isLoggedIn(this.single);

		let message: any = this._MS.processModalAlertInformation('deletecompleted', 'Are you sure to complete deletion all items? ');
		this._MS.data$.next(message);
		this._MS.openConfirmationModal(this.config);
	}

	uncheckAll(): void {
		let message: any = this._MS.processModalAlertInformation('uncheckall', 'Are you sure to uncheck all items? ');
		this._MS.data$.next(message);
		this._MS.openConfirmationModal(this.config);
	}

	moveCopyItems(): void {
		let message: any = this._MS.processModalAlertInformation('movecopy', 'Are you sure to move/copy all items? ');
		this._MS.data$.next(message);
		this._MS.openConfirmationModal(this.config);
	}

	shareMobileList() {
		navigator = window.navigator as any;

		this.isLoggedIn(this.single);

		navigator.share({
			title: this._title.getTitle(),
			url: this._router.url.toString(),
		})
			.then(response => {
				console.log(response);
			})
			.catch(error => {
				console.log(error);
			});
	}

	toggleItemChecked(productId: any): boolean {
		let found: any = this.checked.find(obj => obj.productId === productId);

		return found ? true : false;
	}

	updateProductList($event: any, product: any): void {
		this.isLoggedIn(this.single);

		if ($event.currentTarget.checked) {
			this.checked.push(product);
			this.single['list'] = this.single['list'].filter(obj => obj.productId !== product.productId);
		} else {
			this.checked = this.checked.filter(obj => obj.productId !== product.productId);
		}
	}

	removeChecked($event: any, productId: number): void {
		this.isLoggedIn(this.single);

		if (!$event.currentTarget.checked) {
			let product: object = this.checked.find(obj => Number(obj.productId) === productId);
			this.single['list'].push(product);
			this.checked = this.checked.filter(obj => Number(obj.productId) !== productId);
		}
	}

	toggleShowCompleted(): void {
		this.hideCompleted = !this.hideCompleted;
	}

	isLoggedIn(res) {
		if (res !== null) {
			if (!this._AS.isAuthenticated() && res && res['isOwner']) {
				this._router.navigate(['/login']);
			}
		}
	}

}

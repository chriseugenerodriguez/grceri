import { Injectable, TemplateRef, NgZone } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

// ROUTER
import { Router } from '@angular/router';

// BOOTSTRAP
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

// SERVICE
import { ModalService } from '../modal/modal.service';
import { HammerService } from '../hammer/hammer.service';
import { LocalStorage } from '../local-storage/local-storage.service';
import { UserAPIService } from '../api/user.service';
import { AuthService } from '../auth/auth.service';

// ENVIRONMENT
import { environment } from '../../../../environments/environment';

@Injectable()
export class SearchBarService {
	// FLAGS
	seachBarDisabled: boolean;

	// VIEWS
	searchBarPopup: TemplateRef<any>;

	// BOOTSTRAP
	modalRef: BsModalRef;

	// PRODUCTS
	viewedProducts: any[];
	recentlySearched: any[];

	// MOBILE
	mobile: boolean;

	// OPTIONS
	config = {
		class: 'search-popup',
		animated: false,
		backdrop: false
	};
	selectedSortOption = 'productId';

	constructor(private modalService: BsModalService,
		public AS: AuthService,
		private LS: LocalStorage,
		private ngZone: NgZone,
		private router: Router,
		public UAS: UserAPIService,
		private MS: ModalService,
		private hammerService: HammerService) {
		this.seachBarDisabled = true;
		this.routerChangeEvent();
	}

	private routerChangeEvent() {
		this.router.events.subscribe((val) => {
			this.disableSeachPopup();
		});
	}

	private modalCallbackSubscriptions() {
		this.modalService.onHide.subscribe((result) => {
			if (result === 'backdrop-click') {
				this.disableSeachPopup();
			}
		});
	}

	openSearchBarPopup() {
		if (this.searchBarPopup && this.mobile) {
			this.openModal(this.searchBarPopup);
			this.modalCallbackSubscriptions();
		}
	}

	private openModal(template: TemplateRef<any>) {
		this.modalRef = this.modalService.show(template, this.config);
		this.loadRecentlyViewedProducts();
		this.loadRecentlySearched();
	}

	private loadRecentlyViewedProducts() {
		if (this.AS.isAuthenticated()) {
			this.loadRecentlyViewedProductsFromAPI();
		} else {
			this.loadRecentlyViewedProductsFromSession();
		}
	}

	private loadRecentlySearched() {
		if (this.AS.isAuthenticated()) {
			this.loadRecentlySearchedFromAPI();
		} else {
			this.loadRecentlySearchedFromSession();
		}
	}

	private loadRecentlyViewedProductsFromAPI() {
		let userId = this.LS.get('userId');

		this.UAS.getViewedProducts(userId, 5).subscribe((res: any) => {
			if (res) {

				this.ngZone.run(() => {
					// res = this.formatRecentlyViewedAPI(res);
					this.viewedProducts = res;

					if (!environment.production) {
						console.log('viewed', res);
					}
				});
			}
		});
	}

	// private formatRecentlyViewedAPI(viewedProducts: any[]){
	// 	let products = [];
	// 	if(viewedProducts.length > 0){
	// 		viewedProducts.forEach(element => {
	// 			let productObject = {
	// 				Title: element.title,
	// 				productId: element.productId,
	// 				image: element.productThumbnailUrl
	// 			};
	//
	// 			products.push(productObject);
	// 		})
	// 	}
	//
	// 	return products;
	// }

	private loadRecentlyViewedProductsFromSession() {
		let viewed_products = this.LS.get('viewed_products');

		if (viewed_products == null) {
			this.ngZone.run(() => {
				this.viewedProducts = [];
			});

			return false;
		}

		viewed_products = viewed_products.reverse();

		if (viewed_products.length > 5) {
			viewed_products = viewed_products.slice(0, 5);
		}

		this.ngZone.run(() => {
			this.viewedProducts = viewed_products;
		});
	}

	setRecentlySearchedText(searchQuery: any) {
		let recentlySearched = this.LS.get('recently_searched');

		if (!environment.production) {
			console.log('recentlySearched from Session', recentlySearched);
		}

		let searchedObject: object = {
			searchText: searchQuery
		}

		if (recentlySearched != null) {
			let searched: any[] = recentlySearched;
			let searchedText = searched.find((element: any) => element.text === searchQuery);
			if (searchedText === undefined) {
				searched.push(searchedObject);
				this.LS.set('recently_searched', searched);
			}
		} else {
			let searched: any[] = [];
			searched.push(searchedObject);
			this.LS.set('recently_searched', searched);
		}
	}

	setRecentlySearchedTextToAPI(searchQuery: any) {
		let userId = this.LS.get('userId');
		let searchObject = {
			searchText: searchQuery
		}

		this.UAS.postSearched(userId, searchObject).subscribe((res: any) => {
			if (res) {
				if (!environment.production) {
					console.log('save searched status', res);
				}
			}
		});
	}

	private loadRecentlySearchedFromAPI() {
		let userId = this.LS.get('userId');

		this.UAS.getSearched(userId).subscribe((res: any) => {
			if (res) {
				if (!environment.production) {
					console.log('recently searched', res);
				}

				this.ngZone.run(() => {
					this.recentlySearched = res;
				});
			}
		});
	}

	private loadRecentlySearchedFromSession() {
		let recently_searched = this.LS.get('recently_searched');

		if (recently_searched == null) {
			this.ngZone.run(() => {
				this.recentlySearched = [];
			});

			return false;
		}

		recently_searched = recently_searched.reverse();

		if (recently_searched.length > 5) {
			recently_searched = recently_searched.slice(0, 5);
		}

		if (!environment.production) {
			console.log('recently searched', recently_searched);
		}

		this.ngZone.run(() => {
			this.recentlySearched = recently_searched;
		});
	}

	enableSearchBarPopup() {
		this.seachBarDisabled = false;

		this.openSearchBarPopup();
	}

	disableSeachPopup() {
		this.seachBarDisabled = true;
		if (this.modalRef) {
			this.modalRef.hide();
		}
	}

	clearAllRecetlySearcedText() {
		if (this.AS.isAuthenticated()) {
			this.clearRecentlySearchedFromAPI();
		} else {
			this.clearRecentlySearchedFromSession();
		}
	}

	private clearRecentlySearchedFromAPI() {
		let userId = this.LS.get('userId');

		this.UAS.deleteAllRecentlySearched(userId).subscribe((res: any) => {
			if (res.success) {
				this.ngZone.run(() => {
					this.recentlySearched = [];
				});
			}
		});
	}

	private clearRecentlySearchedFromSession() {
		let recently_searched = this.LS.get('recently_searched');

		if (recently_searched !== null) {
			recently_searched = [];
			this.LS.set('recently_searched', recently_searched);

			this.ngZone.run(() => {
				this.recentlySearched = recently_searched;
			});
		}
	}
}

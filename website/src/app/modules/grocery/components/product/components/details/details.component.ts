import {
	Component, OnInit, OnChanges, AfterViewInit, Inject, PLATFORM_ID,
	EventEmitter, Input, Output, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';

// BOOTSTRAP
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AlertComponent } from 'ngx-bootstrap/alert';

// ROUTER
import { ActivatedRoute, Router, UrlSerializer } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

// INTERFACES
import { IProductDetails } from '../../../../../../shared/interfaces/product/product-details.interface';

// SERVICES
import {
	ProductAPIService, AuthService, UserAPIService, ModalService, PlanAPIService,
	ShoppingListAPIService, LocalStorage, GoogleAnalyticsService, DeviceService, SessionStorage
} from '../../../../../../shared/services';

// RXJS
import { Subject, Subscription } from 'rxjs';

// ENV
import { environment } from '../../../../../../../environments/environment.prod';

@Component({
	selector: 'product-details',
	templateUrl: 'details.component.html',
	styleUrls: ['details.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDetailsComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
	// INPUT
	@Input() productID: number;
	@Input() productVendors: any[];
	@Input() productImages: object;

	// OUTPUT
	@Output() getProductDetailsOutput: EventEmitter<any> = new EventEmitter<any>();

	// SUBSCRIPTIONS
	productDetailsSubscription: Subscription;
	userInformationSubscription: Subscription;
	userProductSavedSubscription: Subscription;
	userWishlistSubscription: Subscription;
	cartListModalSubscription: Subscription;
	fetchUserShoppingListSubscription: Subscription;
	fetchModalDataSubscription: Subscription;
	userShoppingListSubscription: Subscription;
	subscriptions: any = new Subscription();

	product: IProductDetails;
	vendorsPrice: number[] = [];
	urlPath: any;

	// SAVE
	saved: boolean;
	watched0: boolean;
	compared = [];
	comparedO = [];

	// SUBJECT
	private productDetails$ = new Subject<IProductDetails>();
	private userInformation$ = new Subject<any>();
	private userProductSaved$ = new Subject<any>();
	private userWishlist$ = new Subject<any>();

	// ARRAY
	message: Array<object> = [];

	bsModalRef: BsModalRef;
	savings: number;

	// BOOLEAN
	productAddedToShoppingList = false;

	// OBJECT
	config = {
		animated: false,
		backdrop: true
	};

	// STRING
	// load = require('../../../../../../../assets/img/blank.jpg');
	load = './assets/img/blank.jpg';

	constructor(
		public GS: GoogleAnalyticsService,
		private router: Router,
		private route: ActivatedRoute,
		public DS: DeviceService,
		private productAPI: ProductAPIService,
		public AS: AuthService,
		private LS: LocalStorage,
		private US: UserAPIService,
		private SLS: ShoppingListAPIService,
		private MS: ModalService,
		private _sessionStorage: SessionStorage,
		private _planService: PlanAPIService,
		public sanitizer: DomSanitizer,
		public changeDetector: ChangeDetectorRef,
		@Inject(PLATFORM_ID) private platform: any) {
	}

	ngOnInit() {
		this.MS.data$.next(undefined);
		this._refreshPlanLimit();
		this.assignImagesToProduct();
		this.fetchUserShoppingListInformation();
		this.processProductDetailsSubscription();
		this.processUserInformationSubscription();
		this.getUrlParent();
	}

	ngOnChanges() {
		this.assignImagesToProduct();
		this.processProductSavingsFromVendors();
	}

	ngAfterViewInit() {
		this.changeDetector.detach();
	}

	ngOnDestroy() {
		this.subscriptions.unsubscribe();

		if (this.productDetailsSubscription) {
			this.productDetailsSubscription.unsubscribe();
		}
		if (this.userInformationSubscription) {
			this.userInformationSubscription.unsubscribe();
		}
		if (this.userProductSavedSubscription) {
			this.userProductSavedSubscription.unsubscribe();
		}
		if (this.userWishlistSubscription) {
			this.userWishlistSubscription.unsubscribe();
		}
		if (this.fetchUserShoppingListSubscription) {
			this.fetchUserShoppingListSubscription.unsubscribe();
		}
		if (this.fetchModalDataSubscription) {
			this.fetchModalDataSubscription.unsubscribe();
		}
		if (this.userShoppingListSubscription) {
			this.userShoppingListSubscription.unsubscribe();
		}
	}

	private _refreshPlanLimit() {
		let userId = this.LS.get('userId');
		if (userId && this._sessionStorage.get('refreshPlanLimit') !== null) {
			this.subscriptions.add(this._planService.processPlanLimits(userId).subscribe((res) => {
				this._sessionStorage.remove('refreshPlanLimit');
			}));
		}
	}

	gEvent(is: string, type: string) {
		this.GS.event(`${type}`, `Product ${is} - ${this.product.title} (${this.product.productId})`, 'click', 0);

		if (is === 'Add to List') {
			// ECOMMERCE
			let productF = {
				'items': [
					{
						'id': this.product.productId,
						'name': this.product.title,
						'brand': this.product.brand,
						'category': this.product.category,
						'price': this.product.price,
					}
				]
			}

			this.GS.commerce('add_to_cart', productF);
		}
	}

	private getUrlParent() {
		this.route.paramMap.subscribe((urlPath) => {
			this.urlPath = urlPath;
		});
	}

	private _message(a: any, b: any, c: any = '', d: number = 0) {
		this.message.push({
			type: a,
			value: b,
			linkTitle: c,
			listId: d
		})
	}

	private _close(a: AlertComponent) {
		this.message = this.message.filter((i) => i !== a);
		this.changeDetector.detectChanges();
	}

	/**
	* Assign product images to popup modal
	*/
	private assignImagesToProduct() {
		if (this.product && this.productImages) {
			this.product.images = this.productImages['images'];
		}
	}

	/**
	* Get vendors information from API and store calculated savings information
	*/
	private processProductSavingsFromVendors() {
		if (this.productVendors !== undefined) {
			if (this.productVendors.length <= 0) {
				this.savings = 0;
				return false;
			}

			let vendors: object[] = this.productVendors;
			let vendorsLength = vendors.length;

			for (let i = 0; i < vendorsLength; i++) {
				this.vendorsPrice.push(vendors[i]['vendorPrice']);
			}

			this.calculateSavings(this.vendorsPrice);
		}
	}

	/**
	* Calculate savings from vendors information
	*/
	private calculateSavings(vendorsPrice: number[]) {
		let minPrice = Math.min(...vendorsPrice);
		let maxPrice = Math.max(...vendorsPrice);

		if (this.product) {
			this.savings = maxPrice - this.product.vendorPrice;
			this.savings = Math.round(this.savings * 100) / 100;

			this.product['vendorsPrice'] = vendorsPrice;
			this.product['savings'] = this.savings;
		}
	}

	private fetchUserShoppingListInformation() {
		if (this.AS.isAuthenticated()) {
			this.fetchModalDataSubscription = this.MS.fetchModalData().subscribe((res: any) => {
				if (res) {
					switch (res.type) {
						case 'open-create-list':
							this.productAddedToShoppingList = undefined;
							this.SLS.message = [];

							this.MS.data$.next(undefined);
							this.MS.obj = {
								image: this.product['images'] ? this.product['images'][0]['thumbnail'] : '',
								productId: this.productID,
								title: this.product['title']
							};
							this.MS.openCreateListsModal(this.config);
							break;
						case 'success-product-list-created':
							this.productAddedToShoppingList = true;
							this._setMessage(res);
							let userId = this.LS.get('userId');
							this._sessionStorage.set('refreshPlanLimit', true);
							this.subscriptions.add(this._planService.processPlanLimits(userId).subscribe((res) => {
								this._sessionStorage.remove('refreshPlanLimit');
							}))
							break;

						default:
							this.productAddedToShoppingList = false;
							this._setMessage(res);
							break;
					}
				}

				this.changeDetector.detectChanges();
			})
		}
	}

	private _setMessage(res: any) {
		this.message = [];
		if (res.value) {
			this._message(res.type, res.value, res.linkTitle, res.listId);
		}
	}

	/**
	* Process product details data from API
	*/
	private processProductDetailsSubscription() {
		this.productAPI.getProductDetails(this.productID).subscribe((res) => {
			this.productDetails$.next(res);
		});

		this.renderProductDetailsSubscriptionDataToComponent();
	}

	/**
	* Process user information from API
	*/
	private processUserInformationSubscription() {
		if (this.AS.isAuthenticated()) {
			let userId = this.LS.get('userId');
			if (userId) {

				this.US.getSaved(userId).subscribe((res) => {
					this.userProductSaved$.next(res);
				})

				this.renderUserSavedProduct();

				this.US.getWatchlists(userId).subscribe((res) => {
					this.userWishlist$.next(res);
				})

				this.renderUserWishlist();
			}
		}
	}

	private renderUserSavedProduct() {
		this.userProductSavedSubscription = this.userProductSaved$.subscribe(res => {
			if (res && res.length > 0) {
				const savedProduct = res.find(product => Number(product.productId) === Number(this.productID));
				if (savedProduct) {
					this.saved = true;

					this.changeDetector.detectChanges();
				}
			}
		});
	}

	private renderUserWishlist() {
		this.userWishlistSubscription = this.userWishlist$.subscribe(res => {
			if (res && res.length > 0) {
				const watchedProduct = res.find(product => Number(product.productId) === Number(this.productID));
				if (watchedProduct) {
					this.watched0 = true;

					this.changeDetector.detectChanges();
				}
			}
		});
	}

	/**
	* Get product details subscription data and render to component
	*/
	private renderProductDetailsSubscriptionDataToComponent() {
		this.productDetailsSubscription = this.productDetails$.subscribe(res => {
			this.product = res;

			if (this.savings !== undefined && (this.savings >= 0)) {
				this.product['vendorsPrice'] = this.vendorsPrice;
				this.product['savings'] = this.savings;
			} else {
				this.processProductSavingsFromVendors();
			}

			this.assignImagesToProduct();

			this.getProductDetailsOutput.emit(this.product);

			this.changeDetector.detectChanges();
		});
	}

	/**
	* Get user information from API and set whether product is saved
	* or added to watchlist
	*/
	private renderUserInformationSubscriptionDataToComponent() {
		this.userInformationSubscription = this.userInformation$.subscribe(res => {
			let data = JSON.parse(res._body);
			let savedDataList: number[] = data.saved;
			let watchDataList: number[] = data.watchlist;

			if (savedDataList && savedDataList.length > 0) {
				savedDataList.forEach((value) => {
					if (value === this.productID) {
						this.saved = true;
					}
				});
			}

			if (watchDataList && watchDataList.length > 0) {
				watchDataList.forEach((value) => {
					if (value === this.productID) {
						this.watched0 = true;
					}
				});
			}

			this.changeDetector.detectChanges();
		});
	}

	/**
	* Unsubscribe modal service
	*/
	private manuallyUnsubscribeModalService() {
		this.cartListModalSubscription.unsubscribe();
	}



	/**
	* Add a product to cart list
	*/
	public addToList(product: IProductDetails) {
		if (!this.AS.isAuthenticated()) {
			this.router.navigate(['/login']);
			return false;
		}

		let userId: number = this.LS.get('userId');

		this.productAddedToShoppingList = undefined;
		this.message = [];
		this.MS.data$.next(undefined);
		this.changeDetector.detectChanges();

		this.userShoppingListSubscription = this.SLS.userShoppingList(userId).subscribe((res: any) => {
			if (res) {
				this.MS.obj = {
					image: this.product['images'] ? this.product['images'][0]['thumbnail'] : '',
					productId: this.productID,
					title: this.product['title']
				};

				if (res === undefined || (res && res.length <= 0)) {
					this.SLS.message = [];

					this.MS.openCreateListsModal(this.config);
				} else {
					this.SLS.shoppingList = res;
					this.SLS.selectedShoppingList = '';
					this.SLS.message = [];

					this.MS.openSelectListsModal(this.config);
				}
			}

			this.changeDetector.detectChanges();
		});
	}

	login(a, b) {
		if (b === 'save') {
			if (isPlatformBrowser(this.platform)) {
				localStorage.setItem('authRedirect', a + '?save' + this.product.productId);
			}
			this.router.navigate(['/login']);
		}
		if (b === 'login') {
			if (isPlatformBrowser(this.platform)) {
				localStorage.setItem('authRedirect', a);
			}
			this.router.navigate(['/login']);
		}
		if (b === 'watchlist') {
			if (isPlatformBrowser(this.platform)) {
				localStorage.setItem('authRedirect', a + '?watchlist=' + this.product.productId);
			}
			this.router.navigate(['/login']);
		}
	}

	/**
	* Save/Remove a product from Save for later
	*/
	save(i) {
		this.message = [];
		this.MS.data$.next(undefined);
		let userId = this.LS.get('userId');
		if (userId) {
			let productObject = {
				uid: userId,
				productID: i.productId
			};

			if (this.saved) {
				this.US.deleteProduct(productObject).subscribe((res: any) => {
					if (res.success) {
						this.saved = false;

						let message: any = this.MS.processModalAlertInformation('success', 'Saved product has been successfully removed. ');
						this.MS.data$.next(message);

						this.changeDetector.detectChanges();
					}
				}, (error) => {
					let message: any = this.MS.processModalAlertInformation('danger', 'Error when removing saved product. ');
					this.MS.data$.next(message);
				})
			} else {
				this.US.postProduct(productObject).subscribe((res: any) => {
					if (res.success) {
						this.saved = true;

						this.removeCurrentProductFromCart();

						let message: any = this.MS.processModalAlertInformation('success', 'Saved product has been successfully added. ');
						this.MS.data$.next(message);

						this.changeDetector.detectChanges();
					}
				}, (error) => {
					let message: any = this.MS.processModalAlertInformation('danger', 'Error when adding saved product. ');
					this.MS.data$.next(message);
				})
			}
		}
	}

	/**
	* Upon clicking "Save for later" or "Add to watchlist" remove the item from
	* cart and enable "Add to list" button
	*/
	private removeCurrentProductFromCart() {
		// let itemRemoved = this.CS.removeItemFromCart(this.productID);

		// if (itemRemoved) {
		// 	this.addToListButtonText = 'Add to List';
		// 	this.productAddedToList = false;
		// }
	}

	/**
	* Upon clicking "Add to list" button
	* enable "Save for later" or "Add to watchlist"
	*/
	private removeSaveAndWatchlist() {
		let userId = this.LS.get('userId');
		if (userId) {
			let productObject = {
				uid: userId,
				productID: this.productID
			};

			if (this.saved) {
				this.US.deleteProduct(productObject).subscribe((res: any) => {
					if (res.success) {
						this.saved = false;

						this.changeDetector.detectChanges();
					}
				})
			}

			if (this.watched0) {
				this.US.removeFromWatchList(productObject).subscribe((res: any) => {
					if (res.success) {
						this.watched0 = false;

						this.changeDetector.detectChanges();
					}
				});
			}
		}
	}

	compare(item) {
		let e = this.comparedO.find(r => r.productId === item.productId);
		let i = this.comparedO.findIndex(r => r.productId === item.productId);

		if (e) {
			this.compared.splice(i, 1);
			this.comparedO.splice(i, 1);
		} else {
			this.compared.push(item.productId);
			this.comparedO.push(item);
		}
		this.LS.set('compare', this.comparedO);
	}

	productqty(i) {
		this.product.quantity = i;
	}

	comparedF(item): boolean {
		let e = this.comparedO.find(r => r.productId === item);
		if (e) {
			return true;
		} else {
			return false;
		}
	}

	/**
	* Add/Remove product from watchlist
	*/
	watchlist(i) {
		this.message = [];
		this.MS.data$.next(undefined);
		let userId = this.LS.get('userId');
		if (userId) {
			let productObject = {
				uid: userId,
				productID: i.productId
			};

			if (this.watched0) {
				this.subscriptions.add(this.US.removeFromWatchList(productObject).subscribe((res: any) => {
					if (res.success) {
						this.watched0 = false;

						let message: any = this.MS.processModalAlertInformation('success', 'Product has been successfully removed from watchlist. ');
						this.MS.data$.next(message);

						this._sessionStorage.set('refreshPlanLimit', true);

						this.changeDetector.detectChanges();
					}
				}, (error) => {
					let message: any = this.MS.processModalAlertInformation('danger', 'Error when removing product from watchlist. ');
					this.MS.data$.next(message);
				}));
			} else {
				this.subscriptions.add(this.US.postWatchlist(productObject).subscribe((res: any) => {
					if (res.success) {
						this.watched0 = true;
						this.removeCurrentProductFromCart();

						let message: any = this.MS.processModalAlertInformation('success', 'Product has been successfully added to watchlist. ');
						this.MS.data$.next(message);

						this._sessionStorage.set('refreshPlanLimit', true);

						this.changeDetector.detectChanges();
					}
				}, (error) => {
					if (error.status === 400) {
						let message: any = this.MS.processModalAlertInformation('membership-watchlist-error', 'Watchlist exceeded 10 products. ');
						this.MS.data$.next(message);
					} else {
						let message: any = this.MS.processModalAlertInformation('danger', 'Error when product added to watchlist. ');
						this.MS.data$.next(message);
					}
				}));
			}
		}
	}

	/**
	* Create router link for Brand filter query parameters
	*/
	routeCatagoryPageRouterLink(category, subCategory, brand) {
		let categoryURL = '/groceries';

		if (category) {
			categoryURL = `${categoryURL}/${this.url(category)}`;
		}
		if (subCategory) {
			categoryURL = `${categoryURL}/${this.url(subCategory)}`;
		}

		this.router.navigate([categoryURL], { queryParams: { Brand: encodeURIComponent(JSON.stringify([brand])) } });
	}

	/**
	* Create url route from given string
	*/
	private url(i) {
		return i.toLowerCase().replace(/(?:( and )|(&)|(,)|(\s)|[/])+/g, '-');
	}

	openBrandProduct($event: any, productId: number) {
		$event.preventDefault();

		this.router.navigateByUrl('/', { skipLocationChange: true })
			.then(() => this.router.navigate(['/grocery', this.urlPath.params.product, productId]));
	}

	refreshLists($event: any) { }
}

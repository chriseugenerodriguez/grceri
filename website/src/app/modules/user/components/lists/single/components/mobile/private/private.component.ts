import { Component, OnInit, AfterViewInit, Inject, HostListener, PLATFORM_ID, ViewChild, ElementRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

// ROUTER
import { Router, ActivatedRoute } from '@angular/router';

// FORMGROUP
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

// RXJS
import { Subscription } from 'rxjs';

// SERVICES
import {
	SearchBarService,
	BarcodeService,
	ModalService,
	AuthService,
	LocalStorage,
	ShoppingListAPIService,
	CommonService,
	HammerService,
	ListLabelAPIService
} from '../../../../../../../../shared/services';

import { ListService } from '../../../../../../services/list.service';

// ENV
import { environment } from '../../../../../../../../../environments/environment';

@Component({
	moduleId: module.id,
	selector: 'mobile-private-list',
	templateUrl: 'private.component.html',
	styleUrls: ['private.component.scss']
})

// CLASS
export class MobilePrivateListComponent implements OnInit, AfterViewInit {
	// VIEWCHILD
	@ViewChild('mobileContentLength', { static: false }) mobileTitle: ElementRef;
	@ViewChild('mobileHeaderDetails', { static: false }) mobileHeaderDetails: ElementRef;

	// OBJECT
	user: any[] = [];

	// RXJS
	subscriptions: any = new Subscription();

	// ARRAY
	config = {
		animated: false,
		backdrop: true,
	};
	userLabels: string[];
	listLabels: string[] = [];

	// FORMGROUP
	editMobileListGroup: FormGroup;

	// NUMBER
	id: number = this.LS.get('userId') === null || this.LS.get('userId') === undefined ? 0 : this.LS.get('userId');

	// BOOLEAN
	listDetails = false;
	editMobileListInfo = false;
	disableAddToList = false;
	loading = false;
	floading = false;
	rloading = false;

	// STRING
	// load = require('../../../../../../../../../assets/img/blank.jpg');
	load = './assets/img/blank.jpg';
	listId: string;

	@HostListener('window:resize', ['$event'])
	onResize(event) {
		if (isPlatformBrowser(this.platform)) {
			this.resetEditList();
		}
	}

	constructor(
		@Inject(PLATFORM_ID) private platform: any,
		private LS: LocalStorage,
		private AS: AuthService,
		private fb: FormBuilder,
		private SLS: ShoppingListAPIService,
		private MS: ModalService,
		public BS: BarcodeService,
		public SBS: SearchBarService,
		private router: ActivatedRoute,
		private route: Router,
		public commonService: CommonService,
		public listService: ListService,
		private hammerService: HammerService,
		private _listLabelService: ListLabelAPIService
	) { }

	ngOnInit() {
		this.MS.data$.next(undefined);
		this._getListId();
		this._getUserLabels();
		this._mobileForm();
		this._fetchData();
	}

	ngAfterViewInit() {
		this._swipeActionsList();
	}

	private _fetchData(){
		this.subscriptions.add(this._listLabelService.fetchData().subscribe((res) => {
			if(res){
				this.listLabels = res;
			}
		}));
	}

	private _getUserLabels() {
		this.subscriptions.add(this._listLabelService.getUserLabels().subscribe((res) => {
			if (res) {
				this.userLabels = res;
			}
		}))
	}

	private _getListId(){
		this.subscriptions.add(this.router.paramMap.subscribe(params => {
			this.listId = params.get('id');
		}));
	}

	private _mobileForm() {
		return (this.editMobileListGroup = this.fb.group({
			listTitle: [this.listService.single['title'], Validators.compose([Validators.required, Validators.maxLength(50)])],
			listDescription: [this.listService.single['description'], Validators.compose([Validators.maxLength(200)])],
		}));
	}

	updateUserListInfo(): void {
		this.listService.isLoggedIn(this.listService.single);

		if (this.editMobileListGroup.valid) {
			let title: any = this.editMobileListGroup.controls['listTitle'].value;
			let description: any = this.editMobileListGroup.controls['listDescription'].value;
			let url: string = this.router.params['value'].id;

			this.listService.updateListInformation(title, description, url);
		}
	}

	resetEditList(): void {
		this.editMobileListGroup.controls['listTitle'].setValue(this.listService.single['title']);
		this.editMobileListGroup.controls['listDescription'].setValue(this.listService.single['description']);
		this.editMobileListInfo = false;
	}

	editMobileInfo($event: any): void {
		$event.preventDefault();
		this.listService.isLoggedIn(this.listService.single);

		this.editMobileListGroup.controls['listTitle'].setValue(this.listService.single['title']);
		this.editMobileListGroup.controls['listDescription'].setValue(this.listService.single['description']);

		this.editMobileListInfo = !this.editMobileListInfo;
	}

	addToList(product: any): void {
		this.listService.isLoggedIn(this.listService.single);

		this.disableAddToList = true;
		this.MS.data$.next(undefined);

		this.subscriptions.add(this.SLS.updateShoppinglist(this.id, this.listService.listId, product.productId).subscribe(
			res => {
				this.disableAddToList = false;
				if (res) {
					let message: any = this.MS.processModalAlertInformation('success', 'Product has been successfully added. ', product.productId, this.listService.listId);
					this.MS.openMessageModal(this.config);
					this.MS.data$.next(message);
					if (!environment.production) {
						console.log('Shopping List Updated');
					}

					this._updateList();
				}
			},
			error => {
				let message: any;
				this.disableAddToList = false;
				if (error.status === 400) {
					message = this.MS.processModalAlertInformation('danger', 'Product already added to the list');
				} else {
					message = this.MS.processModalAlertInformation('danger', 'Error when adding product');
				}
				this.MS.openMessageModal(this.config);
				this.MS.data$.next(message);
				if (!environment.production) {
					console.log('Shopping List Error');
				}
			}
		));
	}

	private _updateList() {
		this.listService.isLoggedIn(this.listService.single);

		let url: string = this.router.params['value'].id;

		this.subscriptions.add(this.SLS.getList(this.id, url).subscribe(res => {
			this.listService.single = res;
		}));
	}

	private _swipeActionsList(): void {
		let bottom = this.mobileTitle.nativeElement;

		this.hammerService.SwipeUp(bottom).subscribe(data => {
			this.listDetails = true;
		})

		if (this.listDetails) {
			let form = this.mobileHeaderDetails.nativeElement;

			this.hammerService.SwipeLeftDownClose(form).subscribe(data => {
				if (data.swipe === 'left') {
					this.listDetails = false;
					history.pushState(null, null, location.href);
				}

				if (data.swipe === 'down') {
					this.listDetails = false;
				}
			});
		}
	}

	mobileLabelActions($event: any){
		if($event){
			switch ($event.type) {
				case 'refresh-labels':
					this._listLabelService.listLabel$.next($event.labels);
					this._getUserLabels();
					break;
			
				default:
					break;
			}
		}
	}
}

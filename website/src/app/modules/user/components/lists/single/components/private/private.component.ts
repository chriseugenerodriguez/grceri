import { Component, OnInit, OnDestroy, Inject, HostListener, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

// ROUTER
import { Router, ActivatedRoute } from '@angular/router';

// FORMGROUP
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

// SUBSCRIPTIONS
import { Subscription } from 'rxjs';

// SERVICES
import {
	ModalService,
	DeviceService,
	ListLabelAPIService,
	CommonService,
} from '../../../../../../../shared/services';
import { ListService } from '../../../../../services/list.service';

@Component({
	moduleId: module.id,
	selector: 'private-list',
	templateUrl: 'private.component.html',
	styleUrls: ['private.component.scss']
})

// CLASS
export class PrivateListComponent implements OnInit, OnDestroy {
	editDesktopListGroup: FormGroup;

	userLabels: string[];
	listLabels: string[] = [];

	// STRING
	load = require('../../../../../../../../assets/img/blank.jpg');

	// SUBSCRIPTIONS
	private _subscriptions: any = new Subscription();

	// BOOLEAN
	editDesktopListInfo: boolean = false;

	listId: string;

	config = {
		animated: false,
		backdrop: true,
	};

	@HostListener('window:resize', ['$event'])
	onResize(event) {
		if (isPlatformBrowser(this.platform)) {
			this.resetDesktopEditList();
		}
	}

	constructor(
		@Inject(PLATFORM_ID) private platform: any,
		public DS: DeviceService,
		private fb: FormBuilder,
		public MS: ModalService,
		private router: ActivatedRoute,
		private route: Router,
		public commonService: CommonService,
		public listService: ListService,
		private _listLabelService: ListLabelAPIService
	) { }

	ngOnInit() {
		this.MS.data$.next(undefined);
		this._getUserLabels();
		this._desktopForm();
		this._getListId();
		this._fetchData();

	}

	ngOnDestroy() {
		this._subscriptions.unsubscribe();
	}

	private _fetchData(){
		this._subscriptions.add(this._listLabelService.fetchData().subscribe((res) => {
			if(res){
				this.listLabels = res;
			}
		}));
	}

	private _getUserLabels() {
		this._subscriptions.add(this._listLabelService.getUserLabels().subscribe((res) => {
			if (res) {
				this.userLabels = res;
			}
		}))
	}

	private _getListId() {
		this._subscriptions.add(this.router.paramMap.subscribe(params => {
			this.listId = params.get('id');
		}));
	}

	private _desktopForm() {
		return (this.editDesktopListGroup = this.fb.group({
			desktopListTitle: [this.listService.single['title'], Validators.compose([Validators.required, Validators.maxLength(50)])],
			desktopListDescription: [this.listService.single['description'], Validators.compose([Validators.maxLength(200)])],
		}));
	}

	updateDesktopUserListInfo(): void {
		this.listService.isLoggedIn(this.listService.single);

		if (this.editDesktopListGroup.valid) {
			let title: any = this.editDesktopListGroup.controls['desktopListTitle'].value;
			let description: any = this.editDesktopListGroup.controls['desktopListDescription'].value;
			let url: string = this.router.params['value'].id;

			this.listService.updateListInformation(title, description, url);
		}
	}

	resetDesktopEditList(): void {
		this.editDesktopListGroup.controls['desktopListTitle'].setValue(this.listService.single['title']);
		this.editDesktopListGroup.controls['desktopListDescription'].setValue(this.listService.single['description']);
		this.editDesktopListInfo = false;
	}

	editInfo($event): void {
		$event.preventDefault();

		this.listService.isLoggedIn(this.listService.single);

		this.editDesktopListGroup.controls['desktopListTitle'].setValue(this.listService.single['title']);
		this.editDesktopListGroup.controls['desktopListDescription'].setValue(this.listService.single['description']);

		this.editDesktopListInfo = !this.editDesktopListInfo;
	}

	desktopLabelActions($event: any) {
		if ($event) {
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

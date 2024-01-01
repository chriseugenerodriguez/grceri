import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

// SERVICES
import {
	ModalService,
	DeviceService,
	HttpCancelService,
	CommonService,
} from '../../../../../../../shared/services';
import { ListService } from '../../../../../services/list.service';

@Component({
	moduleId: module.id,
	selector: 'public-list',
	templateUrl: 'public.component.html',
	styleUrls: ['public.component.scss']
})

// CLASS
export class PublicListComponent implements OnInit {
	config = {
		animated: false,
		backdrop: true,
	};

	// STRING
	// load = require('../../../../../../../../assets/img/blank.jpg');
	load = './assets/img/blank.jpg';

	constructor(
		public DS: DeviceService,
		private MS: ModalService,
		public commonService: CommonService,
		public listService: ListService
	) {}

	ngOnInit(){
		this.MS.data$.next(undefined);
	}
}

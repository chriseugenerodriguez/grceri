import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

// SERVICES
import {
	SearchBarService,
	ModalService,
	AuthService,
	HttpCancelService,
	CommonService,
} from '../../../../../../../../shared/services';

import { ListService } from '../../../../../../services/list.service';

@Component({
	moduleId: module.id,
	selector: 'mobile-public-list',
	templateUrl: 'public.component.html',
	styleUrls: ['public.component.scss']
})

// CLASS
export class MobilePublicListComponent implements OnInit {
	config = {
		animated: false,
		backdrop: true,
	};

	// STRING
	load = require('../../../../../../../../../assets/img/blank.jpg');

	constructor(
		private AS: AuthService,
		private MS: ModalService,
		public SBS: SearchBarService,
		public commonService: CommonService,
		public listService: ListService
	) {}

	ngOnInit(){
		this.MS.data$.next(undefined);
	}
}

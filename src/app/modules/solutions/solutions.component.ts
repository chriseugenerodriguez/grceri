import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';

// SERVICES
import { HttpCancelService } from '../../shared/services';

// SERVICES
import { Router } from '@angular/router';

// ENV
import { environment } from '../../../environments/environment';

@Component({
	moduleId: module.id,
	selector: 'solutions',
	templateUrl: 'solutions.component.html',
	styleUrls: ['solutions.component.scss'],
})
export class SolutionsComponent implements OnInit, OnDestroy {
	constructor(public router: Router, private httpCancelService: HttpCancelService) { }

	ngOnInit() { }

	ngOnDestroy(): void {
		this.httpCancelService.cancelPendingRequests();
		if (!environment.production && !this.httpCancelService) {
			console.log('canceled pending request');
		}
	}
}

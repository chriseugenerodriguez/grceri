import { Component, OnDestroy } from '@angular/core';

// SERVICES
import { Meta } from '@angular/platform-browser';

// SERVICES
import { HttpCancelService } from '../../shared/services';

// ENV
import { environment } from '../../../environments/environment';

@Component({
	moduleId: module.id,
	selector: 'user',
	templateUrl: 'user.component.html',
	styleUrls: ['user.component.scss'],
})
export class UserComponent implements OnDestroy {
	constructor(private httpCancelService: HttpCancelService, private meta: Meta) {
		this.meta.addTags([{ name: 'robots', content: 'noindex,nofollow' }]);
	}

	ngOnDestroy(): void {
		this.httpCancelService.cancelPendingRequests();
		if (!environment.production && !this.httpCancelService) {
			console.log('canceled pending request');
		}
	}
}

import { Component, OnDestroy } from '@angular/core';

// SEO
import { Meta, Title } from '@angular/platform-browser';

// SERVICES
import { AuthService, UserAPIService, HttpCancelService, LocalStorage, ProfileAPIService } from '../../../../shared/services';

// ENV
import { environment } from '../../../../../environments/environment';

// COMPONENT
@Component({
	moduleId: module.id,
	selector: 'dashboard',
	templateUrl: 'dashboard.component.html',
	styleUrls: ['dashboard.component.scss'],
})

// CLASS
export class DashboardComponent implements OnDestroy {
	// NUMBER
	id: number = this.LS.get('userId');

	// ARRAY
	user = [];
	profile = [];

	// STRING
	loginType: string = this.LS.get('login_type');

	constructor(
		private meta: Meta,
		private title: Title,
		private AS: AuthService,
		private US: UserAPIService,
		private LS: LocalStorage,
		private PS: ProfileAPIService,
		private httpCancelService: HttpCancelService) {
		// TITLE
		this.title.setTitle('My Dashboard - grceri');
		this.meta.updateTag({ name: 'robots', content: 'noindex, nofollow' });

		this.__userInfo();
	}

	ngOnDestroy() {
		this.httpCancelService.cancelPendingRequests();
		if (!environment.production && !this.httpCancelService) {
			console.log('canceled pending request');
		}
	}

	private __userInfo() {
		if (this.id) {
			this.US.getUser(this.id).subscribe((res: any) => {
				this.user = res;
			});

			this.PS.getProfile().subscribe((res) => {
				this.profile = res;
			});
		}
	}


	logout() {
		return this.AS.logout();
	}
}

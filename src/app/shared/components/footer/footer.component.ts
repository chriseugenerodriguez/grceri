import { Component, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

// ROUTER
import { Router } from '@angular/router';

// SERVICES
import { GoogleAnalyticsService, AuthService, InstallPWAService, DeviceService, OfflineService } from '../../services';

// ENV
import { environment } from '../../../../environments/environment';

@Component({
	moduleId: module.id,
	selector: 'footer-app',
	templateUrl: 'footer.component.html',
	styleUrls: ['footer.component.scss']
})
export class FooterComponent {
	d = new Date();

	env = environment;

	// BOOLEAN
	mobile = false;

	@HostListener('window:resize', ['$event'])
	onResize() {
		if (isPlatformBrowser(this.platform)) {
			this.mobile = (window.innerWidth < 767) ? true : false;

			if (this.mobile) {
				this.isFooterURLS(this.router.url);
			}
		}
	}

	constructor(
		@Inject(PLATFORM_ID) private platform: any,
		private DS: DeviceService,
		public IS: InstallPWAService,
		public AS: AuthService,
		public GS: GoogleAnalyticsService,
		public router: Router,
		public OS: OfflineService) { }

	isFooterURLS(value: string): boolean {
		let boolean;

		if (
			this.env.mobile || this.router.url !== '/' &&
			!this.env.mobile &&
			value.includes('/groceries/') !== true &&
			value.includes('/grocery/') !== true
		) {
			boolean = true;
		}

		return boolean;
	}
}

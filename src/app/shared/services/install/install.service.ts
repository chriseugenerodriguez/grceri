import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

// SERVICES
import { GoogleAnalyticsService } from '../google/google-analytics.service';
import { DeviceService } from '../device/device.service';

@Injectable()
export class InstallPWAService {
	// ANY
	deferredPrompt;

	constructor(
		@Inject(PLATFORM_ID) private platform: any,
		private GA: GoogleAnalyticsService,
		private DS: DeviceService) { }

	startPrompt() {
		if (isPlatformBrowser(this.platform)) {
			window.addEventListener('beforeinstallprompt', (e) => {
				// Prevent Chrome 67 and earlier from automatically showing the prompt
				e.preventDefault();
				// Stash the event so it can be triggered later.
				this.deferredPrompt = e;
				console.log(e);
			});
		};
	}

	clickPrompt(from: string) {
		if (!this.DS.isMobile && this.deferredPrompt !== undefined) {
			this.deferredPrompt.prompt();
			// Wait for the user to respond to the prompt
			this.deferredPrompt.userChoice.then((choiceResult) => {
				if (choiceResult.outcome === 'accepted') {
					console.log('User accepted the A2HS prompt');

					this.GA.event('install', `${from} Prompt`, 'click', 0);
					this.deferredPrompt = null;
				}
			});
		} else {
			window.location.href = 'https://play.google.com/store/apps/details?id=com.grceri';
		}
	}
}

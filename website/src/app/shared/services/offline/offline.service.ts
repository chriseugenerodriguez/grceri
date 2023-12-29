import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

// ROUTER
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';

// RXJS
import { Observable } from 'rxjs';

@Injectable()
export class OfflineService implements CanActivate {
	online = false;

	constructor(@Inject(PLATFORM_ID) private platform: any, private R: Router) { }

	canActivate(route: ActivatedRouteSnapshot): boolean | Observable<boolean> | Promise<boolean> {
		if (isPlatformBrowser(this.platform)) {
			this.online = navigator.onLine;

			if (this.online) { return true; }

			this.R.navigate(['/offline']);
			return false;
		}
	}
}

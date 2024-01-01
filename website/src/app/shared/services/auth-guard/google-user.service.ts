import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

// ROUTER
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

// RXJS
import { Observable } from 'rxjs';

// AUTH
import { LocalStorage } from '../local-storage/local-storage.service';

@Injectable()
export class GoogleUserAuthGuardService implements CanActivate {

	constructor(@Inject(PLATFORM_ID) private platform: any, private _localStorage: LocalStorage, private R: Router) { }

	canActivate(route: ActivatedRouteSnapshot): boolean | Observable<boolean> | Promise<boolean> {
		if (isPlatformBrowser(this.platform)) {
			let loginType: string = this._localStorage.get('login_type');

			if (loginType === 'google') {
				this.R.navigate(['/404']);
				return false;
			}

			return true;
		}
	}
}

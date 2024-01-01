import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { isPlatformBrowser } from '@angular/common';

@Injectable()
export class AuthGuardService implements CanActivate {

	constructor(@Inject(PLATFORM_ID) private platform: any, private authService: AuthService, public R: Router) { }

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
		if (isPlatformBrowser(this.platform)) {
			localStorage.setItem('authRedirect', state.url);
		}

		if (this.authService.isAuthenticated()) {
			return true;
		}

		window.location.href = '/login';
		return false;
	}
}

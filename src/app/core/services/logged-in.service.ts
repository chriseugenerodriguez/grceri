import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable()
export class LoggedInService implements CanActivate {

	constructor(private authService: AuthService, public R: Router) { }

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
		if (!this.authService.isAuthenticated()) {
			return true;
		}

		window.location.href = '/';
		return false;
	}
}

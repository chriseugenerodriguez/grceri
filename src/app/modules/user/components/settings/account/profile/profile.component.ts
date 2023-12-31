import { Component, OnInit, OnDestroy } from '@angular/core';

// SEO
import { Title } from '@angular/platform-browser';

// SERVICES
import { UserAPIService, LocalStorage } from '../../../../../../shared/services';

// INTERFACES
import { IProfile } from '../../../../../../shared/interfaces';

// SUBSCRIPTIONS
import { Subscription } from 'rxjs';

// COMPONENT
@Component({
	moduleId: module.id,
	selector: 'profile',
	templateUrl: 'profile.component.html',
})

// CLASS
export class ProfileComponent implements OnInit, OnDestroy {
	// NUMBER
	id: number = this._localStorage.get('userId');

	private _subscriptions: any = new Subscription();
	profile: IProfile;

	constructor(title: Title,
		private _userService: UserAPIService,
		private _localStorage: LocalStorage) {
		title.setTitle('Profile - grceri');
	}

	ngOnInit() {
		// If no default value in Status input, set filter to empty array
		this._getUserProfile();
	}

	ngOnDestroy(){
		this._subscriptions.unsubscribe();
	}

	private _getUserProfile(){
		let userInformation$: any = this._userService.getUserProfile();
		this._subscriptions.add(userInformation$.subscribe((res: IProfile) => {
			if(res){
				this.profile = res;
			}
		}));
	}
}

import { Subscription } from 'rxjs';
import { Component, Input, OnInit } from '@angular/core';

// SERVICES
import { ModalService, UserAPIService } from '../../../../../../../shared/services';

import { IProfile } from './../../../../../../../shared/interfaces/profile/profile.interface';

// COMPONENT
@Component({
	moduleId: module.id,
	selector: 'settings-profile-image',
	templateUrl: 'image.component.html',
})

// CLASS
export class SettingsProfileImageComponent implements OnInit {
	@Input() user: IProfile;

	// STRING
	avatarUrl: string = 'assets/img/blank-user.jpg';

	config = {
		class: 'modal-popup',
		animated: false,
		backdrop: true,
	};

	private _subscriptions: any = new Subscription();

	constructor(
		private MS: ModalService,
		private _userService: UserAPIService
		) {
	}

	ngOnInit() {
		this._getProfileInformation();
	}

	private _getProfileInformation() {
		let userInformation$: any = this._userService.getUserProfile();
		this._subscriptions.add(userInformation$.subscribe((res: IProfile) => {
			if (res) {
				this.avatarUrl = res['avatar'] ? res['avatar'] : 'assets/img/blank-user.jpg';
			}
		}));
	}

	editAvatar($event: any): void {
		$event.preventDefault();
		this.MS.openEditAvatarModal(this.config);
	}
}

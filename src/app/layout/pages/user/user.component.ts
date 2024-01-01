import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core';

@Component({
	moduleId: module.id,
	selector: 'user',
	templateUrl: 'user.component.html'
})

export class UserComponent implements OnInit {

	profile: any;

	constructor(private AS: AuthService) {
		if (this.AS.userProfile) {
			this.profile = this.AS.userProfile;
		} else {
			this.AS.getProfile((err, profile) => {
				this.profile = profile;
				console.log(profile);
			});
		}
	}

	ngOnInit() {

	}
}

import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../core';

// COMPONENT
@Component({
	moduleId: module.id,
	selector: 'callback',
	templateUrl: 'callback.component.html',
})

// CLASS
export class CallbackComponent implements OnInit {

	constructor(private AS: AuthService) {
	}

	ngOnInit() {
		this.AS.handleAuthentication();
	}

}

import { Component } from '@angular/core';

// SERVICES
import { ModalService } from '../../../../../../../shared/services';

// COMPONENT
@Component({
	moduleId: module.id,
	selector: 'settings-security-password',
	templateUrl: 'password.component.html'
})

// CLASS
export class SettingsSecurityPasswordComponent {

	config = {
		class: 'modal-popup',
		animated: false,
		backdrop: true,
	};

	constructor(private MS: ModalService) {
	}

	editPassword($event: any): void {
		$event.preventDefault();
		this.MS.openChangePasswordModal(this.config);
	}
}

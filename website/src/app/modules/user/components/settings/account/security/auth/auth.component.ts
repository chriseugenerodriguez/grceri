import { Component } from '@angular/core';

// SERVICES
import { ModalService } from '../../../../../../../shared/services';

// COMPONENT
@Component({
	moduleId: module.id,
	selector: 'settings-security-auth',
	templateUrl: 'auth.component.html',
})

// CLASS
export class SettingsSecurityAuthComponent {

	config = {
		class: 'modal-popup',
		animated: false,
		backdrop: true,
	};

	constructor(private MS: ModalService) {
	}

	editTwoFactorAuthentication($event: any): void {
		$event.preventDefault();
		this.MS.openTwoFactorAuthenticationdModal(this.config);
	}
}

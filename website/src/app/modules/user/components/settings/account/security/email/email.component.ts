import { Component } from '@angular/core';

// SERVICES
import { ModalService } from '../../../../../../../shared/services';

// COMPONENT
@Component({
	moduleId: module.id,
	selector: 'settings-security-email',
	templateUrl: 'email.component.html',
})

// CLASS
export class SettingsSecurityEmailComponent {

	config = {
		class: 'modal-popup',
		animated: false,
		backdrop: true,
	};

	constructor(private MS: ModalService) {
	}

	editEmail($event: any): void {
		$event.preventDefault();
		this.MS.openEditEmailModal(this.config);
	}
}

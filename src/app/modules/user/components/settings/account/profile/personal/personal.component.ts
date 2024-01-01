import { Component, OnInit, Input, OnDestroy } from '@angular/core';

// ROUTER
import { Router } from '@angular/router';

// SERVICES
import { ModalService, AuthService, LocalStorage, SessionStorage } from '../../../../../../../shared/services';

// SUBSCRIPTIONS
import { Subscription } from 'rxjs';

// COMPONENT
@Component({
	moduleId: module.id,
	selector: 'settings-profile-personal',
	templateUrl: 'personal.component.html',
})

// CLASS
export class SettingsProfilePersonalComponent implements OnInit, OnDestroy {
	@Input() profile: any;

	config = {
		class: 'modal-popup',
		animated: false,
		backdrop: true,
	};

	// BOOLEAN
	userVerified: boolean = false;

	// NUMBER
	id: number = this.LS.get('userId');

	subscriptions: any;

	constructor(private MS: ModalService,
		private router: Router,
		private SS: SessionStorage,
		private AS: AuthService,
		private LS: LocalStorage) {
		this.subscriptions = new Subscription();
	}

	ngOnInit(){
	}

	ngOnDestroy(){
		if(this.subscriptions){
			this.subscriptions.unsubscribe();
		}
	}

	editAccount($event: any): void {
		$event.preventDefault();
		if (!this.AS.isAuthenticated()) {
			this.router.navigate(['/login']);
		}

		this.MS.openEditAccountModal(this.config);
	}
}

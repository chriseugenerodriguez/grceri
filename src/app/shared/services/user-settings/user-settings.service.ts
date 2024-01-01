import { Injectable } from '@angular/core';

// FORMS
import { FormGroup, NgForm, FormBuilder } from '@angular/forms';

// RXJS
import { Subscription } from 'rxjs';
import { Subject } from 'rxjs';

// SERVICES
import { UserAPIService } from '../api/user.service';
import { LocalStorage } from '../local-storage/local-storage.service';
import { ModalService } from '../modal/modal.service';

// INTERFACES
import { IProfile } from '../../interfaces';

@Injectable()
export class UserSettingsService {
	// FORM
	form: FormGroup;
	profile: any;

	// SUBJECT
	profile$ = new Subject<any[]>();

	// OBJECT
	apiProfileInformation: IProfile;

	// SUBSCRIPTIONS
	subscriptions: any = new Subscription();

	// BOOLEAN
	loading: boolean = false;

	constructor(public formBuilder: FormBuilder,
		private _localStorage: LocalStorage,
		private _modalService: ModalService,
		private _userService: UserAPIService) {
		this.form = this._accountForm();

		this._getUserProfile();
	}

	private _getUserProfile() {
		let userInformation$: any = this._userService.getUserProfile();
		this.subscriptions.add(userInformation$.subscribe((res: IProfile) => {
			if (res) {
				this.profile = res;

				this._updateFormFields();
			}
		}));
	}

	private _accountForm(): FormGroup {
		this.form = this.formBuilder.group({
			firstName: [''],
			lastName: [''],
			addressLine1: [''],
			addressLine2: [''],
			city: [''],
			state: [''],
			zip: [''],
			phoneNumber: [''],
			avatar: ['']
		});

		return this.form;
	}

	private _updateFormFields(): void {
		this.form.get('firstName').setValue(this.profile['firstName']);
		this.form.get('lastName').setValue(this.profile['lastName']);
		this.form.get('addressLine1').setValue(this.profile['addressLine1']);
		this.form.get('addressLine2').setValue(this.profile['addressLine2']);
		this.form.get('city').setValue(this.profile['city']);
		this.form.get('state').setValue(this.profile['state']);
		this.form.get('zip').setValue(this.profile['zip']);
		this.form.get('phoneNumber').setValue(this.profile['phoneNumber']);
		this.form.get('avatar').setValue(this.profile['avatar']);
	}

	editUserAccount(form: NgForm) {
		let userId: number = this._localStorage.get('userId');

		if (this.form.valid && userId) {
			this.loading = true;

			let firstName: string = this.form.get('firstName').value;
			let lastName: string = this.form.get('lastName').value;
			let addressLine1: string = this.form.get('addressLine1').value;
			let addressLine2: string = this.form.get('addressLine2').value;
			let city: string = this.form.get('city').value;
			let state: string = this.form.get('state').value;
			let zip: string = this.form.get('zip').value;
			let phoneNumber: string = this.form.get('phoneNumber').value;
			let avatar: string = this.form.get('avatar').value;

			let obj: any = {
				firstName,
				lastName,
				addressLine1,
				addressLine2,
				city,
				state,
				zip,
				phoneNumber,
				avatar
			}

			this.subscriptions.add(this._userService.updateProfile(userId, obj).subscribe((res: any) => {
				this.loading = false;

				if (res.success) {
					this._updateUserProfile(obj);

					let message: any = this._modalService.processModalAlertInformation('user-updated', 'Your changes have been updated');
					this._modalService.data$.next(message);

					this._modalService.close();
				}
			}, (error) => {
				this.loading = false;

				if (error.status === 400) {
					let message: any = this._modalService.processModalAlertInformation('failed-avatar-download', 'Unable to download user photo');
					this._modalService.data$.next(message);
				}
			}));
		}
	}

	private _updateUserProfile(user: any) {
		this.profile['firstName'] = user.firstName;
		this.profile['lastName'] = user.lastName;
		this.profile['addressLine1'] = user.addressLine1;
		this.profile['addressLine2'] = user.addressLine2;
		this.profile['city'] = user.city;
		this.profile['state'] = user.state;
		this.profile['zip'] = user.zip;
		this.profile['phoneNumber'] = user.phoneNumber;
		this.profile['avatar'] = user.avatar;

		this._userService.profile$.next(this.profile);
	}
}

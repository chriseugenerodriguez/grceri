import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

// ROUTER
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

// SEO
import { Meta, Title } from '@angular/platform-browser';

// FORMGROUP
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

// SERVICES
import { AuthService, HttpCancelService } from '../../../shared/services';

// BOOTSTRAP
import { AlertComponent } from 'ngx-bootstrap/alert';

// ENV
import { environment } from '../../../../environments/environment';

@Component({
	selector: 'forgot-password',
	templateUrl: 'forgot-password.component.html',
	styleUrls: ['forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
	// FORMGROUP
	public forgot: FormGroup;

	// TOGGLE SNIPPER
	public submit: boolean;

	// BUTTON
	disabled: boolean;

	// MESSAGE
	message: Array<object> = [];

	// ELEMENT REF
	@ViewChild('email', { static: false }) email: ElementRef;

	constructor(
		public router: Router,
		private meta: Meta,
		private title: Title,
		private AS: AuthService,
		private fb: FormBuilder,
		private http: HttpClient,
		private httpCancelService: HttpCancelService
	) {
		this.submit = false;
	}

	ngOnInit() {
		this.meta.updateTag({ name: 'robots', content: 'noindex, nofollow' });
		this.title.setTitle('Forgot Password - grceri');
		this._form();
	}

	ngOnDestroy(): void {
		this.httpCancelService.cancelPendingRequests();
		if (!environment.production && !this.httpCancelService) {
			console.log('canceled pending request');
		}
	}

	private _form() {
		return (this.forgot = this.fb.group({
			email: ['', Validators.compose([Validators.required, Validators.email])],
		}));
	}

	reset(email) {
		this.submit = true;

		this.http.get(`/api/user/email/${email}`).subscribe(
			res => {
				this.AS.resetPassword(email).then(r => {
					this._alert('success', r);
					this.submit = false;
					this.disabled = true;
				});
			},
			err => {
				this._alert('danger', 'Opps, we couldn`t find that email address in our system, please try again!');
				this.submit = false;
			}
		);
	}

	private _alert(a, b) {
		this.message.push({
			type: a,
			value: b,
		});
	}

	private _close(a: AlertComponent) {
		this.message = this.message.filter(i => i !== a);
	}
}

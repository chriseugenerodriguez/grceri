import { Component, Input } from '@angular/core';

// INTERFACE
import { IMailChimpResponse } from '../../../../shared/interfaces/mailchimp/mailchimp.interface';

// SERVICES
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

// HTTP
import { HttpClient, HttpParams } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
	selector: 'form-SignUp',
	templateUrl: 'form.component.html'
})
export class FormSignUpComponent {

	// FOMRGROUP
	Blog: FormGroup;

	// SUBMIT
	submit: boolean;

	// EVENTS
	success: boolean;
	error: any;
	email: string;

	// MAILCHIMP
	list_id = 'cbb42c34d3';

	// HTTP
	mailChimpEndpoint = 'https://grceri.us18.list-manage.com/subscribe?u=bb929f2baf95242fef576ba15&id=' + this.list_id;

	constructor(private fb: FormBuilder, private http: HttpClient, private DS: DomSanitizer) {
		this.form();
	}

	form() {
		return this.Blog = this.fb.group({
			Email: ['', [Validators.email]]
		});
	}

	onSubmit() {
		this.submit = true;
		this.addUser();
	}

	addUser() {
		this.email = this.Blog.controls.Email.value;

		const params = new HttpParams()
		.set('EMAIL', this.email)

		const mailChimpUrl = this.mailChimpEndpoint + '&' + params.toString();

		this.http.jsonp<IMailChimpResponse>(mailChimpUrl, 'c').subscribe(
			r => {
				if (r.result === 'error') {
					this.error = this.DS.bypassSecurityTrustHtml(r.msg);
				} else {
					this.success = true;
				}
			}, err => {
				this.error = 'Sorry, an error occurred.';
			}
		);
		this.Blog.reset();
		this.submit = false;

		setTimeout(() => {
			this.success = false;
			this.error = null;
		}, 4000);
	}

}

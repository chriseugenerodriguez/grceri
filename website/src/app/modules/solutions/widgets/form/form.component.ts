import { Component, Input } from '@angular/core';

// INTERFACE
import { IMailChimpResponse } from '../../../../shared/interfaces/mailchimp/mailchimp.interface';

// SERVICES
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

// HTTP
import { HttpClient, HttpParams } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
	selector: 'form-LearnMore',
	templateUrl: 'form.component.html'
})
export class FormSolutionsComponent {

	@Input() public tag: any;

	// FOMRGROUP
	Solutions: FormGroup;

	// SUBMIT
	submit: boolean;

	// EVENTS
	success: boolean;
	error: any;
	email: string;

	// MAILCHIMP
	list_id = '291680693a';

	// HTTP
	mailChimpEndpoint = 'https://grceri.us18.list-manage.com/subscribe/post-json?u=bb929f2baf95242fef576ba15&id=' + this.list_id;

	constructor(private fb: FormBuilder, private http: HttpClient, private DS: DomSanitizer) {
		this.solutions();
	}

	solutions() {
		return this.Solutions = this.fb.group({
			Email: ['', [Validators.email]]
		});
	}

	onSubmit() {
		this.submit = true;
		this.addUser();
	}

	addUser() {
		this.email = this.Solutions.controls.Email.value;

		const params = new HttpParams()
		.set('EMAIL', this.email)
		.set('TAG', this.tag);

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
		this.Solutions.reset();
		this.submit = false;

		setTimeout(() => {
			this.success = false;
			this.error = null;
		}, 4000);
	}

}

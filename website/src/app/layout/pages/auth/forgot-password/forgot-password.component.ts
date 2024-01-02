import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

// SEO
import { Meta, Title } from '@angular/platform-browser';

import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { AuthService } from '../../../../core';

@Component({
	selector: 'forgot-password',
	templateUrl: 'forgot-password.component.html'
})

export class ForgotPasswordComponent implements OnInit {
	public forgot: FormGroup;
	public submit: boolean;
	public res: string;
	show: boolean;

	@ViewChild('email') email: ElementRef;

	constructor(public router: Router, title: Title, private AS: AuthService, private fb: FormBuilder, private renderer: Renderer2) {
		title.setTitle('Log In - Grceri');
		this.submit = false;

		this.show = false;
	}

	ngOnInit() {
		this.form();
	}


	ngAfterViewInit() {
		// EMAIL FOCUS
		this.renderer.selectRootElement(this.email.nativeElement).focus();
	}

	private form() {
		return this.forgot = this.fb.group({
			email: ['', Validators.email],
		});
	}


	//login.component.ts
	click(email) {

		this.submit = true;

		this.AS.resetPassword(email).subscribe(r => {
			r['description'] = this.res = r['description'];
			this.submit = false;
		});
	}

}

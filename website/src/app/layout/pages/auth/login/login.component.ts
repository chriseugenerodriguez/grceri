import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';

// SEO
import { Meta, Title } from '@angular/platform-browser';

import { AuthService } from '../../../../core/index';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

// CMS
// var Prismic = require('prismic-javascript');
// var api = "https://grceri.cdn.prismic.io/api/v2";

@Component({
	selector: 'login',
	templateUrl: 'login.component.html'
})

export class LoginComponent implements OnInit, AfterViewInit {
	public login: FormGroup;
	public submit: boolean;
	public error: string;
	show: boolean;
	member: boolean;

	@ViewChild('email') email: ElementRef;
	@ViewChild('pass') pass: ElementRef;

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
		return this.login = this.fb.group({
			email: ['', Validators.email],
			password: ['', Validators.compose([Validators.required, Validators.minLength(8)])],
			rememberme: ['']
		});
	}

	//login.component.ts
	click(email, password, rememberme) {

		this.submit = true;

		this.AS.login(email, password, rememberme).subscribe(err => {
			err['description'] = this.error = err['description'];
			this.submit = false;
		});
	}

	url(i) {
		let a = i.toString();
		return a.toLowerCase();
	}

	password() {
		this.show = !this.show;
		this.renderer.selectRootElement(this.email.nativeElement).focus();
	}
}

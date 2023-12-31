import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
	moduleId: module.id,
	selector: 'footer-nav',
	templateUrl: 'nav.component.html'
})
export class NavComponent implements OnInit {

	public lists = [];

	constructor(
		public router: Router, private http: HttpClient
	) {

	}

	ngOnInit() {
		this.list();
	}

	public list() {
		this.http.get('/assets/json/category.json').subscribe(res => {
			this.lists = res['groceries']['categories'];
		});
	}

	private url(i) {
		return i['name'].toLowerCase().replace(/(?:( and )|(&)|(,)|(\s)|[/])+/g, '-');
	}
}

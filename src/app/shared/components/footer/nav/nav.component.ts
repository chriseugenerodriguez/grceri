import { Component } from '@angular/core';

import { Router } from '@angular/router';

@Component({
	moduleId: module.id,
	selector: 'footer-nav',
	templateUrl: 'nav.component.html'
})
export class NavComponent {

	public lists = [];

	constructor(
		public router: Router) {}

	private url(i) {
		return i['name'].toLowerCase().replace(/(?:( and )|(&)|(,)|(\s)|[/])+/g, '-');
	}
}

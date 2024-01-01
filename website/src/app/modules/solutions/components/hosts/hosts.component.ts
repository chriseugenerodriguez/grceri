import { Component, OnInit, ViewChild, Input } from '@angular/core';

// SERVICES
import { Router } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';

@Component({
	moduleId: module.id,
	selector: 'solutions-hosts',
	templateUrl: 'hosts.component.html'
})
export class SolutionsHostsComponent implements OnInit {

	constructor(public router: Router, title: Title, meta: Meta) {
		title.setTitle('Host Solutions - grceri');
	}

	ngOnInit() {
	}

}

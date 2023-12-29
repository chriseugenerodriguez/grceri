import { Component, OnInit } from '@angular/core';

// SERVICES
import { Router } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';

@Component({
	moduleId: module.id,
	selector: 'solutions-parents',
	templateUrl: 'parents.component.html'
})
export class SolutionsParentsComponent implements OnInit {

	constructor(public router: Router, title: Title, meta: Meta) {
		title.setTitle('Parent Solutions - grceri');
	}

	ngOnInit() {
	}
}

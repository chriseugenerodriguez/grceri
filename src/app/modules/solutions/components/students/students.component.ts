import { Component, OnInit } from '@angular/core';

// SERVICES
import { Router } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';

@Component({
	moduleId: module.id,
	selector: 'solutions-students',
	templateUrl: 'students.component.html'
})
export class SolutionsStudentsComponent implements OnInit {

	constructor(public router: Router, title: Title, meta: Meta) {
		title.setTitle('Student Solutions - grceri');
	}

	ngOnInit() {
	}
}

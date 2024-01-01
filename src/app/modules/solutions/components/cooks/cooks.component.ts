import { Component, OnInit, ViewChild, Input } from '@angular/core';

// SERVICES
import { Router } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';

@Component({
	moduleId: module.id,
	selector: 'solutions-cooks',
	templateUrl: 'cooks.component.html'
})
export class SolutionsCooksComponent implements OnInit {

	constructor(public router: Router, title: Title, meta: Meta) {
		title.setTitle('Cook Solutions - grceri');
	}

	ngOnInit() {
	}

}

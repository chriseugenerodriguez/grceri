import { Component, OnInit } from '@angular/core';

// SEO
import { Title } from '@angular/platform-browser';

// COMPONENT
@Component({
	moduleId: module.id,
	selector: 'security',
	templateUrl: 'security.component.html',
})

// CLASS
export class SecurityComponent implements OnInit {
	constructor( title: Title) {
		title.setTitle('Security - grceri');
	}

	ngOnInit() {
		// If no default value in Status input, set filter to empty array
	}


}

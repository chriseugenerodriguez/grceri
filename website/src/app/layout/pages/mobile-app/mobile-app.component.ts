import { Component, OnInit } from '@angular/core';

// SEO
import { Meta, Title } from '@angular/platform-browser';

// COMPONENT
@Component({
	moduleId: module.id,
	selector: 'mobile-app',
	templateUrl: 'mobile-app.component.html',
})

// CLASS
export class MobileAppComponent implements OnInit {

	constructor(meta: Meta, title: Title) {
		title.setTitle('Find where your groceries are in the market - Grocery Finder');

	}

	ngOnInit() {
		// If no default value in Status input, set filter to empty array

	}

}

import { Component, OnInit } from '@angular/core';

// SEO
import { Meta, Title } from '@angular/platform-browser';


@Component({
	moduleId: module.id,
	selector: 'lists',
	templateUrl: 'lists.component.html'
})

// CLASS
export class ListsComponent implements OnInit {

	COpened: boolean;

	constructor(meta: Meta, title: Title) {
		title.setTitle('Find where your groceries are in the market - Grocery Finder');

	}

	ngOnInit() {

	}

	// MODULE FUNCTIONS
	popup(v) {
		if (v === 'parts') {
			this.COpened = true;
		}
	}

}

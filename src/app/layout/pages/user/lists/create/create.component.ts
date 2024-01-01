import { Component, OnInit, Output, EventEmitter } from '@angular/core';

// SEO
import { Meta, Title } from '@angular/platform-browser';


@Component({
	moduleId: module.id,
	selector: 'lists-create',
	templateUrl: 'create.component.html'
})

// CLASS
export class ListsCreateComponent implements OnInit {
	// TOGGLE
	@Output() open = new EventEmitter<boolean>(true);

	constructor(meta: Meta, title: Title) {  
		title.setTitle('Find where your groceries are in the market - Grocery Finder');

	}

	ngOnInit() {

	}

	manage(status) {
		if (status === 'close') {
			this.open.emit(false);
		}
	}

}

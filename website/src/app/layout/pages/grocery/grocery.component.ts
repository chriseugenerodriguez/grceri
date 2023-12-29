import { Component, OnInit } from '@angular/core';

// SEO
import { Meta, Title } from '@angular/platform-browser';
import { API } from '../../../core/index';

import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

// COMPONENT
@Component({
	moduleId: module.id,
	selector: 'grocery',
	templateUrl: 'grocery.component.html',
})

// CLASS
export class GroceryComponent implements OnInit {

	public lists = [];

	constructor(meta: Meta, title: Title, public api: API, private http: HttpClient) {
		title.setTitle('All Groceries - Grceri');

	}

	ngOnInit() {
		// If no default value in Status input, set filter to empty array
		this.list();
	}

	public list() {
		this.http.get('/assets/json/category.json')
			.pipe(
				map((res: any) => res['groceries']['categories'])
			)
			.subscribe(categories => {
				this.lists = categories;
			});

		this.http.get('/assets/json/new-tree.json')
			.subscribe(response => {
				console.log(response);
			});
	}

	private url(i) {
		return i['name'].toLowerCase().replace(/(?:( and )|(&)|(,)|(\s)|[/])+/g, '-');
	}
}

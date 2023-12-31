import { Component, OnInit } from '@angular/core';

import { API } from '../../services/api.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';


@Component({
	selector: 'search',
	exportAs: 'search',
	templateUrl: 'search.html'
})

// CLASS
export class SearchComponent implements OnInit {
	sIndex: number = null;
	dropdownSelectActive: {};
	showDropdown: boolean;
	icon: boolean;
	grocerySelected: boolean;
	hide: boolean;
	closed: boolean;
	submit: boolean;
	grocery: any;
	lists = [];
	first: boolean;

	foods = [];

	recentSearches: any = '';

	filter: string = '18203';

	constructor(private api: API, private http: HttpClient, private router: Router,) {

		this.grocerySelected = false;
		this.icon = false;
		this.hide = true;
		this.closed = false;
		this.showDropdown = false;
		this.first = true;
	}

	ngOnInit() {
		this.list();
	}

	nodropdown() {
		this.showDropdown = false;
	}

	list() {
		this.http.get('/assets/json/category.json').subscribe(
			(res: any) => {
				this.lists = res?.groceries?.categories || [];
			},
			(error) => {
				console.error('Error fetching category data:', error);
				// Handle the error or provide feedback to the user as needed
			}
		);
	}

	public food(input) {
		if (input.length >= 2) {
			this.api.nutritionix('search/instant?query=' + input + '&branded_type=2&branded_region=1').subscribe(res => {
				this.foods = res['branded'];
			});

			this.icon = true;
			this.hide = false;
		} else {
			this.icon = false;
			this.hide = true;
			this.grocerySelected = false;
		}
	}

	text(event) {
		let k;
		k = event.charCode;  //         k = event.keyCode;  (Both can be used)
		return ((k > 64 && k < 91) || (k > 96 && k < 123) || k === 8 || k === 32);
	}

	selectFood(v1, v2) {
		this.foods = [];
		this.grocery = v1 + '-' + v2;
		this.grocerySelected = true;
		this.icon = false;
		this.closed = true;

		if (this.filter !== '18203') {
			this.lists.forEach((b) => {
				if (b['id'] === this.filter) {
					let c = b['name'];
					// find product first then build url.

					this.router.navigate(['/groceries/', this.url(c)]);
				}
			});
		} else {
			this.router.navigate(['/groceries/']);
		}
	}

	close() {
		this.closed = false;
		this.grocerySelected = false;
		this.showDropdown = false;

		this.grocery = '';
	}

	search(event) {
		let a = event.target.value;

		if (event.keyCode === 13) {
			if (this.filter !== '18203') {
				this.lists.forEach((b) => {
					if (b['id'] === this.filter) {
						let c = b['name'];

						this.router.navigate(['/groceries/', this.url(c)]);
					}
				});
			} else {
				this.router.navigate(['/groceries/']);
			}
		}

	}

	dropdown() {
		this.showDropdown = !this.showDropdown;
		this.hide = true;
		this.icon = false;

	}

	dropdownSelect(v, x: number) {
		this.filter = v;

		this.sIndex = x;
		this.showDropdown = !this.showDropdown;
		this.first = false;

	}

	private url(i) {
		return i.toLowerCase().replace(/(?:( and )|(&)|(,)|(\s)|[/])+/g, '-');
	}
}

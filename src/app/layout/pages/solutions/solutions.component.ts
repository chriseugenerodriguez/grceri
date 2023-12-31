import { Component, OnInit, ViewChild } from '@angular/core';

// SERVICES
import { Router } from '@angular/router';

@Component({
	moduleId: module.id,
	selector: 'solutions',
	templateUrl: 'solutions.component.html'
})
export class SolutionsComponent implements OnInit {

	constructor(public router: Router) {
	}

	ngOnInit() {}

}

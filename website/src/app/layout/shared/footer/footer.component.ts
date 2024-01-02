import { Component, OnInit } from '@angular/core';

// SERVICES
import { Router } from '@angular/router';

@Component({
	moduleId: module.id,
	selector: 'footer-app',
	templateUrl: 'footer.component.html'
})
export class FooterComponent implements OnInit {

	constructor(public router: Router) {
	}

	ngOnInit() { }
}

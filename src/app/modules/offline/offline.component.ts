import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'app-offline',
	styleUrls: ['offline.component.scss'],
	templateUrl: 'offline.component.html'
})

export class OfflineComponent implements OnInit {
	constructor(
		private _router: Router
	) { }

	ngOnInit() {
		this.checkOnline();
	}

	checkOnline() {
		let onLine = navigator.onLine;

		if (onLine) { this._router.navigate(['/']); }
	}
}

import { Component, OnInit } from '@angular/core';

// SEO
import { Title } from '@angular/platform-browser';

// COMPONENT
@Component({
	moduleId: module.id,
	selector: 'notifications',
	templateUrl: 'notifications.component.html',
})

// CLASS
export class NotificationsComponent implements OnInit {
	constructor(title: Title) {
		title.setTitle('Notifications - grceri');
	}

	ngOnInit() {
		// If no default value in Status input, set filter to empty array
	}
}

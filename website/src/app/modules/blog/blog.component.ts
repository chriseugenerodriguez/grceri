import { Component, OnInit, OnDestroy } from '@angular/core';

// ROUTER
import { Router } from '@angular/router';

// SERVICES
import { SeoService, HttpCancelService } from '../../shared/services';

// ENV
import { environment } from '../../../environments/environment';

@Component({
	moduleId: module.id,
	selector: 'blog',
	templateUrl: 'blog.component.html',
	styleUrls: ['blog.component.scss'],
})
export class BlogComponent implements OnInit, OnDestroy {
	focus: boolean;
	fixed: boolean;

	constructor(public router: Router, private SS: SeoService, private httpCancelService: HttpCancelService) {
		// SEO
		this.SS.generateTags({
			title: 'Pricing - grceri',
			description: 'The official Grceri blog. Read stories about collaboration, the future of work, and what’s new from the team at Grceri.',
			url: this.router.url,
		});
	}

	ngOnInit() {}

	ngOnDestroy(): void {
		this.httpCancelService.cancelPendingRequests();
		if (!environment.production && !this.httpCancelService) {
			console.log('canceled pending request');
		}
	}

	showS(i) {
		this.focus = true;
	}
	hideS(i) {
		this.focus = false;
	}

	search(i) {
		this.router.navigate(['/blog/search/' + i]);
	}
}

import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { SeoService, HttpCancelService } from '../../shared/services';
import { Meta } from '@angular/platform-browser';

// ENV
import { environment } from '../../../environments/environment';

@Component({
	moduleId: module.id,
	selector: 'not-found',
	templateUrl: '404.component.html',
	styleUrls: ['404.component.scss']
})
export class NotFoundComponent implements OnDestroy {
	constructor(private SS: SeoService, private meta: Meta, private router: Router, private httpCancelService: HttpCancelService) {
		// SEO
		this.SS.generateTags({
			title: '404 | Grceri',
			description: 'Looks like this page you have written doesn`t exist, please try again',
			url: this.router.url,
		});

		// META
		this.meta.updateTag({ name: 'robots', content: 'noindex, nofollow' });
	}

	ngOnDestroy(): void {
		this.httpCancelService.cancelPendingRequests();
		if (!environment.production && !this.httpCancelService.cancelPendingRequests) {
			console.log('canceled pending request');
		}
	}
}

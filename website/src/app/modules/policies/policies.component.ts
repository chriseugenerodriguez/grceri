import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

// SERVICES
import { CMSService, HttpCancelService, SeoService } from '../../shared/services';

// SEO
import { Meta } from '@angular/platform-browser';

// ENV
import { environment } from '../../../environments/environment';

@Component({
	moduleId: module.id,
	selector: 'policies-container',
	templateUrl: 'policies.component.html',
	styleUrls: ['policies.component.scss'],
})

// CLASS
export class PoliciesComponent implements OnInit, OnDestroy {
	title: any;
	url: string;

	constructor(private route: ActivatedRoute, private router: Router, private CMS: CMSService, private SS: SeoService, private meta: Meta, private httpCancelService: HttpCancelService) {}

	ngOnInit(): void {
		this.meta.updateTag({ name: 'robots', content: 'noindex, nofollow' });

		this.route.firstChild.url.subscribe(urlPath => {
			this.url = urlPath[urlPath.length - 1].path;

			this.CMS.post('policy', this.url).then(r => {
				let a = r[0].data;

				// TITLE
				this.title = a.title[0].text;

				// SEO
				this.SS.generateTags({
					title: this.title + ' - grceri',
				});
			});
		});
	}

	ngOnDestroy(): void {
		this.httpCancelService.cancelPendingRequests();
		if (!environment.production && !this.httpCancelService) {
			console.log('canceled pending request');
		}
	}
}

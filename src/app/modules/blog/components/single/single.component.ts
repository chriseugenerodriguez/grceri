import { Component, Output } from '@angular/core';

// ROUTER
import { Router, ActivatedRoute } from '@angular/router';

// SERVICES
import { CMSService, SocialService, SeoService } from '../../../../shared/services';

@Component({
	moduleId: module.id,
	selector: 'blog-single',
	templateUrl: 'single.component.html'
})
export class BlogSingleComponent {
	post: any;
	day: any;
	time: any;


	@Output() title: string;

	constructor(
		private route: ActivatedRoute,
		public router: Router,
		public CMS: CMSService,
		public SS: SocialService,
		private SES: SeoService) {
		this.route.params.subscribe(r => {
			let a = r.name;

			this.CMS.post('post', a).then((res) => {
				// RES VARIABLES
				let b = res[0].data.title[0].text;
				let c = b + ' | The Official Grceri Blog ';
				let d = r[0].summary;
				let e = r[0].data['image'].url;

				// ARTICLE VARIABLES
				this.post = r[0];
				this.day = this.CMS.date(this.post.last_publication_date).toString().replace('GMT-0700 (Pacific Daylight Time)', '');
				let y = this.day.trim().split(/[ ]+/);
				this.time = this.CMS.toStandardTime(y[4]);
				this.day = y[0] + ', ' + y[1] + ' ' + y[2] + ' ' + y[3];

				// SEO
				this.SES.generateTags({
					title: c,
					description: d,
					url: this.router.url,
					image: e,
					type: 'article'
				});
			});
		});
	}

	lower(i) {
		return i.toLowerCase();
	}

	social(a) {
		return this.SS.social(a, this.post, 'post', this.router.url);
	}
}

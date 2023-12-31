import { Component, Output } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

// SERVICES
import { CMSService, SocialService } from '../../../../core';


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
		meta: Meta,
		title: Title,
		public CMS: CMSService,
		public SS: SocialService) {
		this.route.params.subscribe(r => {
			let a = r.name;

			this.CMS.post('post', a).then((r) => {
				console.log(r);

				let b = r[0].data.title[0].text;
				let c = b + ' | The Official Grceri Blog ';
				let d = r[0].summary;
				let e = r[0].data['image'].url;

				title.setTitle(c);
				meta.addTags([
					{ name: 'description', content: a },

					{ name: 'twitter:card', content: 'summary_large_image' },
					{ name: 'twitter:site', content: '@grceri' },
					{ name: 'twitter:title', content: a },
					{ name: 'twitter:description', content: d },
					{ name: 'twitter:image', content: e },

					{ name: 'og:url', content: this.router.url },
					{ name: 'og:type', content: 'website' },
					{ name: 'og:title', content: a },
					{ name: 'og:description', content: d },
					{ name: 'og:image', content: e }
				])

				this.post = r[0];
				this.day = this.CMS.date(this.post.last_publication_date).toString().replace('GMT-0700 (Pacific Daylight Time)', '');
				let y = this.day.trim().split(/[ ]+/);
				this.time = this.CMS.toStandardTime(y[4]);
				this.day = y[0] + ', ' + y[1] + ' ' + y[2] + ' ' + y[3];
			})
		});
	}

	lower(i) {
		return i.toLowerCase();
	}

	social(a) {
		return this.SS.social(a, this.post, 'post');
	}
}

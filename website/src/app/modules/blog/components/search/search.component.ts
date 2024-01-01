import { Component, OnInit } from '@angular/core';

// ROUTER
import { Router, ActivatedRoute } from '@angular/router';

// SERVICES
import { CMSService, SeoService } from '../../../../shared/services';

@Component({
	moduleId: module.id,
	selector: 'blog-search',
	templateUrl: 'search.component.html'
})
export class BlogSearchComponent implements OnInit {
	search: string;
	posts: any;

	constructor(
		private route: ActivatedRoute,
		public router: Router,
		private CMS: CMSService,
		private SS: SeoService) {

		this.route.params.subscribe(res => {
			let a = res.query;
			let b = 'Search Results: ' + a + ' | The Official Grceri Blog ';

			this.search = a;

			// SEO
			this.SS.generateTags({
				title: b,
				url: this.router.url
			});

			this.CMS.searchPosts(a, 1).then((r) => {
				this.posts = r;
			})

		});
	}

	ngOnInit() {
	}

	searchUpdate(i) {
		this.router.navigate(['/blog/search/' + i]);
	}

	private lower(i) {
		return i.toLowerCase();
	}
}

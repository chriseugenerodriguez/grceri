import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

// SERVICES
import { CMSService } from '../../../../core';

@Component({
	moduleId: module.id,
	selector: 'blog-search',
	templateUrl: 'search.component.html'
})
export class BlogSearchComponent implements OnInit {
	search: string;
	posts: any;

	constructor(private route: ActivatedRoute, public router: Router, meta: Meta, title: Title, private CMS: CMSService) {

		this.route.params.subscribe(r => {
			let a = r.query;
			let b = 'Search Results: ' + a + ' | The Official Grceri Blog ';

			this.search = a;

			title.setTitle(b);
			meta.addTags([
				{ name: 'twitter:title', content: b },
				{ name: 'og:url', content: this.router.url },
				{ name: 'og:title', content: b }
			])

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

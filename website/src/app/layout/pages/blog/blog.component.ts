import { Component, OnInit } from '@angular/core';

// META
import { Meta } from '@angular/platform-browser';

// SERVICES
import { Router, ActivatedRoute } from '@angular/router';

@Component({
	moduleId: module.id,
	selector: 'blog',
	templateUrl: 'blog.component.html'
})
export class BlogComponent implements OnInit {
	focus: boolean;
	fixed: boolean;

	constructor(
		private route: ActivatedRoute,
		public router: Router,
		meta: Meta
	) {
		let a = 'The official Grceri blog. Read stories about collaboration, the future of work, and what’s new from the team at Grceri.';

		meta.addTags([
			{ name: 'description', content: a },

			{ name: 'twitter:card', content: 'summary_large_image' },
			{ name: 'twitter:site', content: '@grceri' },
			{ name: 'twitter:description', content: a },

			{ name: 'og:url', content: this.router.url },
			{ name: 'og:type', content: 'website' },
			{ name: 'og:description', content: a }
		]);
	}

	ngOnInit() {
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

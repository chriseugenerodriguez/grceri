import { Component, OnInit } from '@angular/core';

// ROUTER
import { Router } from '@angular/router';

// SERVICES
import { CMSService, SeoService } from '../../../../shared/services';

@Component({
	moduleId: module.id,
	selector: 'blog-home',
	templateUrl: 'home.component.html'
})
export class BlogHomeComponent implements OnInit {
	// CATEGORIES
	newA: any;
	tipsA: any;
	healthierA: any;
	mostA: any;

	constructor(
		public router: Router,
		private CMS: CMSService,
		private SS: SeoService) {
		// SEO
		this.SS.generateTags({
			title: 'The Official Grceri Blog | Grceri',
			description: 'See what new articles coming fresh from groceries blog. Find health tips, latest news, and more..',
			url: this.router.url
		});
	}

	ngOnInit(): void {
		this.newGrceri();
		this.tipstricks();
		this.decisions();
		this.mostRead();
	}

	newGrceri() {
		this.CMS.postsNumber('new-at-grceri', 3).then((r) => {
			this.newA = r;
		});
	}

	tipstricks() {

	}

	decisions() {

	}

	mostRead() {

	}

	lower(i) {
		return i.toLowerCase();
	}
}

import { Component, OnInit, OnDestroy } from '@angular/core';

// ROUTER
import { Router, ActivatedRoute } from '@angular/router';

// INTERFACES
import { IHeader } from '../../interfaces/blog.interface';

// SERVICES
import { CMSService, SeoService } from '../../../../shared/services';

// RXJS
import { Subscription } from 'rxjs';

@Component({
	moduleId: module.id,
	selector: 'blog-category',
	templateUrl: 'category.component.html'
})
export class BlogCategoryComponent implements OnInit, OnDestroy {
	b: IHeader;
	newA: any;

	// SUBSCRIPTIONS
	private routerChangeSubscription: Subscription;

	constructor(
		private route: ActivatedRoute,
		public router: Router,
		private CMS: CMSService,
		private SS: SeoService) {
		this.routerChangeSubscription = this.route.params.subscribe(r => {
			let a = r.cat;

			if (a === 'new-at-grceri') {
				this.b = {
					title: 'New at Grceri',
					desc: 'Announcements, updates, releases, and more'
				}
			} else if (a === 'tips-tricks') {
				this.b = {
					title: 'Tips & Tricks',
					desc: 'Know-how to help you get more out of Grceri'
				}
			} else if (a === 'healthier-decisions') {
				this.b = {
					title: 'Healthier Decisions',
					desc: 'Food Tips for a healthier lifestyle'
				}
			}

			// SEO
			this.SS.generateTags({
				title: this.b.title + ' | The Official Grceri Blog',
				description: this.b.desc,
				url: this.router.url
			});

			this.CMS.posts(a).then((res) => {
				this.newA = res;
			});
		})
	}

	ngOnInit() { }

	ngOnDestroy(){
		if(this.routerChangeSubscription)
			this.routerChangeSubscription.unsubscribe();
	}

	private lower(i) {
		return i.toLowerCase();
	}
}

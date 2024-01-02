import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

import { Router, ActivatedRoute } from '@angular/router';

// CMS
import { CMSService, Header } from '../../../../core';

@Component({
	moduleId: module.id,
	selector: 'blog-category',
	templateUrl: 'category.component.html'
})
export class BlogCategoryComponent implements OnInit {
	b: Header;
	newA: any;

	constructor(private route: ActivatedRoute, public router: Router, meta: Meta, title: Title, private CMS: CMSService) {


		this.route.params.subscribe(r => {
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
			} else if ( a === 'healthier-decisions') {
				this.b = {
					title: 'Healthier Decisions',
					desc: 'Food Tips for a healthier lifestyle'
				}
			}

			title.setTitle( this.b.title + ' | The Official Grceri Blog');

			this.CMS.posts(a).then((r) => {
				this.newA = r;
			});
		})
	}

	ngOnInit() {}

	private lower(i) {
		return i.toLowerCase();
	}
}

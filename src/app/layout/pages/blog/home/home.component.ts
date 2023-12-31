import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

// CMS
import { CMSService } from '../../../../core';

@Component({
	moduleId: module.id,
	selector: 'blog-home',
	templateUrl: 'home.component.html'
})
export class BlogHomeComponent implements OnInit {

	newA: any;
	tipsA: any;
	healthierA: any;
	mostA: any;

	constructor(public router: Router, meta: Meta, title: Title, private CMS: CMSService) {
		title.setTitle('The Official Grceri Blog | Grceri');
		meta.addTags([
			{ name: 'description', content: 'See what new articles coming fresh from groceries blog. Find health tips, latest news, and more..' },
		]);
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

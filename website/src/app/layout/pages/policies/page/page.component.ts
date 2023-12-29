import { Component } from '@angular/core';

// SEO
import { Meta, Title } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';

// CMS
import { CMSService } from '../../../../core';

// COMPONENT
@Component({
	selector: 'policy',
	templateUrl: 'page.component.html',
})

// CLASS
export class PoliciesPageComponent {

	content: any;

	constructor(private route: ActivatedRoute, public router: Router, title: Title, meta: Meta, private CMS: CMSService) {
		this.route.params.subscribe(r => {
			this.CMS.post('policy', r.page).then((r) => {
				let a = r[0].data;

				title.setTitle(a.title[0].text + ' - Grceri');
				this.content = this.CMS.content(a.content);
			});
		})
	}
}

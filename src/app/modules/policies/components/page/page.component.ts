import { Component, OnInit } from '@angular/core';

// ROUTER
import { Router, ActivatedRoute } from '@angular/router';

// CMS
import { CMSService } from '../../../../shared/services';

@Component({
	selector: 'policies-page',
	templateUrl: 'page.component.html',
	styleUrls: ['page.component.scss']
})

// CLASS
export class PoliciesPageComponent implements OnInit {
	content: any;

	constructor(
		private route: ActivatedRoute,
		protected router: Router,
		private CMS: CMSService
	) {}

	ngOnInit() {
		this.route.params.subscribe(r => {
			this.CMS.post('policy', r.page).then((res) => {
				let a = res[0].data;

				// CONTENT
				this.content = this.CMS.content(a.content);
			});
		})
	}
}

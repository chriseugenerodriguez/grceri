import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// CMS
import { CMSService } from '../../../core';

// COMPONENT
@Component({
	moduleId: module.id,
	selector: 'policies',
	templateUrl: 'policies.component.html',
})

// CLASS
export class PoliciesComponent implements OnInit {
	title: any;

	constructor(private route: ActivatedRoute, private CMS: CMSService) {
		this.route.firstChild.url.subscribe((urlPath) => {
			const url = urlPath[urlPath.length - 1].path;

			this.CMS.post('policy', url).then((r) => {
				this.title = r[0].data.title[0].text
			});
		})
	}

	ngOnInit(): void {
	}

}

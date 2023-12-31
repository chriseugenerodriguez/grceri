import { Component, Input, OnInit } from '@angular/core';

@Component({
	selector: 'reviews-module-images',
	templateUrl: 'images.component.html',
})
export class ProductReviewsModuleImagesComponent implements OnInit {
	@Input() id: number;

	ngOnInit() {

	}

}

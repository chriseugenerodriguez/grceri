import { Component, ViewChild, ElementRef, Renderer2 } from '@angular/core';

// INTERFACES
import { IKeyValue } from '../../../../../../../../core';

@Component({
	selector: 'reviews-module-review',
	templateUrl: 'review.component.html',
})
export class ProductReviewsModuleReviewComponent {

	// CLICK HANDLERS
	@ViewChild('like') like: ElementRef;
	@ViewChild('report') report: ElementRef;

	// ACTIVE
	likeA: boolean;
	reportA: boolean;

	// COUNT
	likeCount: number;

	// IMAGES
	images: Array<Object>;

	_likeHandler = this.likeClick.bind(this);
	_reportHandler = this.reportClick.bind(this);

	// SORT
	sortBy: Array<IKeyValue>;
	defaultSort: IKeyValue;

	constructor(private renderer: Renderer2) {
		this.defaultSort = {
			id: 0, value: 'Top Reviews'
		}
		this.sortBy = [{
			id: 1, value: 'Most Recent'
		}]
	}

	likeClick() {
		this.like.nativeElement.addEventListener('click', this._likeHandler);
		this.renderer.addClass(this.like.nativeElement, 'active');
	}

	reportClick() {
		this.report.nativeElement.addEventListener('click', this._reportHandler);
		this.renderer.addClass(this.report.nativeElement, 'active');
	}
}

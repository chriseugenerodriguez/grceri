import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Renderer2 } from '@angular/core';

// SERVICES
import { LocalStorage, SeoService } from '../../../../../../../shared/services';

// INTERFACES
import { IProduct } from '../../../../../../../shared/interfaces';

// ROUTER
import { Router } from '@angular/router';

@Component({
	selector: 'compare-page',
	templateUrl: 'page.component.html',
})
export class ProductComparePageComponent implements OnInit, AfterViewInit {

	items: any;

	// PAGINATION
	@ViewChild('pag', {static: false}) UL: ElementRef;
	@ViewChild('item', {static: false}) ITEM: ElementRef;

	// CLICK HANDLERS
	@ViewChild('left', {static: false}) leftC: ElementRef;
	@ViewChild('right', {static: false}) rightC: ElementRef;

	_rightHandler = this.carouselRight.bind(this);
	_leftHandler = this.carouselLeft.bind(this);

	// CALCULATIONS
	shownItems = 5;
	length: number;
	item: number;
	totalWidth: number;
	marginLeft: number;

	constructor(
		private LS: LocalStorage,
		private SS: SeoService,
		private router: Router,
		private renderer: Renderer2) {
		// SEO
		this.SS.generateTags({
			title: 'Compare Groceries - grceri',
			description: 'See which groceries are the best for you with our compare tool. Easily add, analyse and make decisions faster.',
			url: this.router.url
		});
	}

	ngOnInit(): void {
		// this.LS.get('compare').subscribe((r) => {
		// 	this.items = r;
		// })

		let r = this.LS.get('compare');
		if (r) {
			this.items = r;
		}

	}

	ngAfterViewInit() {
		this._calculateItems();
	}

	carouselLeft() {
		this.marginLeft += this.item;
		this._movePag(this.marginLeft);
		this._calculatePag();
	}

	carouselRight() {
		this.marginLeft -= this.item;
		this._movePag(this.marginLeft);
		this._calculatePag();
	}

	private _calculateItems() {
		// BASIC CONFIGURATION
		this.item = this.ITEM.nativeElement.offsetHeight;

		// RESET PAG
		this._resetPag();
	}

	private _resetPag() {
		this.length = this.items.length;
		this.totalWidth = (this.length * this.item) - (this.item * this.shownItems);
		this.marginLeft = 0;

		if (this.length > this.shownItems) {
			this.renderer.addClass(this.rightC.nativeElement, 'active');
			this.renderer.removeClass(this.leftC.nativeElement, 'active');
			this.rightC.nativeElement.addEventListener('click', this._rightHandler);
		}
	}

	private _calculatePag() {
		if (Math.abs(this.marginLeft) !== this.totalWidth) {
			this.renderer.addClass(this.rightC.nativeElement, 'active');
			this.rightC.nativeElement.addEventListener('click', this._rightHandler);

			if (this.marginLeft !== 0) {
				this.renderer.addClass(this.leftC.nativeElement, 'active');
				this.leftC.nativeElement.addEventListener('click', this._leftHandler);
			} else {
				this.renderer.removeClass(this.leftC.nativeElement, 'active');
				this.leftC.nativeElement.removeEventListener('click', this._leftHandler);
			}
		} else {
			this.renderer.removeClass(this.rightC.nativeElement, 'active');
			this.rightC.nativeElement.removeEventListener('click', this._rightHandler);

			if (this.marginLeft === 0) {
				this.renderer.removeClass(this.leftC.nativeElement, 'active');
				this.leftC.nativeElement.removeEventListener('click', this._leftHandler);
			} else {
				this.renderer.addClass(this.leftC.nativeElement, 'active');
				this.leftC.nativeElement.addEventListener('click', this._leftHandler);
			}
		}
	}

	private _movePag(i) {
		this.renderer.setStyle(this.UL.nativeElement, 'margin-top', i + 'px');
	}

	private _close(i) {
		let a = this.items.filter(r => r.sem3_id !== i.sem3_id);
		this.LS.set('compare', a);
	}

	private _add(i: IProduct) {
		let a = this.items.filter(r => r.sem3_id !== i.sem3_id);

		if (i) {
			this.LS.set('compare', a);
		}
	}

}

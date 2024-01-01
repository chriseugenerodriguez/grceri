import { Component, Input, OnChanges, AfterViewInit, ElementRef, ViewChild, Renderer2 } from '@angular/core';

// INTERFACE
import { Product } from '../../../../../../core';

@Component({
	selector: 'product-carousel',
	templateUrl: 'carousel.component.html',
})
export class ProductCarouselComponent implements OnChanges, AfterViewInit {

	@Input() data: any;

	// PAGINATION
	@ViewChild('pag') UL: ElementRef;
	@ViewChild('item') ITEM: ElementRef;

	// CLICK HANDLERS
	@ViewChild('left') leftC: ElementRef;
	@ViewChild('right') rightC: ElementRef;

	product: Product;
	activeProduct: any;

	// CALCULATIONS
	shownItems: number;
	length: number;
	item: number;
	totalWidth: number;
	marginLeft: number;

	// ARROWS
	left: boolean;
	right: boolean;

	constructor(private renderer: Renderer2) {
		this.shownItems = 5;
	}

	ngOnChanges() {
		this.product = this.data;
		this.activeProduct = this.product['images'][0];

		// RESET UL
		if (this.UL) {
			this.renderer.removeStyle(this.UL.nativeElement, 'margin-top');

			if (this.leftC || this.rightC) {
					// RESET PAG
				this._resetPag();
			}
		}
	}

	ngAfterViewInit() {
		this._calculateItems();
	}

	_rightHandler = this.carouselRight.bind(this);
	_leftHandler = this.carouselLeft.bind(this);

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
		this.length = this.data.images_total;
		this.totalWidth = (this.length * this.item) - (this.item * this.shownItems);
		this.marginLeft = 0;

		if (this.length > this.shownItems) {
			this.renderer.addClass(this.rightC.nativeElement, 'active');
			this.renderer.removeClass(this.leftC.nativeElement, 'active');
			this.rightC.nativeElement.addEventListener('click', this._rightHandler);
		}
	}

	private _activeProducts(i) {
		this.activeProduct = i;
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
}

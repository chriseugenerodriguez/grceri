import {
	AfterViewInit, Component, ContentChildren, Directive, ElementRef,
	Input, QueryList, ViewChild, SimpleChanges, ViewChildren, Renderer2, ChangeDetectionStrategy,
	ChangeDetectorRef, HostListener
} from '@angular/core';

import { sliderItemDirective } from './slider.directive';

// ENV
import { environment } from '../../../../environments/environment';
import * as Hammer from 'hammerjs';

@Directive({
	selector: '.slider-wrapper__inner__item'
})

export class sliderItemElement {
}

@Component({
	selector: 'slider',
	exportAs: 'slider',
	templateUrl: 'slider.html',
	styleUrls: ['slider.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})

export class SliderComponent implements AfterViewInit {

	// CONTAINER
	@ViewChild('ul', { static: false }) UL: ElementRef;

	// ITEMS
	@ContentChildren(sliderItemDirective) items: QueryList<sliderItemDirective>;
	@ViewChildren(sliderItemElement, { read: ElementRef }) private itemsElements: QueryList<ElementRef>;

	// OPTIONS
	@Input() showC: any = true;
	@Input() showP: any = true;
	@Input() count: number;
	@Input() multiple: boolean;
	@Input() touchEnabled = false;

	// CLICK HANDLERS
	@ViewChild('left', { static: false }) leftC: ElementRef;
	@ViewChild('right', { static: false }) rightC: ElementRef;

	// CALCULATIONS
	length: number;
	innerItemWidth: number;
	totalWidth: number;
	width: number;
	marginLeft: number;
	currentpag: number;
	totalpag: number;
	// x0: any;

	// ARROWS
	left: boolean;
	right: boolean;

	constructor(private ref: ChangeDetectorRef, private el: ElementRef, private renderer: Renderer2) {
		this.currentpag = 0;
	}

	@HostListener('window:resize', ['$event'])
	onResize(event) {
		// this.itemsElements.changes.subscribe(
		// 	r => this.calculateItems()
		// );
		this.calculateItems();

		// RESET
		this.marginLeft = 0;
		this.currentpag = 0;

		this._movePag(this.marginLeft);
		this._calculatePag();
	}

	ngAfterViewInit() {
		if (this.showP === 'false') {
			this.showP = false;
		}

		if (this.showC === 'false') {
			this.showC = false;
		}

		this.calculateItems();
		this.itemsElements.changes.subscribe(
			r => this.calculateItems()
		);

		this.integrateHammerSwipe();

		this.ref.detach();
	}

	calculateItems() {
		this.multiple = this.el.nativeElement.getAttribute('multiple') == null ? false : true;
		this.count = this.el.nativeElement.getAttribute('count') == null ? 1 : this.el.nativeElement.getAttribute('count');

		// CONTAINER
		this.width = this.el.nativeElement.offsetWidth;

		// ITEMS
		this.innerItemWidth = (this.width) / (this.count);

		this.itemsElements['_results'].forEach(r => {
			this.renderer.setStyle(r.nativeElement, 'width', this.innerItemWidth + 'px');
		});

		this._resetPag();
	}

	_rightHandler = this.carouselRight.bind(this);
	_leftHandler = this.carouselLeft.bind(this);

	carouselLeft() {
		this.marginLeft += this.width;
		this.currentpag -= 1;
		this._movePag(this.marginLeft);
		this._calculatePag();
	}

	carouselRight() {
		this.marginLeft -= this.width;
		this.currentpag += 1;
		this._movePag(this.marginLeft);
		this._calculatePag();
	}

	clickPag(i) {
		if (i !== this.currentpag) {
			if (this.currentpag < i) {
				this.carouselRight()
			}
			if (this.currentpag > i) {
				this.carouselLeft()
			}
		}
		this.ref.detectChanges();
	}

	private _getPagination(i) {
		if (this.multiple) {
			let a = i.length / this.count
			if (a <= 1) {
				this.totalpag = 0;
			} else {
				this.totalpag = Math.ceil(a);
			}

		} else {
			this.totalpag = Math.ceil(i.length)
		}
		return [...Array(this.totalpag)];
	}

	private _calculatePag() {
		if (!this.leftC || !this.rightC) {
			return false;
		}

		if (Math.abs(this.marginLeft) < this.totalWidth) {
			this.renderer.addClass(this.rightC.nativeElement, 'active');
			this.rightC.nativeElement.addEventListener('click', this._rightHandler);

			if (Math.abs(this.marginLeft) !== 0) {
				this.renderer.addClass(this.leftC.nativeElement, 'active');
				this.leftC.nativeElement.addEventListener('click', this._leftHandler);
			} else {
				this.renderer.removeClass(this.leftC.nativeElement, 'active');
				this.leftC.nativeElement.removeEventListener('click', this._leftHandler);
			}
		} else {
			this.renderer.removeClass(this.rightC.nativeElement, 'active');
			this.rightC.nativeElement.removeEventListener('click', this._rightHandler);

			if (Math.abs(this.marginLeft) === 0) {
				this.renderer.removeClass(this.leftC.nativeElement, 'active');
				this.leftC.nativeElement.removeEventListener('click', this._leftHandler);
			} else {
				this.renderer.addClass(this.leftC.nativeElement, 'active');
				this.leftC.nativeElement.addEventListener('click', this._leftHandler);
			}
		}

		let itemsLength: number = this.items.length;
		let frameCount: number = this.multiple ? (itemsLength / this.count) : itemsLength;

		if (this.currentpag >= frameCount) {
			this.renderer.removeClass(this.rightC.nativeElement, 'active');
			this.rightC.nativeElement.removeEventListener('click', this._rightHandler);
		}

		this.ref.detectChanges();
	}

	private _movePag(i) {
		this.renderer.setStyle(this.UL.nativeElement, 'margin-left', i + 'px');

		this.ref.detectChanges();
	}

	private _resetPag() {
		this.length = this.itemsElements.length;
		this.totalWidth = (this.length * this.innerItemWidth) - (this.innerItemWidth * this.count);

		this.currentpag = 0;
		this.marginLeft = 0;

		if (this.length > this.count && this.showC) {
			this.renderer.addClass(this.rightC.nativeElement, 'active');
			this.renderer.removeClass(this.leftC.nativeElement, 'active');
			this.rightC.nativeElement.addEventListener('click', this._rightHandler);
		}

		// WIDTH
		this.renderer.setStyle(this.UL.nativeElement, 'width', (this.length * this.innerItemWidth) + 'px');

		this.ref.detectChanges();
	}

	integrateHammerSwipe(): boolean | void {
		if (!this.touchEnabled) { return false; }

		let el = this.UL.nativeElement;

		let hammer = new Hammer(el);

		hammer.on('swipeleft', (ev) => {
			let itemsLength: number = this.items.length;

			let frameCount: number = this.multiple ? (itemsLength / this.count) : itemsLength;

			if (this.currentpag < (frameCount - 1)) {
				let selectedPage: number = this.currentpag + 1;

				this.clickPag(selectedPage);
			}

			this._formatCurrentPage();

			if (!environment.production) {
				console.log('swipeleft', this.currentpag);
			}
		});

		hammer.on('swiperight', (ev) => {
			let itemsLength: number = this.items.length;

			if (this.currentpag > 0) {
				let selectedPage: number = this.currentpag - 1;

				this._formatCurrentPage();

				this.clickPag(selectedPage);

				this._formatCurrentPage();

				if (!environment.production) {
					console.log('swiperight', this.currentpag);
				}
			}
		});

		Hammer.on(el, 'mouseup', (e) => {
			this._formatCurrentPage();
		});
	}

	private _formatCurrentPage(): void {
		let itemsLength: number = this.items.length;

		let frameCount: number = this.multiple ? (itemsLength / this.count) : itemsLength;

		if (this.currentpag < 0) {
			this.currentpag = 0;
		} else if (this.currentpag >= frameCount) {
			this.currentpag = frameCount - 1;
		}
	}
}

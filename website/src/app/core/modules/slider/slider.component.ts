import { AfterViewInit, Component, ContentChildren, Directive, ElementRef, Input, OnInit, QueryList, TemplateRef, ViewChild, ViewChildren, Renderer2 } from '@angular/core';
import { sliderItemDirective } from './slider.directive';
import { animate, AnimationBuilder, AnimationFactory, AnimationPlayer, style } from '@angular/animations';

@Directive({
	selector: '.slider-wrapper__inner__item'
})
export class sliderItemElement {
}

@Component({
	selector: 'slider',
	exportAs: 'slider',
	templateUrl: 'slider.html'
})

export class sliderComponent implements AfterViewInit {

	@ContentChildren(sliderItemDirective) items: QueryList<sliderItemDirective>;
	@ViewChildren(sliderItemElement, { read: ElementRef }) private itemsElements: QueryList<ElementRef>;
	@ViewChild('slider') private slider: ElementRef;

	@Input() timing = '250ms ease-in';
	@Input() showControls = true;
	@Input() showPagination = true;
	@Input() innerItemWidth: number;

	private player: AnimationPlayer;
	private itemWidth: number;
	private itemWidthTotal: number;
	private currentSlide = 0;
	public multiple: boolean = false;
	private multipleItem: number = 1;
	private itemCount: number;

	right: boolean;
	left: boolean;

	style = {};
	width = {};

	constructor(private builder: AnimationBuilder, private elm: ElementRef, private renderer: Renderer2) {
		this.multiple = elm.nativeElement.getAttribute('multiple') == null ? false : true;
		this.itemCount = elm.nativeElement.getAttribute('items') == null ? 1 : elm.nativeElement.getAttribute('items');
	}

	ngAfterViewInit() {
		this.multipleItem = this.multiple ? this.items.length : 1;

		this.calculateItems();
		this.itemsElements.changes.subscribe((r) => { this.calculateItems(); });
	}

	calculateItems() {
		// ITEMS
		this.innerItemWidth = (this.elm.nativeElement.offsetWidth) / (this.itemCount);
		this.itemsElements['_results'].forEach(r => {
			this.renderer.setStyle(r.nativeElement, 'width', this.innerItemWidth + 'px');
		});

		// CONTAINER
		this.itemWidth = this.elm.nativeElement.offsetWidth;

		this.style = {
			width: `${this.itemWidth}px`
		}

		// TOTAL
		this.itemWidthTotal = (this.innerItemWidth) * (this.items.length);

		this.width = {
			width: `${this.itemWidthTotal}px`
		}

		if (this.items.length > this.itemCount || this.currentSlide === this.items.length) {
			this.right = true;
			this.left = false;
		}
	}


	next() {
		if (this.items.length > this.itemCount || this.currentSlide === this.items.length) {
			this.right = true;
			this.left = false;
		} else {
			this.left = true;
			this.right = false;
		}
		if (this.multiple) {
			this.currentSlide = (+this.multipleItem + (this.currentSlide ? this.currentSlide : 0)) % this.items.length;
		} else {
			this.currentSlide = (this.currentSlide + 1) % this.items.length;
		}
		const offset = this.currentSlide * this.itemWidth;
		const myAnimation: AnimationFactory = this.buildAnimation(offset);
		this.player = myAnimation.create(this.slider.nativeElement);
		this.player.play();
	}

	private buildAnimation(offset) {
		return this.builder.build([
			animate(this.timing, style({ transform: `translateX(-${offset}px)` }))
		]);
	}

	private getPagination(items) {
		let count: number;

		if (this.multiple) {
			let a = items.length / this.itemCount
			if (a <= 1) {
				count = 0;
			} else {
				count = Math.ceil(a);
			}

		} else {
			count = Math.ceil(items.length)
		}
		return [...Array(count)];
	}

	private prev() {
		if (this.items.length < this.itemCount || this.currentSlide === this.items.length) {
			this.right = true;
			this.left = false;
		} else {
			this.left = true;
			this.right = false;
		}
		if (this.multiple) {
			this.currentSlide = (+(this.currentSlide ? this.currentSlide : 0) - (+this.multipleItem)) % this.items.length;
		} else {
			this.currentSlide = ((this.currentSlide - 1) + this.items.length) % this.items.length;
		}
		const offset = this.currentSlide * this.itemWidth;

		const myAnimation: AnimationFactory = this.buildAnimation(offset);
		this.player = myAnimation.create(this.slider.nativeElement);
		this.player.play();
	}

	private goToSlide(index) {
		this.currentSlide = (index) % this.items.length;
		if (this.multiple && index >= 1) {
			this.currentSlide = (this.multipleItem * (index)) % this.items.length;
		}
		const offset = this.currentSlide * this.itemWidth;
		const myAnimation: AnimationFactory = this.buildAnimation(offset);
		this.player = myAnimation.create(this.slider.nativeElement);
		this.player.play();
	}
}

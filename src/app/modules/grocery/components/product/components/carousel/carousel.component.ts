import {
	Component, Input, Output, OnInit,
	OnDestroy, AfterViewInit,
	EventEmitter, ElementRef, ViewChild, Renderer2, ChangeDetectorRef, ChangeDetectionStrategy
} from '@angular/core';

// SERVICES
import { ProductAPIService } from '../../../../../../shared/services/api/api.service';

// INTERFACES
import { IProductImages } from '../../../../../../shared/interfaces/product/product-images.interface';

// rxjs
import { Subject, Subscription } from 'rxjs';

// DOM
import { DomSanitizer } from '@angular/platform-browser';

// ENV
import { environment } from '../../../../../../../environments/environment';

@Component({
	selector: 'product-carousel',
	templateUrl: 'carousel.component.html',
	styleUrls: ['carousel.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductCarouselComponent implements OnInit, OnDestroy, AfterViewInit {
	// INPUT
	@Input() productID: number;

	// OUTPUT
	@Output() getCarouselImagesOutput: EventEmitter<any> = new EventEmitter<any>();

	// PAGINATION
	@ViewChild('pag', {static: false}) UL: ElementRef;
	@ViewChild('item', {static: false}) ITEM: ElementRef;

	// CLICK HANDLERS
	@ViewChild('left', {static: false}) leftC: ElementRef;
	@ViewChild('right', {static: false}) rightC: ElementRef;

	// INTERFACES
	product: IProductImages;

	// PRODUCT
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

	// SUBJECTS
	private productImages$ = new Subject<IProductImages>();

	// SUBSCRIPTIONS
	productImagesSubscription: Subscription;

	// STRING
	// load = require('../../../../../../../assets/img/blank.jpg');
	load = './assets/img/blank.jpg';

	constructor(private productAPI: ProductAPIService, private changeDetector: ChangeDetectorRef, private renderer: Renderer2, public sanitizer: DomSanitizer) {
		this.shownItems = 5;
	}

	ngOnInit() {
		this.processProductCarouselSubscription();
	}

	ngAfterViewInit() {
		if (this.product && this.product.count > 1 && this.UL) {
			this._calculateItems();
		}

		this.changeDetector.detach();
	}

	ngOnDestroy() {
		if (this.productImagesSubscription) {
			this.productImagesSubscription.unsubscribe();
		}
	}

	/**
	* Process product carousel data from API
	*/
	private processProductCarouselSubscription() {
		this.productAPI.getProductImages(this.productID).subscribe((res) => {
			this.productImages$.next(res);
		});

		this.renderProductImagesSubscriptionDataToComponent();
	}

	/**
	* Get product images subscription data and render to component
	*/
	private renderProductImagesSubscriptionDataToComponent() {
		this.productImagesSubscription = this.productImages$.subscribe(res => {
			this.product = res;

			this.getCarouselImagesOutput.emit(this.product.images);

			this.activeProduct = this.product['images'] ? this.product['images'][0]['sizes'].desktop : undefined;

			this.resetULUponHavingImages();

			this.changeDetector.detectChanges();
		});
	}

	/**
	* Reset thumbnail ul element upon having images for carousel
	*/
	private resetULUponHavingImages() {
		// RESET UL
		if (this.product.count > 1 && this.UL) {
			this.renderer.removeStyle(this.UL.nativeElement, 'margin-top');

			if (this.leftC || this.rightC) {
				// RESET PAG
				this._resetPag();
			}
		}
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
		this.length = this.product.count;
		this.totalWidth = (this.length * this.item) - (this.item * this.shownItems);
		this.marginLeft = 0;

		if (this.length > this.shownItems) {
			this.renderer.addClass(this.rightC.nativeElement, 'active');
			this.renderer.removeClass(this.leftC.nativeElement, 'active');
			this.rightC.nativeElement.addEventListener('click', this._rightHandler);
		}

		this.changeDetector.detectChanges();
	}

	private _activeProducts(i) {
		this.activeProduct = i;
		this.changeDetector.detectChanges();
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

		this.changeDetector.detectChanges();
	}

	private _movePag(i) {
		this.renderer.setStyle(this.UL.nativeElement, 'margin-top', i + 'px');

		this.changeDetector.detectChanges();
	}
}

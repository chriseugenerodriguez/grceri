import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// INTERFACE
import { Product, CartService } from '../../../../../../core';

@Component({
	selector: 'product-added',
	templateUrl: 'added.component.html',
})
export class ProductAddedComponent implements OnInit {
	// TOGGLE
	@Output() open = new EventEmitter<boolean>(true);

	@Input() added: Product;

	addedToCart: boolean;
	product: any;
	cartQty: Observable<number>;

	items: any;

	constructor(
		private CS: CartService,
		private http: HttpClient,
	) { }

	ngOnInit(): void {
		// DIALOG
		this.cartQty = this.totalQuantity();

		this.product = this.added;
		this.products();
	}

	public products() {
		this.http.get('/assets/json/products.json').subscribe(r => {
			this.items = r;
		});
	}

	dialog(i) {
		if (i === 'close') {
			this.open.emit(false);
		}
	}

	public totalQuantity(): Observable<number> {
		return this.CS.getTotalQuantity();
	}

	public getTotalAmount(): Observable<number> {
		return this.CS.getTotalAmount();
	}

	public getTotalSavings(): Observable<number> {
		return this.CS.getTotalSavings();
	}
}
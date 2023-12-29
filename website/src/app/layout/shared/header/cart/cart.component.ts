import { Component, OnInit } from '@angular/core';

import { CartService, LocalStorage } from '../../../../core/index';

import { Observable } from 'rxjs';

@Component({
	selector: 'shopping-cart',
	templateUrl: './cart.component.html'
})
export class ShoppingCartComponent implements OnInit {

	constructor(private CS: CartService, protected LS: LocalStorage) {
	}

	ngOnInit() {
	}

	public totalQuantity(): Observable<number> {
		return this.CS.getTotalQuantity();
	}
}

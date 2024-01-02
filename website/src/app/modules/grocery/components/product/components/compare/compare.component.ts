import { Component, EventEmitter, Output, OnDestroy } from '@angular/core';

// ROUTER
import { Router } from '@angular/router';

// SERVICES
import { LocalStorage } from '../../../../../../shared/services';

//RxJS
import { Subscription } from 'rxjs';

@Component({
	selector: 'product-compare',
	templateUrl: 'compare.component.html',
	styleUrls: ['compare.component.scss']
})
export class ProductCompareComponent implements OnDestroy {
	items: any;

	// productCompareSubscription: Subscription;

	constructor(
		private router: Router,
		private LS: LocalStorage) {
		this.processProductCompareSubscription();
	}

	ngOnDestroy() {
		// if(this.productCompareSubscription)
		// 	this.productCompareSubscription.unsubscribe();
	}

	/**
	* Process product compare subscription and assign result to products
	*/
	private processProductCompareSubscription() {
		// this.productCompareSubscription = this.LS.get('compare').subscribe((r) => {
		// 	if (r) {
		// 		this.items = r;
		// 	}
		// });

		let r = this.LS.get('compare');
		if (r) {
			this.items = r;
		}

	}

	clear() {
		this.items = null;
		return this.LS.remove('compare');
	}

	remove(i) {
		let a = this.items.filter(r => r !== i);

		this.LS.set('compare', a);
	}

	compare() {
		this.router.navigate(['/groceries/compare']);
	}
}

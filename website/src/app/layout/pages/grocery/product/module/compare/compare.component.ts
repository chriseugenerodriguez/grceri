import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

// SERVICES
import { LocalStorage } from '../../../../../../core';

@Component({
	selector: 'product-compare',
	templateUrl: 'compare.component.html',
})
export class ProductCompareComponent {
	items: any;

	constructor(private router: Router, private LS: LocalStorage) {
		this.LS.get('compare').subscribe((r) => {
			if (r) {
				this.items = r;
			}
		});
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

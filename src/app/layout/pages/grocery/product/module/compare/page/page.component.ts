import { Component, EventEmitter, Output, OnInit } from '@angular/core';

// SERVICES
import { LocalStorage, Product, CartService } from '../../../../../../../core';

// SEO
import { Title, Meta } from '@angular/platform-browser';

@Component({
	selector: 'compare-page',
	templateUrl: 'page.component.html',
})
export class ProductComparePageComponent implements OnInit {

	items: any;

	constructor(private LS: LocalStorage, private title: Title, private meta: Meta, private CS: CartService) {
		this.title.setTitle('Compare Groceries - Grceri');
		this.meta.addTag({ name: 'description', content: 'See which groceries are the best for you with our compare tool. Easily add, analyse and make decisions faster.' });
	}

	ngOnInit(): void {
		this.LS.get('compare').subscribe((r) => {
			this.items = r;
		})
	}

	close(i) {
		let a = this.items.filter(r => r.sem3_id !== i.sem3_id);
		this.LS.set('compare', a);
	}

	add(i: Product) {
		let a = this.items.filter(r => r.sem3_id !== i.sem3_id);

		if (i) {
			this.CS.addToCart(i);
			this.LS.set('compare', a);
		}
	}
}

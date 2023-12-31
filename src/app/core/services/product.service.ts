
import { Product } from '../../core/interfaces/product.interface';

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';

@Injectable()
export class ProductsService {

	public selectedProduct: Product = null;

	constructor(
		private http: HttpClient
	) {
	}

	public getProducts(i) {
		return this.products(i);
	}

	public getProduct(cid): Observable<any[]> {
		return this.products().pipe(
			map(products => {
				const formattedCategory = this.formatCategoryName(cid);

				return products.map(productList =>
					productList.filter(product =>
						this.formatCategoryName(product['category']) === formattedCategory
					)
				);
			})
		);
	}

	private formatCategoryName(name: string): string {
		const formattedName = name.replace(/-/g, ' ');
		return formattedName
			.split(' ')
			.map((s) => s.charAt(0).toUpperCase() + s.substring(1))
			.join(' ');
	}

	products(id?: number): Observable<any[]> {
		return this.http.get<any[]>('/assets/json/products.json');
	}
}
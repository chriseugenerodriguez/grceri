
import { Product } from '../../core/interfaces/product.interface';

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of, catchError, switchMap, expand, reduce, EMPTY, shareReplay, throwError, combineLatest } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable()
export class ProductsService {

	public selectedProduct: Product = null;
	private catalog$: Observable<any[]>;

	constructor(
		private http: HttpClient
	) {
	}

	public getProducts(i) {
		return combineLatest([this.products(), this.http.get<any>('/assets/json/category.json')]).pipe(
			map(([products, tree]) => {
				const ids = new Set<string>();
				const collect = (node: any, matched = false) => {
					const included = matched || String(node.id) === String(i);
					if (included) ids.add(String(node.id));
					(node.category || node.sub || node.categories || []).forEach(child => collect(child, included));
				};
				collect(tree.groceries);
				return products.filter(product => ids.has(String(product.cat_id)));
			})
		);
	}

	public getProduct(cid, productSlug?: string): Observable<any[]> {
		return this.products().pipe(
			map(products => products.filter(product =>
				this.slug(product.category) === this.slug(cid) &&
				(!productSlug || this.slug(product.name) === productSlug)
			))
		);
	}

	private slug(value: string): string {
		return String(value || '').toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-{2,}/g, '-');
	}

	// A committed snapshot keeps static deployments independent of database availability.
	productPath = 'products-demo.json';
	products(id?: number): Observable<any[]> {
		if (!this.catalog$) {
			this.catalog$ = this.http.get<{ mode?: string; url?: string; anonKey?: string }>('/assets/demo-config.json').pipe(
				// Static hosts can rewrite a missing config file to their HTML app shell.
				catchError(error => error.status === 404 || (error.status === 200 &&
					/^\s*<!doctype html/i.test(error.error?.text || '')) ? of(null) : throwError(() => error)),
				switchMap(config => {
					if (!config) return this.http.get<any[]>('/assets/json/' + this.productPath);
					if (config.mode === 'snapshot') return this.http.get<any[]>('/assets/json/products-demo.json');
					if (!config.url || !config.anonKey) return throwError(() => new Error('Invalid demo catalog configuration'));
					const headers: { [key: string]: string } = { apikey: config.anonKey };
					if (!config.anonKey.startsWith('sb_')) headers.Authorization = `Bearer ${config.anonKey}`;
					const page = (offset: number) => this.http.get<Array<{ payload: any }>>(
						`${config.url}/rest/v1/demo_products?select=payload&order=id&limit=100&offset=${offset}`, { headers });
					return page(0).pipe(
						expand((rows, index) => rows.length === 100 ? page((index + 1) * 100) : EMPTY),
						reduce((all, rows) => all.concat(rows.map(row => row.payload)), [] as any[])
					);
				}),
				shareReplay({ bufferSize: 1, refCount: false })
			);
		}
		return this.catalog$;
	}
}

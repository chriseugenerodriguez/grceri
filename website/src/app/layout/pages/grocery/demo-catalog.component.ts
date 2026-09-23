import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { combineLatest, map, catchError, of, shareReplay } from 'rxjs';
import { ProductsService } from '../../../core/services/product.service';
import { catalogIndex, catalogPage } from '../../../core/services/catalog-search';

@Component({
  selector: 'demo-catalog',
  template: `
    <main class="container" style="padding-top: 32px; padding-bottom: 48px">
      <h1>Browse groceries</h1>
      <p>Explore the sample catalog. Prices are for demonstration.</p>
      <ng-container *ngIf="results$ | async as result; else loading">
        <p role="alert" *ngIf="result.error">{{ result.error }}</p>
        <p role="status" *ngIf="!result.error">{{ result.total }} products<span *ngIf="result.query"> matching “{{ result.query }}”</span><span *ngIf="result.total">. Showing {{ result.start }}–{{ result.end }}.</span></p>
        <p *ngIf="!result.error && !result.products.length">No products found. Try another search or <a routerLink="/groceries/all">view all products</a>.</p>
        <div class="catalog-grid">
          <article *ngFor="let product of result.products; trackBy: trackProduct">
            <a [routerLink]="['/grocery', slug(product.category), slug(product.name)]">
              <img loading="lazy" [src]="product.images?.[0] || '/assets/svg/cart.svg'" [alt]="product.name" (error)="imageError($event)" style="height: 160px; width: 100%; object-fit: contain">
              <h2 style="font-size: 18px">{{ product.name }}</h2>
            </a>
            <p>{{ product.brand }} · {{ product.price | currency: (product.price_currency || 'USD') }}</p>
          </article>
        </div>
        <nav *ngIf="!result.error && result.pages > 1" aria-label="Catalog pages" class="catalog-pages">
          <a *ngIf="result.page > 1" [routerLink]="[]" [queryParams]="{ page: result.page - 1 }" queryParamsHandling="merge" class="btn">Previous page</a>
          <span>Page {{ result.page }} of {{ result.pages }}</span>
          <a *ngIf="result.page < result.pages" [routerLink]="[]" [queryParams]="{ page: result.page + 1 }" queryParamsHandling="merge" class="btn">Next page</a>
        </nav>
      </ng-container>
      <ng-template #loading><p role="status">Loading products…</p></ng-template>
    </main>`,
  styles: [`
    .catalog-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 24px; }
    .catalog-grid article { min-width: 0; overflow-wrap: anywhere; }
    .catalog-pages { display: flex; justify-content: center; align-items: center; flex-wrap: wrap; gap: 16px; padding-top: 24px; }
    @media (max-width: 991px) { .catalog-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
    @media (max-width: 575px) { .catalog-grid { grid-template-columns: minmax(0, 1fr); } }
  `]
})
export class DemoCatalogComponent {
  results$;
  constructor(private products: ProductsService, private route: ActivatedRoute, private http: HttpClient) {
  const index$ = combineLatest([this.products.products(), this.http.get('/assets/json/category.json')]).pipe(
    map(([products, tree]) => catalogIndex(products, tree)), shareReplay({ bufferSize: 1, refCount: false }));
  this.results$ = combineLatest([index$, this.route.queryParamMap]).pipe(
    map(([index, params]) => {
      const query = (params.get('q') || '').trim();
      return catalogPage(index, query, params.get('page'));
    }),
    catchError(() => of({ ...catalogPage([], '', 1), error: 'The catalog could not load. Please try again later.' }))
  );
  }
  trackProduct(index: number, product: any) { return product.sem3_id || index; }
  slug(value: string) { return String(value || '').toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-{2,}/g, '-'); }
  imageError(event: Event) {
    const image = event.target as HTMLImageElement;
    if (!image.src.endsWith('/assets/svg/cart.svg')) image.src = '/assets/svg/cart.svg';
  }
}

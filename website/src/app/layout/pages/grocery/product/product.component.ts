import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { combineLatest, Subscription } from 'rxjs';
import { Product, ProductsService, LocalStorage } from '../../../../core';

@Component({ selector: 'product', templateUrl: 'product.component.html' })
export class ProductComponent implements OnInit, OnDestroy {
  @ViewChild('review') Review: ElementRef;
  product: Product;
  Cproduct: Product;
  items = [];
  comparedO = [];
  loadError = false;
  private subscriptions = new Subscription();
  constructor(private route: ActivatedRoute, public router: Router, private PS: ProductsService,
    private LS: LocalStorage, private meta: Meta, private title: Title) { }
  ngOnInit() {
    this.subscriptions.add(this.LS.get('compare', []).subscribe(value => this.comparedO = Array.isArray(value) ? value : []));
    this.subscriptions.add(combineLatest([this.route.params, this.PS.products()]).subscribe({
      next: ([params, products]) => {

        this.product = products.find(product => this.slug(product.category) === params.cat && this.slug(product.name) === params.product);
        if (!this.product) { this.router.navigate(['/404']); return; }
        this.items = products.filter(p => p.sem3_id !== this.product.sem3_id && p.category === this.product.category).slice(0, 9);
          this.Cproduct = this.product;
        this.title.setTitle(this.product.name + ' - Grceri');
        this.meta.updateTag({ name: 'description', content: this.product.description || this.product.name });
      },
      error: () => { this.loadError = true; }
    }));
  }
  private slug(value: string) { return String(value || '').toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-{2,}/g, '-'); }
  compare(item: Product) {
    const exists = this.comparedF(item.sem3_id);
    this.LS.set('compare', exists ? this.comparedO.filter(value => value.sem3_id !== item.sem3_id) : [...this.comparedO, item]);
  }
  comparedF(id: string): boolean { return this.comparedO.some(value => value.sem3_id === id); }
  scrollReview() { this.Review?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  ngOnDestroy() { this.subscriptions.unsubscribe(); }
}

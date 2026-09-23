import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({ selector: 'search', exportAs: 'search', templateUrl: 'search.html', styles: [`
  :host { display: block; width: 100%; min-width: 0; }
  .demo-search { display: flex; align-items: stretch; width: 100%; max-width: 560px; background: white; border: 1px solid #bbb; border-radius: 6px; overflow: hidden; }
  .demo-search > label { display: block; flex: 1 1 auto; width: auto; min-width: 0; margin: 0; }
  .demo-search > label > input { width: 100%; min-width: 0; height: 48px; box-sizing: border-box; padding: 12px; border: 0; color: #333; background: white; font-size: 16px; }
  .demo-search > button { flex: 0 0 48px; border: 0; background: #238345; color: white; min-width: 48px; height: 48px; }
  button:focus-visible, input:focus-visible { outline: 2px solid #175c31; outline-offset: -3px; }
`] })
export class SearchComponent {
  query = '';
  constructor(private router: Router) { }
  search() { this.router.navigate(['/groceries/search'], { queryParams: { q: this.query.trim() } }); }
}

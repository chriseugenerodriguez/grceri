import { ActivatedRoute, Router } from '@angular/router';
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Component({ selector: 'breadcrumb', templateUrl: 'breadcrumb.component.html' })
export class BreadcrumbComponent {
  bc: Array<{name: string; url: string}> = [];
  constructor(route: ActivatedRoute, router: Router, http: HttpClient) {
    http.get<any>('/assets/json/category.json').subscribe(tree => {
      const params = route.snapshot.params;
      const wanted = [params.cat, params.sub, params['sub-sub']].filter(Boolean);
      const find = (nodes: any[], path: any[] = []): any[] => {
        for (const node of nodes) {
          const current = [...path, node];
          if (router.url.startsWith('/grocery/') && this.slug(node.name) === params.cat) return current;
          if (!router.url.startsWith('/grocery/') && current.every((value, i) => this.slug(value.name) === wanted[i]) && current.length === wanted.length) return current;
          const result = find(node.category || node.sub || [], current);
          if (result.length) return result;
        }
        return [];
      };
      const nodes = find(tree.groceries.categories);
      this.bc = nodes.map((node, i) => ({ name: node.name, url: '/groceries/' + nodes.slice(0, i + 1).map(value => this.slug(value.name)).join('/') }));
    });
  }
  slug(value: string) { return value.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-{2,}/g, '-'); }
}

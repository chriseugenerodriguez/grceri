import { NgModule, Component, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent, NotFoundComponent, ProductComponent, GroceryComponent, CategoryComponent,
  SolutionsComponent, SolutionsParentsComponent, SolutionsCooksComponent, SolutionsHostsComponent,
  SolutionsStudentsComponent, ProductComparePageComponent } from './layout/pages/index';
import { DemoCatalogComponent } from './layout/pages/grocery/demo-catalog.component';

@Component({ selector: 'external-page', template: '<p class="container"><a href="https://chriseugenerodriguez.com/">Continue to Chris Rodriguez website</a></p>' })
export class ExternalPageComponent implements OnInit {
  constructor(@Inject(PLATFORM_ID) private platform: any, @Inject(DOCUMENT) private document: Document) { }
  ngOnInit() {
    if (isPlatformBrowser(this.platform)) this.document.location.replace('https://chriseugenerodriguez.com/');
  }
}

// Match descendants too, so old account and checkout deep links cannot activate legacy forms.
export const DEMO_ROUTES: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  ...['login', 'register', 'sign-up', 'forgot-password', 'reset-password', 'callback', 'user',
    'pricing', 'membership', 'checkout', 'payment', 'cart', 'lists', 'watchlists'].map(path =>
    ({ path, children: [{ path: '**', redirectTo: '/groceries/all' }] })),
  ...['blog', 'policies', 'mobile-app'].map(path =>
    ({ path, children: [{ path: '**', component: ExternalPageComponent }] })),
  { path: 'grocery/:cat/:product', children: [
    { path: '', component: ProductComponent, pathMatch: 'full' },
    { path: '**', redirectTo: '/groceries/all' }
  ] },
  { path: 'groceries', children: [
    { path: '', component: GroceryComponent, pathMatch: 'full' },
    { path: 'all', component: DemoCatalogComponent },
    { path: 'search', component: DemoCatalogComponent },
    { path: 'compare', component: ProductComparePageComponent },
    { path: ':cat', component: CategoryComponent },
    { path: ':cat/:sub', component: CategoryComponent },
    { path: ':cat/:sub/:sub-sub', component: CategoryComponent }
  ] },
  { path: 'solutions', component: SolutionsComponent, children: [
    { path: '', pathMatch: 'full', redirectTo: 'parents' },
    { path: 'parents', component: SolutionsParentsComponent },
    { path: 'cooks', component: SolutionsCooksComponent },
    { path: 'hosts', component: SolutionsHostsComponent },
    { path: 'students', component: SolutionsStudentsComponent }
  ] },
  { path: '404', component: NotFoundComponent },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  declarations: [ExternalPageComponent],
  imports: [RouterModule.forRoot(DEMO_ROUTES, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import {
	HomeComponent,
	NotFoundComponent,
	CartComponent,
	MobileAppComponent,
	ProductComponent,
	GroceryComponent,
	CategoryComponent,
	LoginComponent,
	RegisterComponent,
	SettingsComponent,
	CallbackComponent,
	FavoritesComponent,
	HistoryComponent,
	PasswordComponent,
	PricingComponent,
	ForgotPasswordComponent,
	DashboardComponent,
	UserComponent,
	PricingFreeComponent,
	PricingBasicComponent,
	PricingEliteComponent,
	PoliciesComponent,
	PoliciesPageComponent,
	ListsComponent,
	SolutionsComponent,
	SolutionsParentsComponent,
	SolutionsCooksComponent,
	SolutionsHostsComponent,
	SolutionsStudentsComponent,
	BlogHomeComponent,
	BlogComponent,
	BlogSingleComponent,
	BlogCategoryComponent,
	BlogSearchComponent,
	ProductComparePageComponent,
	ProductReviewsFormComponent,
	ProductReviewsComponent,
	ProductReviewsSingleComponent,
	ProductSellersPageComponent
} from './layout/pages/index';

import { AuthGuardService, LoggedInService } from './core/index';

@NgModule({
	imports: [
		RouterModule.forRoot([
			{ path: '', component: HomeComponent, pathMatch: 'full' },
			{ path: '404', component: NotFoundComponent },
			{ path: 'cart', component: CartComponent },
			{ path: 'callback', component: CallbackComponent },
			{ path: 'mobile-app', component: MobileAppComponent },
			{ path: 'policies', component: PoliciesComponent, children: [
					{ path: '', pathMatch: 'full', redirectTo: 'terms-of-use' },
					{ path: ':page', component: PoliciesPageComponent }
				]
			},
			{ path: 'grocery/:cat/:product', children: [
					{ path: '', component: ProductComponent },
					{ path: 'vendors', component: ProductSellersPageComponent, canActivate: [AuthGuardService] },
					{ path: 'reviews', children: [
							{ path: '', component: ProductReviewsComponent },
							{ path: ':id', component: ProductReviewsSingleComponent },
							{ path: 'create/:id', component: ProductReviewsFormComponent, canActivate: [AuthGuardService] },
						]
					},
				]
			},
			{ path: 'login', component: LoginComponent, canActivate: [LoggedInService] },
			{ path: 'forgot-password', component: ForgotPasswordComponent, canActivate: [LoggedInService] },
			{ path: 'sign-up', canActivate: [LoggedInService], children: [
					{ path: '', component: RegisterComponent },
					{ path: ':plan', component: RegisterComponent },
				]
			},
			{ path: 'blog', component: BlogComponent,
				children: [
					{ path: '', pathMatch: 'full', component: BlogHomeComponent },
					{ path: 'search/:query', component: BlogSearchComponent },
					{ path: ':cat', component: BlogCategoryComponent },
					{ path: ':cat/:name', component: BlogSingleComponent },
				]
			},
			{ path: 'groceries',
				children: [
					{ path: '', component: GroceryComponent },
					{ path: 'compare', component: ProductComparePageComponent },
					{ path: ':cat', component: CategoryComponent },
					{ path: ':cat/:sub', component: CategoryComponent },
					{ path: ':cat/:sub/:sub-sub', component: CategoryComponent },
				]
			},
			{ path: 'pricing',
				children: [
					{ path: '', component: PricingComponent },
					{ path: 'free', component: PricingFreeComponent },
					{ path: 'basic', component: PricingBasicComponent },
					{ path: 'elite', component: PricingEliteComponent }
				]
			},
			{ path: 'solutions', component: SolutionsComponent,
				children: [
					{ path: '', pathMatch: 'full', redirectTo: 'parents' },
					{ path: 'parents', component: SolutionsParentsComponent },
					{ path: 'cooks', component: SolutionsCooksComponent },
					{ path: 'hosts', component: SolutionsHostsComponent },
					{ path: 'students', component: SolutionsStudentsComponent }
				]
			},
			{ path: 'user', component: UserComponent, canActivate: [AuthGuardService],
				children: [
					{ path: '', component: DashboardComponent },
					{
						path: 'settings', component: SettingsComponent,
						children: [
							{
								path: 'account',
								children: [
									{ path: 'manage-data', component: PasswordComponent },
									{ path: 'notifications', component: PasswordComponent },
									{ path: 'password', component: PasswordComponent },
									{ path: 'pause-delete', component: PasswordComponent },
									{ path: 'profile', component: PasswordComponent },
								]
							},
							{
								path: 'billing', component: PasswordComponent,
								children: [
									{ path: 'history', component: PasswordComponent },
									{ path: 'info', component: PasswordComponent },
									{ path: 'subscription', component: PasswordComponent }
								]
							},
							// { path: 'extras', component: PasswordComponent,
							// 	children: [
							// 		{ path: 'rewards', component: PasswordComponent },
							// 	]
							// },
						]
					},
					{ path: 'history', component: HistoryComponent },
					{ path: 'favorites', component: FavoritesComponent },
					{
						path: 'lists',
						children: [
							{ path: '', component: ListsComponent },
							{ path: ':type', component: ListsComponent },
						]
					},
					{ path: 'reports', component: FavoritesComponent },
					{ path: 'support', component: PasswordComponent },
				]
			}
		])
	],
	exports: [RouterModule]
})
export class AppRoutingModule { }

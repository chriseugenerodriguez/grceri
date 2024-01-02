import { Component, OnInit, OnDestroy } from '@angular/core';

// SEO
import { Meta, Title } from '@angular/platform-browser';

// SERVICES
import { UserAPIService, HttpCancelService, LocalStorage, SortingService } from '../../../../shared/services';

// ENV
import { environment } from '../../../../../environments/environment';

// SUBSCRIPTION
import { Subscription } from 'rxjs';

// COMPONENT
@Component({
	moduleId: module.id,
	selector: 'favorites',
	templateUrl: 'favorites.component.html',
	styleUrls: ['favorites.component.scss'],
})

// CLASS
export class FavoritesComponent implements OnInit, OnDestroy {
	// NUMBER
	id: number = this.LS.get('userId');

	// ARRAY
	nitems = Array(10).fill(1);

	// OBJECT
	favorites = [];

	// BOOLEAN
	loading = false;

	// SUBSCRIPTIONS
	private _subscriptions: any = new Subscription();

	constructor(private US: UserAPIService, private LS: LocalStorage, public SS: SortingService, private meta: Meta, private title: Title, private httpCancelService: HttpCancelService) {
		this.meta.updateTag({ name: 'robots', content: 'noindex, nofollow' });
		this.title.setTitle('My Favorites - grceri');
	}

	ngOnInit() {
		this.getFavorites();
	}

	ngOnDestroy() {
		this._subscriptions.unsubscribe();
		this.httpCancelService.cancelPendingRequests();
		if (!environment.production && !this.httpCancelService) {
			console.log('canceled pending request');
		}
	}

	private getFavorites() {
		if (this.id) {
			this.loading = true;
			this._subscriptions.add(
				this.US.getSaved(this.id).subscribe(
					res => {
						if (!environment.production) {
							console.log('favorite products', res);
						}

						this.SS.results(res, 'title', 4, 10000, 4, 1);
					},
					err => {
						if (!environment.production) {
							console.log('an error has occured', err);
						}

						// LOADING
						this.loading = false;

						this.favorites = [];
					},
					() => {
						// LOADING
						this.loading = false;
					}
				));

			this._subscriptions.add(
				this.SS.next$.subscribe((res) => {
					console.log(res);
					this.favorites = res;
				}));
		}
	}
}

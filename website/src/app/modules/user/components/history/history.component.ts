import { Component, OnInit, OnDestroy } from '@angular/core';

// SEO
import { Meta, Title } from '@angular/platform-browser';

// BOOTSTRAP
import { AlertComponent } from 'ngx-bootstrap/alert';

// RXJS
import { Subscription } from 'rxjs';
import { Subject } from 'rxjs/internal/Subject';

// SERVICES
import { ModalService, LocalStorage, PlanAPIService, HttpCancelService, UserAPIService, SortingService } from '../../../../shared/services';

// ENV
import { environment } from '../../../../../environments/environment';

@Component({
	moduleId: module.id,
	selector: 'history',
	templateUrl: 'history.component.html',
	styleUrls: ['history.component.scss'],
})

// CLASS
export class HistoryComponent implements OnInit, OnDestroy {
	// NUMBER
	id: number = this.LS.get('userId');
	historyMaxLimit: number;
	historyCloseLimit: number;

	// STRING
	load = require('../../../../../assets/img/blank.jpg');

	// BOOLEAN
	loading = false;

	// OBJECT
	history = [];

	// ARRAY
	nitems = Array(10).fill(1);
	message: Array<object> = [];

	// SUBSCRIPTIONS
	private _subscriptions: any = new Subscription();

	constructor(
		public MS: ModalService,
		private US: UserAPIService,
		private LS: LocalStorage,
		private meta: Meta,
		public SS: SortingService,
		private _planAPIService: PlanAPIService,
		private title: Title,
		private httpCancelService: HttpCancelService
	) {
		this.meta.updateTag({ name: 'robots', content: 'noindex, nofollow' });
		this.title.setTitle('My History - grceri');
	}

	ngOnInit() {
		this.getLists();
		this._fetchModalMessage();
	}

	ngOnDestroy() {
		this._subscriptions.unsubscribe();
		this.httpCancelService.cancelPendingRequests();
		if (!environment.production && !this.httpCancelService) {
			console.log('canceled pending request');
		}
	}

	private _fetchPlanLimits() {
		this._subscriptions.add(this._planAPIService.getPlanLimits().subscribe((res) => {
			if (res && res.planLimits && res.planLimits['history'] && res.plan !== 'Elite') {
				this.historyMaxLimit = res.planLimits['history'];

				this.historyCloseLimit = this._planAPIService.getMaxCloseLimits(this.historyMaxLimit);
				if (!environment.production) {
					console.log('close limit', this.historyCloseLimit);
				}

				this._historyUserRestriction();
			}
		}));
	}

	private getLists() {
		if (this.id) {
			this.loading = true;

			this._subscriptions.add(this.US.getViewedProducts(this.id).subscribe(
				(res: any) => {
					if (!environment.production) {
						console.log('history products', res);
					}

					this.SS.results(res, 'title', 5, 10000, 2, 2);
				},
				err => {
					if (!environment.production) {
						console.log('an error has occured', err);
					}

					// LOADING
					this.loading = false;
				},
				() => {
					// LOADING
					this.loading = false;

					this._fetchPlanLimits();
				}
			));

			this._subscriptions.add(
				this.SS.next$.subscribe((res) => {
					this.history = res;
				}));
		}
	}

	private url(i) {
		return i.toLowerCase().replace(/(?:( and )|(&)|(,)|(\s)|[/])+/g, '-');
	}

	private _historyUserRestriction() {
		let historyLength: number = this.history.length;

		if (historyLength === this.historyMaxLimit) {
			let message: any = this.MS.processModalAlertInformation('history-close-limit-error', 'You have reached your max. ');
			this.MS.data$.next(message);
		} else if (historyLength >= this.historyCloseLimit) {
			let historyLeft: number = this.historyMaxLimit - historyLength;
			let message: any = this.MS.processModalAlertInformation('history-close-limit-error', 'You are getting close your max, you only have ' + historyLeft + ' left. ');
			this.MS.data$.next(message);
		}
	}

	private _message(a: any, b: any, c: any = '', d: any = '') {
		this.message.push({
			type: a,
			value: b,
			linkTitle: c,
			listId: d
		})
	}

	private _close(a: AlertComponent) {
		this.message = this.message.filter((i) => i !== a);
	}

	private _fetchModalMessage(): void {
		this._subscriptions.add(
			this.MS.fetchModalData().subscribe(res => {
				if (res) {
					if (res.type === 'history-close-limit-error') {
						this.message = [];
						this._message(res.type, res.value, res.linkTitle, res.listId);
					}
				}
			})
		);
	}
}

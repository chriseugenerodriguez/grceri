import { Injectable, Input, Inject, NgZone, PLATFORM_ID, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { DOCUMENT } from '@angular/common';

// SERVICES
import { ProductAPIService } from '../api/product.service';
import { AuthService } from '../auth/auth.service';
import { SearchBarService } from '../search-bar/search-bar.service';
import { HammerService } from '../hammer/hammer.service';

// ROUTER
import { Router } from '@angular/router';

// RXJS
import { Subject } from 'rxjs';
import { Subscription } from 'rxjs';

// ENVIRONMENT
import { environment } from '../../../../environments/environment';

declare const annyang: any;
declare const cordova: any;

@Injectable()
export class VoiceService implements OnDestroy {
	// ANNYANG SPEECHRECOGNITION
	voiceActiveSectionDisabled: boolean;
	voiceActiveSectionError: boolean;
	voiceActiveSectionSuccess: boolean;
	voiceActiveSectionListening: boolean;
	voiceText: any;

	// OPTIONS
	searchFilter: any;
	addedSearchedText: boolean;

	// SUBJECT
	voiceText$ = new Subject<any>();
	voiceActiveSectionStatus$ = new Subject<boolean>();
	voiceActiveSectionSound$ = new Subject<boolean>();

	// SUBSCRIPTION
	voiceTextSubscription: Subscription;
	voiceActiveSectionStatusSubscription: Subscription;
	voiceActiveSectionSoundSubscription: Subscription;

	constructor(
		@Inject(DOCUMENT) private document: Document,
		private router: Router,
		private PS: ProductAPIService,
		private AS: AuthService,
		private SBS: SearchBarService,
		private ngZone: NgZone,
		private hammerService: HammerService
	) {
		this.voiceActiveSectionDisabled = true;
		this.getNativeVoiceText();
		this.getNativeVoiceSectionsStatus();
	}

	ngOnDestroy() {
		if (this.voiceTextSubscription) {
			this.voiceTextSubscription.unsubscribe();
		}
		if (this.voiceActiveSectionStatusSubscription) {
			this.voiceActiveSectionStatusSubscription.unsubscribe();
		}
		if (this.voiceActiveSectionSoundSubscription) {
			this.voiceActiveSectionSoundSubscription.unsubscribe();
		}
	}

	processVoiceRecognitionData(filter) {
		this.searchFilter = filter;

		this.initializeVoiceRecognitionCallback();
	}

	initializeVoiceRecognitionCallback() {
		annyang.addCallback('error', () => {
			if (this.voiceText === undefined) {
				this.ngZone.run(() => this.voiceActiveSectionError = true);
				annyang.abort();
			}
		});

		annyang.addCallback('soundstart', (res) => {
			this.voiceActiveSectionSound$.next(true);

			if (!environment.production) {
				console.log('annyang started voice input');
			}
		});

		annyang.addCallback('end', () => {
			if (this.voiceText === undefined) {
				this.ngZone.run(() => this.voiceActiveSectionError = true);
				annyang.abort();
			}
		});

		annyang.addCallback('result', (userSaid) => {
			this.ngZone.run(() => this.voiceActiveSectionError = false);

			let queryText = userSaid[0];

			annyang.abort();

			if (!environment.production) {
				console.log('Search query text:', queryText);
			}

			this.voiceText$.next(queryText);

			this.searchProductFromAPI(queryText);
		});
	}

	private searchProductFromAPI(queryText) {
		this.PS.searchProducts(this.searchFilter, '', queryText).then((res: any) => {
			this.voiceActiveSectionStatus$.next(true);

			if (res.total === 1) {
				this.ngZone.run(() => this.router.navigate(['/grocery',
					this.product(res.result[0].title),
					res.result[0].productId])).then();
			} else {
				this.addRecentlySearchedText(queryText);
				this.ngZone.run(() => this.router.navigate(['/search'],
					{ queryParams: { cat_id: this.searchFilter, query: queryText } })).then();
			}

			this.voiceText = undefined;
		});
	}

	private addRecentlySearchedText(query) {
		if (this.addedSearchedText) {
			return false;
		}

		this.addedSearchedText = true;

		if (!this.AS.isAuthenticated()) {
			this.SBS.setRecentlySearchedText(query);
		} else {
			this.SBS.setRecentlySearchedTextToAPI(query);
		}
	}

	private product(i) {
		if (i) {
			return i.toString().toLowerCase().replace(/[^a-zA-Z0-9]/g, '-').replace(/-{2,}/g, '-')
		}
	}

	/// VOICE INIT
	openVoiceRecognition() {
		if (environment.mobile) {
			let permissions = cordova.plugins.permissions;
			const voicePopUp = document.getElementById('voicepopup');
			permissions.checkPermission(permissions.RECORD_AUDIO, (res) => {
				if (!res.hasPermission) {
					permissions.requestPermission(permissions.RECORD_AUDIO, (status) => {
						if (status.hasPermission) {
							this.voiceActiveSectionDisabled = false;
							this.startVoiceRecognition();
						} else {
							console.warn('Pleae enable to use feature');
						}
					});
				} else {
					this.voiceActiveSectionDisabled = false;
					this.startVoiceRecognition();
				}
			});
		} else {
			this.voiceActiveSectionDisabled = false;
			this.startVoiceRecognition();
		}
	}

	startVoiceRecognition() {
		this.voiceActiveSectionError = false;
		this.voiceActiveSectionSuccess = false;

		this.processVoiceRecognitionData('');

		if (annyang) {
			let commands = {
				'search': () => { }
			};

			annyang.addCommands(commands);

			annyang.start({ autoRestart: false });

			this.addedSearchedText = false;

			if (!environment.production) {
				console.log('annyang started');
			}
		}

		this.document.body.classList.add('is-active');
	}

	closeVoiceRecognition() {
		this.voiceActiveSectionDisabled = true;
		this.voiceActiveSectionError = false;
		this.voiceActiveSectionSuccess = false;
		this.voiceActiveSectionListening = false;
		this.voiceText = undefined;

		this.processVoiceRecognitionData('');
		annyang.abort();
		if (!environment.production) {
			console.log('Aborted voice recognition');
		}

		this.document.body.classList.remove('is-active');
	}

	getNativeVoiceText() {
		this.voiceTextSubscription = this.voiceText$.subscribe((res: any) => {
			if (res) {
				annyang.abort();

				this.ngZone.run(() => {
					this.voiceText = res;

					// TURN OFF LISTEN
					this.voiceActiveSectionListening = false;
					this.voiceActiveSectionSuccess = true;
					this.document.body.classList.remove('is-active');
				});
			}
		})
	}

	getNativeVoiceSectionsStatus() {
		this.voiceActiveSectionStatusSubscription = this.voiceActiveSectionStatus$.subscribe((res: any) => {
			if (res !== undefined) {
				this.ngZone.run(() => this.voiceActiveSectionDisabled = res);
			}
		});

		this.voiceActiveSectionSoundSubscription = this.voiceActiveSectionSound$.subscribe((res: boolean) => {
			if (res !== undefined) {
				this.ngZone.run(() => this.voiceActiveSectionListening = res);
			}
		});
	}
}

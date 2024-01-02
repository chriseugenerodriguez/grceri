import { Injectable, TemplateRef, Inject, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

// BOOTSTRAP
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

// ROUTER
import { Router } from '@angular/router';

// ENVIRONMENT
import { environment } from '../../../../environments/environment';

// SERVICE
import { ProductAPIService } from '../api/product.service';
import { HammerService } from '../hammer/hammer.service';

// BARCODE
declare const Quagga: any;

// CORDOVA
declare var cordova: any;

@Injectable()
export class BarcodeService {
	barcodePopup: TemplateRef<any>;
	barecodeScanner: any;

	barcodeValue: any;
	barecodeScannerActivated: boolean;

	modalRef: BsModalRef;

	config = {
		class: 'barcode-scanner',
		animated: true,
		backdrop: false
	};

	constructor(
		@Inject(DOCUMENT) private document: Document,
		@Inject(PLATFORM_ID) private platform: any,
		public router: Router,
		public PS: ProductAPIService,
		private modalService: BsModalService,
		private hammerService: HammerService
	) {
		this.barecodeScannerActivated = false;
	}

	private modalCallbackSubscriptions() {
		this.modalService.onHide.subscribe((result) => {
			if (result === 'backdrop-click') {
				if (this.barecodeScannerActivated) {
					Quagga.pause();
					this.barecodeScannerActivated = false;
				}
			}
		});
	}

	openScanner() {
		this.barecodeScannerActivated = true;

		if (environment.mobile) {
			let permissions = cordova.plugins.permissions;

			permissions.checkPermission(permissions.CAMERA, (res) => {
				if (!res.hasPermission) {
					permissions.requestPermission(permissions.CAMERA, (status) => {
						if (status.hasPermission) {
							this.openPopup();
						} else {
							console.warn('Pleae enable to use feature');
						}
					});
				} else {
					this.openPopup();
				}
			});
		} else {
			this.openPopup();
		}
	}

	private openPopup() {
		if (this.barcodePopup) {

			this.openModal(this.barcodePopup);
			this.document.body.classList.add('is-active');
		}
	}

	private openModal(template: TemplateRef<any>) {
		this.modalRef = this.modalService.show(template, this.config);

		this.initializeBarcodeScanner();
		this.modalCallbackSubscriptions();
	}

	closePopupAndScanner() {
		if (this.barecodeScannerActivated) {
			Quagga.stop();
			this.barecodeScannerActivated = false;
		}
		this.closePopup();
	}

	closeScanner() {
		if (this.barecodeScannerActivated) {
			this.barecodeScannerActivated = false;
		}
	}

	closePopup() {
		if (this.modalRef) {
			this.modalRef.hide();
		}

		this.document.body.classList.remove('is-active');
	}

	private initializeBarcodeScanner() {
		this.document.getElementById('barcodescanner-noresults').style.visibility = 'hidden';
		if (isPlatformBrowser(this.platform)) {
			Quagga.init({
				inputStream: {
					type: 'LiveStream',
					target: this.barecodeScanner,
					area: {
						top: '35%',
						right: '10%',
						left: '10%',
						bottom: '35%'
					}
				},
				constraints: {
					width: window.outerWidth,
					height: window.outerHeight,
					facingMode: 'environment'
				},
				halfSample: false,
				locate: true,
				patchSize: 'medium',
				numOfWorkers: (navigator.hardwareConcurrency ? navigator.hardwareConcurrency : 4),
				decoder: {
					readers: ['ean_reader', 'ean_8_reader', 'upc_reader', 'upc_e_reader']
				}
			}, (error) => {
				if (error) {
					if (!environment.production) {
						console.log('barcode error', error);
					}
					return
				}

				if (!environment.production) {
					console.log('Initialization finished. Ready to start');
				}

				Quagga.start();

				Quagga.onProcessed((result) => {
					let ctx = Quagga.canvas.ctx.overlay;
					let dom = Quagga.canvas.dom.overlay;

					if (result) {
						if (result.boxes) {
							// tslint:disable-next-line:radix
							ctx.clearRect(0, 0, parseInt(dom.getAttribute('width')), parseInt(dom.getAttribute('height')));
							result.boxes.filter(function (box) {
								return box !== result.box;
							}).forEach(function (box) {
								Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, ctx, { color: 'green', lineWidth: 2 });
							});
						}

						if (result.box) {
							Quagga.ImageDebug.drawPath(result.box, { x: 1, y: 0 }, ctx, { color: '#00F', lineWidth: 2 });
						}

						if (result.codeResult && result.codeResult.code) {
							Quagga.ImageDebug.drawPath(result.line, { x: 'x', y: 'y' }, ctx, { color: 'red', lineWidth: 3 });
						}
					}
				});

				Quagga.onDetected((data) => {
					if (data.codeResult && data.codeResult.code && this.barecodeScannerActivated) {
						Quagga.pause();

						this.barcodeValue = data.codeResult.code;

						this.barecodeScannerActivated = false;

						if (!environment.production) {
							console.log('barcode value', this.barcodeValue);
						}

						this.searchProductFromAPI();
					}
				});
			});
		}
	}

	private searchProductFromAPI() {
		let ctx = Quagga.canvas.ctx.overlay;
		let dom = Quagga.canvas.dom.overlay;

		this.PS.searchProducts('', 'UPC', this.barcodeValue).then((res: any) => {
			// tslint:disable-next-line:radix
			ctx.clearRect(0, 0, parseInt(dom.getAttribute('width')), parseInt(dom.getAttribute('height')));

			if (res.total === 1) {
				this.router.navigate(['/grocery', this.product(res.result[0].title), res.result[0].productId]);
				this.closePopupAndScanner();
			} else {
				this.document.getElementById('barcodescanner').style.visibility = 'hidden';
				this.document.getElementById('barcodescanner-noresults').style.visibility = 'visible';
				this.document.getElementsByClassName('barcode-scanner')[0].className += ' retry';
			}
		}).catch((err) => {
			this.closePopupAndScanner();
		});
	}

	private product(i) {
		if (i) {
			return i.toString().toLowerCase().replace(/[^a-zA-Z0-9]/g, '-').replace(/-{2,}/g, '-')
		}
	}

	restart() {
		this.barecodeScannerActivated = true;

		this.document.getElementsByClassName('barcode-scanner')[0].classList.remove('retry');
		this.document.getElementById('barcodescanner').style.visibility = 'visible';

		Quagga.start();
	}
}

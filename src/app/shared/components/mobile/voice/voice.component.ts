import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

// SERVICES
import { HammerService, VoiceService } from '../../../services';

@Component({
	selector: 'mobile-voice',
	templateUrl: './voice.component.html',
})
export class MobileVoiceComponent implements AfterViewInit {
	@ViewChild('voiceReq', { static: false }) voiceReq: ElementRef;

	constructor(
		private hammerService: HammerService,
		public VS: VoiceService) {
	}

	ngAfterViewInit() {
		this._hammerInteractions();
	}

	private _hammerInteractions() {
		let el = this.voiceReq.nativeElement;
		if (el) {
			this.hammerService.SwipeLeftDownClose(el).subscribe((data) => {
				if (data.swipe === 'down') {
					this.VS.closeVoiceRecognition();
				}
				if (data.swipe === 'left') {
					this.VS.closeVoiceRecognition();
					history.pushState(null, null, location.href);
				}
			});
		}
	}
}

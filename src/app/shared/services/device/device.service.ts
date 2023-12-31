import { Injectable } from '@angular/core';

import { DeviceDetectorService } from 'ngx-device-detector';

@Injectable()
export class DeviceService {
	isMobile = false;

	constructor(private deviceService: DeviceDetectorService) {
		this.isDevice();
	}

	private isDevice() {
		this.isMobile = this.deviceService.isMobile();
	}
}


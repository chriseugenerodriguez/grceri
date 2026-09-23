import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable()
export class SocialService {
  constructor(@Inject(PLATFORM_ID) private platform: any) { }

  social(a, product, type) {
    if (isPlatformBrowser(this.platform)) {
      window.open('https://chriseugenerodriguez.com/', '_blank', 'noopener,noreferrer');
    }
  }
}

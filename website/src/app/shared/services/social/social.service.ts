import { Injectable, Input, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

// INTERFACE
import { ISocial } from '../../interfaces';

@Injectable()
export class SocialService {

	constructor(@Inject(PLATFORM_ID) private platform: any) { }

	social(a, product, type, url) {
		let meta = <ISocial>{};

		if (type === 'product') {
			meta.image = product['images'][0]['original'];
			meta.title = product.title;
			meta.category = product.category;
			meta.brand = product.brand;
		} else {
			meta.image = product.data.image.mobile.url;
			meta.title = product.data.title[0].text;
			meta.category = product.type;
			meta.brand = product.tags[0];
			meta.summary = product.summary;
		}

		url = 'https://grceri.com' + url;

		let pinterest = 'http://pinterest.com/pin/create/button/?url=' + url +
			'&media=' + meta.image + '&description=' + meta.title;
		let facebook = 'https://facebook.com/dialog/share?app_id=606146619721383&href=' +
			url + '&redirect_uri=' + url;
		let twitter = 'http://twitter.com/share?text=' + meta.title + '&url=' +
			url + '&hashtags=' + meta.category + ',' + meta.brand;
		let linkedin = 'https://www.linkedin.com/shareArticle?mini=true&url=' +
			url + '&title=' + meta.title + '&summary=' +
			meta.summary + '&source=Grceri'

		let b = '';

		if (a === 'pinterest') {
			b = pinterest;
		}
		if (a === 'twitter') {
			b = twitter;
		}
		if (a === 'facebook') {
			b = facebook;
		}

		if (a === 'linkedin') {
			b = linkedin;
		}

		let params = `width=600,height=400,left=100,top=100`;

		if (isPlatformBrowser(this.platform)) {
			window.open(b, a, params)
		}
	}
}

import { Injectable, Input } from '@angular/core';

// INTERFACE
import { Social } from '../interfaces/social.interface';

@Injectable()
export class SocialService {
	url = location.href;

	constructor() { }

	social(a, product, type) {
		let meta = <Social>{};

		if (type === 'product') {
			meta.image = product['images'][0];
			meta.title = product.name;
			meta.category = product.category;
			meta.brand = product.brand;
		} else {
			meta.image = product.data.image.mobile.url;
			meta.title = product.data.title[0].text;
			meta.category = product.type;
			meta.brand = product.tags[0];
			meta.summary = product.summary;
		}

		let pinterest = 'http://pinterest.com/pin/create/button/?url=' + this.url + '&media=' + meta.image + '&description=' + meta.title;
		let facebook = 'https://facebook.com/dialog/share?app_id=606146619721383&href=' + this.url + '&redirect_uri=' + this.url;
		let twitter = 'http://twitter.com/share?text=' + meta.title + '&url=' + this.url + '&hashtags=' + meta.category + ',' + meta.brand;
		let linkedin = 'https://www.linkedin.com/shareArticle?mini=true&url=' + this.url + '&title=' + meta.title + '&summary=' + meta.summary + '&source=Grceri'

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

		window.open(b, a, params)

	}
}
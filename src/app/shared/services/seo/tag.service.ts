import { Injectable, RendererFactory2, ViewEncapsulation, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

// ENV
import { environment } from '../../../../environments/environment';

@Injectable()
export class LinkTagService {
	renderer: any;

	constructor(
		private rendererFactory: RendererFactory2,
		@Inject(DOCUMENT) private document
	) {

		this.renderer = this.rendererFactory.createRenderer(this.document, {
			id: '-1',
			encapsulation: ViewEncapsulation.None,
			styles: [],
			data: {}
		});
	}

	updateTag(tag: LinkDefinition) {
		this.removeTag(tag);
		this.addTag(tag);
	}

  /**
  * Rimuove il link esistente con lo stesso atrtributo rel
  */
	removeTag(tag: LinkDefinition) {
		try {

			const selector = this._parseSelector(tag);

			const canonical = this.document.querySelector(selector)
			const head = this.document.head;

			if (head === null) {
				throw new Error('<head> not found within DOCUMENT.');
			}
			if (!!canonical) {
				this.renderer.removeChild(head, canonical);
			}
		} catch (e) {
			if (!environment.production) {
				console.error('Error within linkService : ', e);
			}
		}
	}

  /**
   * Inietta il link ocme ultimo child del tag <head>
   */
	addTag(tag: LinkDefinition) {

		try {

			const link = this.renderer.createElement('link');
			const head = this.document.head;


			if (head === null) {
				throw new Error('<head> not found within DOCUMENT.');
			}


			Object.keys(tag).forEach((prop: string) => {
				return this.renderer.setAttribute(link, prop, tag[prop]);
			});

			// [TODO]: get them to update the existing one (if it exists) ?
			this.renderer.appendChild(head, link);

		} catch (e) {
			if (!environment.production) {
				console.error('Error within linkService : ', e);
			}
		}
	}

	private _parseSelector(tag: LinkDefinition): string {
		const attr: string = tag.rel ? 'rel' : 'hreflang';
		return `link[${attr}="${tag[attr]}"]`;
	}
}

export declare type LinkDefinition = {
	charset?: string;
	crossorigin?: string;
	href?: string;
	hreflang?: string;
	media?: string;
	rel?: string;
	rev?: string;
	sizes?: string;
	target?: string;
	type?: string;
} & {
	[prop: string]: string;
}

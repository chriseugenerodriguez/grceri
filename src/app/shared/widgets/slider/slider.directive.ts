import { Directive, TemplateRef } from '@angular/core';

@Directive({
	selector: '[sliderItem]'
})
export class sliderItemDirective {

	constructor(public tpl: TemplateRef<any>) {
	}

}

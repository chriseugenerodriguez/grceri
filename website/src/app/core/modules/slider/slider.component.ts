import { Component, ContentChildren, Directive, ElementRef, Input, QueryList, ViewChild } from '@angular/core';
import { sliderItemDirective } from './slider.directive';
@Directive({ selector: '.slider-wrapper__inner__item' })
export class sliderItemElement {}
@Component({ selector: 'slider', exportAs: 'slider', templateUrl: 'slider.html', styles: [`
:host { display:block; min-width:0; width:100%; }
.demo-slider-controls { display:flex; justify-content:flex-end; gap:8px; margin-bottom:12px; }
.demo-slider-controls button { width:44px; height:44px; border:1px solid #ccc; border-radius:6px; background:white; color:#238345; }
.demo-slider-track { display:flex; gap:16px; overflow-x:auto; scroll-snap-type:x mandatory; padding:0 0 12px; margin:0; list-style:none; }
.demo-slider-track > li { flex:0 0 calc((100% - 32px)/3); min-width:0; scroll-snap-align:start; }
@media(max-width:900px) { .demo-slider-track > li { flex-basis:calc((100% - 16px)/2); } }
@media(max-width:540px) { .demo-slider-track > li { flex-basis:100%; } }
`] })
export class sliderComponent {
 @ContentChildren(sliderItemDirective) items: QueryList<sliderItemDirective>;
 @ViewChild('track') track: ElementRef<HTMLElement>;
 @Input() showControls = true;
 @Input() showPagination = true;
 @Input() timing = '250ms ease-in';
 @Input() innerItemWidth: number;
 next() { this.move(1); }
 prev() { this.move(-1); }
 move(direction: number) { const el = this.track.nativeElement; el.scrollBy({ left: direction * (el.clientWidth + 16), behavior: 'smooth' }); }
}

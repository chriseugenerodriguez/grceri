import { Input, Component, ChangeDetectionStrategy } from "@angular/core";

@Component({
  selector: 'item',
  templateUrl: './item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ItemComponent {

  @Input() public cat: string;
  @Input() public id: number;
  @Input() public name: string;
  @Input() public price: number;
  @Input() public currency: string;
  @Input() public images: object;
  @Input() public brands: string;
  @Input() public rating: string;
  @Input() public desc: string;

  constructor() {
  }

  product(i) {
    return i.toString().toLowerCase().replace(/[^a-zA-Z0-9]/g, '-').replace(/-{2,}/g, '-')
  }
}
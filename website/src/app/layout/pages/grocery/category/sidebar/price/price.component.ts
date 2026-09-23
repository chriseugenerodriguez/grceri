import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PriceFilter } from '../../../../../../core/interfaces/filter.interface';
import { Input, Component, OnInit, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

@Component({ selector: 'price', templateUrl: './price.component.html' })
export class PriceComponent implements OnInit, OnChanges {
  @Input() availableFilters: PriceFilter[] = [];
  @Input() activatedFilters: PriceFilter[] = [];
  @Output() activeFilters = new EventEmitter<PriceFilter[]>();
  dispFilters: PriceFilter[] = [];
  priceForm: FormGroup;
  constructor(private fb: FormBuilder) {}
  ngOnInit() {
    this.priceForm = this.fb.group({ from: [null, Validators.min(0)], to: [null, Validators.min(0)] });
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.availableFilters) this.dispFilters = this.availableFilters;
  }
  get submit(): boolean {
    if (!this.priceForm || !this.priceForm.valid) return false;
    const { from, to } = this.priceForm.value;
    return (from !== null || to !== null) && (from === null || to === null || from <= to);
  }
  get invalidRange(): boolean {
    if (!this.priceForm) return false;
    const { from, to } = this.priceForm.value;
    return !this.priceForm.valid || (from !== null && to !== null && from > to);
  }
  filterActive(price): boolean { return this.activatedFilters.some(p => p.from === price.from && p.to === price.to); }
  changeFilterStatus(event, price) {
    this.priceForm.reset();
    this.activatedFilters = this.activatedFilters.filter(p => this.availableFilters.some(option => option.from === p.from && option.to === p.to));
    this.activatedFilters = event.target.checked ? [...this.activatedFilters.filter(p => p !== price), price] :
      this.activatedFilters.filter(p => p.from !== price.from || p.to !== price.to);
    this.activeFilters.emit(this.activatedFilters);
  }
  onSubmit() {
    if (!this.submit) return;
    const { from, to } = this.priceForm.value;
    this.activatedFilters = [{ from: from === null ? 0 : from, to, num: 0 }];
    this.activeFilters.emit(this.activatedFilters);
  }
  clear() {
    this.priceForm.reset();
    this.activatedFilters = [];
    this.activeFilters.emit([]);
  }
}

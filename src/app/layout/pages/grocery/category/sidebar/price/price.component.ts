import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { PriceFilter } from '../../../../../../core/interfaces/filter.interface';
import { Input, Component, OnInit, Output, EventEmitter, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';


@Component({
	selector: 'price',
	templateUrl: './price.component.html',
})
export class PriceComponent implements OnInit, OnChanges, OnDestroy {

	@Input() availableFilters: PriceFilter[] = [];
	@Input() activatedFilters: PriceFilter[] = [];
	@Output() activeFilters: EventEmitter<PriceFilter[]> = new EventEmitter<PriceFilter[]>();

	public dispFilters: PriceFilter[] = [];
	public priceForm: FormGroup;
	public submit: boolean = false;

	private subs: Subscription[] = [];

	constructor(private fb: FormBuilder) {
	}

	ngOnInit() {
		this.form();
		this.subs = [
			this.priceForm.valueChanges.subscribe(res => {
				this.dispFilters = this.availableFilters.filter(i => (!res.from || i.from >= res.from) && (!res.to || i.to <= res.to));
				this.activatedFilters = this.activatedFilters.filter(i => (res.from !== '' && i.from >= res.from) && (res.to !== '' && i.to <= res.to));
				this.submit = (res.from >= 0 || res.to > 0);
			})
		]
	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes['availableFilters']) {
			this.dispFilters = this.availableFilters;
		}
	}

	private form() {
		let info = this.activatedFilters ? this.activatedFilters : { from: 0, to: 0 };
		return this.priceForm = this.fb.group({
			from: [''],
			to: ['']
		});
	}

	public filterActive(brand): boolean {
		return this.activatedFilters.findIndex(x => x === brand) >= 0;
	}

	public changeFilterStatus(event, brand) {
		if (event.target.checked) {
			this.activatedFilters.push(brand);
		} else {
			this.activatedFilters = this.activatedFilters.filter(i => i != brand);
		}

		this.activeFilters.emit(this.activatedFilters);
	}

	onSubmit() {
		this.activatedFilters = [].concat(this.dispFilters);
		this.activeFilters.emit(this.activatedFilters);
	}

	ngOnDestroy() {
		this.subs.forEach(sub => sub.unsubscribe());
	}
}

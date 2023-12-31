import { Component, EventEmitter, Input, OnInit, Output, OnChanges } from '@angular/core';

// FORM
import { FormGroup, FormBuilder, FormArray, FormControl, Validators } from '@angular/forms';

@Component({
	selector: 'app-lists-filter',
	templateUrl: 'filter.component.html',
	styleUrls: ['filter.component.scss']
})

export class FilterComponent implements OnChanges, OnInit {
	// INPUT
	@Input() userLabels: string[];
	@Input() checkedLabels: string[];

	// OUTPUT
	@Output() filterLabels: EventEmitter<any> = new EventEmitter<any>();

	// FORM
	form: FormGroup;

	constructor(
		private _formBuilder: FormBuilder
	) { }

	ngOnChanges() {
		if (this.form) {
			this._fillLabels(this.userLabels);
		}
	}

	ngOnInit() {
		this._init();
	}

	private _init() {
		this.form = this._formBuilder.group({
			label: new FormArray([])
		});

		this._fillLabels(this.userLabels, false);
	}

	private _fillLabels(labels: any[], reset: boolean = true) {
		let labelArray: FormArray = this.form.get('label') as FormArray;

		if (reset) {
			while (labelArray.length !== 0) {
				labelArray.removeAt(0)
			}
		}

		labels.forEach(element => {
			labelArray.push(this._addLabel(element));
		});
	}

	private _addLabel(label: any): FormGroup {
		return this._formBuilder.group({
			name: new FormControl(label, Validators.required),
			selected: new FormControl(false),
		});
	}

	onChangeListLabel(control: FormControl) {
		let checked: boolean = !control.get('selected').value;
		let label: string = control.get('name').value;

		if (checked) {
			this.checkedLabels.push(label);
		} else {
			this.checkedLabels = this.checkedLabels.filter(e => e !== label);
		}

		this.filterLabels.emit({ type: 'filter-labels', labels: this.checkedLabels });

		control.get('selected').setValue(checked);
	}
}
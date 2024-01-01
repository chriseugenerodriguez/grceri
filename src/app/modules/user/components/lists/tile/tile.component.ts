import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { Component, Input, Output, OnInit, OnDestroy, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

// ROUTER
import { Router } from '@angular/router';

// RXJS
import { Subscription } from 'rxjs';

// SERVICES
import { LocalStorage, ListLabelAPIService, ModalService, CommonService } from '../../../../../shared/services';

@Component({
	moduleId: module.id,
	selector: 'lists-tile',
	templateUrl: 'tile.component.html',
	styleUrls: ['tile.component.scss']
})

// CLASS
export class ListsTileComponent implements OnChanges, OnInit, OnDestroy {
	// INPUT
	@Input() data: any;
	@Input() discover: any;
	@Input() userLabels: string[];
	@Input() listLabels: string[] = [];

	// OUTPUT
	@Output('action') listAction: EventEmitter<any> = new EventEmitter<any>();

	// SUBSCRIPTIONS
	private _subscriptions: any = new Subscription();

	// NUMBER
	id: number = this._localStorage.get('userId');

	// STRING
	// load = require('../../../../../../assets/img/blank.jpg');
	load = './assets/img/blank.jpg';

	// DATE
	date: Date = new Date();

	// BOOLEAN
	noLabel = false;
	loading = false;

	form: FormGroup;

	config = {
		animated: false,
		backdrop: true,
	};

	constructor(
		private _router: Router,
		private _formBuilder: FormBuilder,
		private _localStorage: LocalStorage,
		private _listLabelService: ListLabelAPIService,
		private _modalService: ModalService,
		public commonService: CommonService
	) {
		this._initForm();
	}

	ngOnChanges(changes: SimpleChanges) {
		if (this.userLabels && this.listLabels) {
			this._fillLabels(this.userLabels);
		}
	}

	ngOnInit() {
		this.date = this.data.createdAt;

		this._labelNameChanges();
		this._fetchModalMessage();
		this._getUserLabels();
	}

	ngOnDestroy() {
		this._subscriptions.unsubscribe();
	}

	private _getUserLabels() {
		this._subscriptions.add(this._listLabelService.getUserLabels().subscribe((res) => {
			if (res) {
				this.userLabels = res;
			}
		}))
	}

	private _labelNameChanges() {
		this._subscriptions.add(this.form.get('name').valueChanges.subscribe(res => {
			this._filterLabels(res);
		}));
	}

	private _filterLabels(text: string) {
		let labelArray: FormArray = this.form.get('label') as FormArray;
		let labelLength: number = labelArray.length;
		let flag = true;

		while (labelLength > 0) {
			labelLength = labelLength - 1;

			if (text) {
				let label: string = labelArray.controls[labelLength].get('name').value;

				if (label.startsWith(text) || label === text) {
					flag = false;
					labelArray.controls[labelLength].get('disabled').setValue(false);
				} else {
					labelArray.controls[labelLength].get('disabled').setValue(true);
				}
			} else {
				flag = false;
				labelArray.controls[labelLength].get('disabled').setValue(false);
			}
		}

		this.noLabel = flag;
	}

	private _initForm() {
		this.form = this._formBuilder.group({
			name: new FormControl(''),
			label: new FormArray([])
		});
	}

	getUserListLabels() {
		if (this.discover !== true) {
			this._subscriptions.add(this._listLabelService.getUserListLabels(this.id, this.data.id).subscribe((res: any) => {
				if (res) {
					this.listLabels = res;

					this._fillLabels(this.userLabels);
				}
			}));
		}
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
		let selected: boolean = (this.listLabels && this.listLabels.length > 0) ? this.listLabels.includes(label) : false;

		return this._formBuilder.group({
			name: new FormControl(label, Validators.required),
			selected: new FormControl(selected),
			disabled: new FormControl(false)
		});
	}

	counter(i: number) {
		if (i === 0) {
			i = 4 - i;
		} else {
			i = 5 - i;
		}

		if (i > 0) {
			return new Array(i);
		}
	}

	listDetails($event: any, id: string) {
		$event.preventDefault();

		this._router.navigateByUrl('/', { skipLocationChange: true })
			.then(() => this._router.navigate(['/lists', id]));
	}

	openMoreOptions() {
		this.listAction.emit({ type: 'open-options', listId: this.data['id'] });
	}

	createListLabel() {
		let userId: number = this._localStorage.get('userId');
		let label: string = this.form.get('name').value;
		let listId: string = this.data['id'];
		if (listId) {
			this.loading = true;
			this._createLabel(userId, listId, label);
		}
	}

	private _createLabel(userId: number, listId: string, label: string) {
		this._subscriptions.add(this._listLabelService.postUserLabel(userId, label).subscribe((res: any) => {
			if (res) {
				this.userLabels = res;

				this._createListLabel(userId, listId, label);
			}
		}))
	}

	private _createListLabel(userId: number, listId: string, label: string) {
		this._subscriptions.add(this._listLabelService.createUserListLabel(userId, listId, label).subscribe((res: any) => {
			this.loading = false;
			if (res) {
				this.listLabels = res;
				this.form.get('name').setValue('');

				this.listAction.emit({ type: 'refresh-labels', labels: this.userLabels });

				this._refreshListsLabels(this.data.id, this.userLabels, this.listLabels);

				let message: any = this._modalService.processModalAlertInformation('success', `User label "${label}" has been created and added to list.`);
				this._modalService.data$.next(message);
			}
		}));
	}

	private _fetchModalMessage(): void {
		this._subscriptions.add(
			this._modalService.fetchModalData().subscribe(res => {
				if (res) {
					switch (res.type) {
						case `success-change-list-label-${this.data.id}`:
							let message: any = this._modalService.processModalAlertInformation('empty-message', 'confirmed');
							this._modalService.data$.next(message);
							this._updateListLabels(res);
							break;

						default:
							break;
					}
				}
			}
			))
	}

	private _updateListLabels(data: any) {
		this.loading = true;

		let params: any = data.listId;

		if (params.checked) {
			this._selectListLabel(params.label);
		} else {
			this._deselectListLabel(params.label);
		}
	}

	private _selectListLabel(label: any) {
		this._subscriptions.add(this._listLabelService.createUserListLabel(this.id, this.data.id, label).subscribe((res: any) => {
			this.loading = false;
			if (res) {
				this.listLabels = res;

				this._refreshListsLabels(this.data.id, this.userLabels, this.listLabels);

				let message: any = this._modalService.processModalAlertInformation('success', 'List has been successfully updated');
				this._modalService.data$.next(message);
			}
		}, (error) => this.loading = false));
	}

	private _deselectListLabel(label: string) {
		this._subscriptions.add(this._listLabelService.removeUserListLabel(this.id, this.data.id, label).subscribe((res: any) => {
			this.loading = false;
			if (res) {
				this.listLabels = res;

				this._refreshListsLabels(this.data.id, this.userLabels, this.listLabels);

				let message: any = this._modalService.processModalAlertInformation('success', 'List has been successfully updated');
				this._modalService.data$.next(message);
			}
		}, (error) => this.loading = false));
	}

	private _refreshListsLabels(listId: string, userLabels: string[], listLabels: string[]) {
		this._fillLabels(userLabels);

		let message: any = this._modalService.processModalAlertInformation('update-list-labels', listId, '', listLabels);
		this._modalService.data$.next(message);
	}

	onChangeListLabel(control: FormControl) {
		let checked: boolean = !control.get('selected').value;
		let type: string = checked ? 'add' : 'remove';
		let label: string = control.get('name').value;
		let params: any = { id: this.data.id, checked, label };
		let message: any = this._modalService.processModalAlertInformation(`change-list-label-${this.data.id}`, `Confirm ${type} this label? `, '', params);

		this._modalService.data$.next(message);
		this._modalService.openConfirmationModal(this.config);

		control.get('selected').setValue(!checked);
	}
}

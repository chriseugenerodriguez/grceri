import { Component, EventEmitter, Output, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// FORM
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

// INTERFACE
import { IProduct, IKeyValue } from '../../../../../../shared/interfaces';

@Component({
	selector: 'product-feedback',
	templateUrl: 'feedback.component.html',
	styleUrls: ['feedback.component.scss']
})
export class ProductFeedbackComponent {

	@Input() id: IProduct;

	// TOGGLE
	@Output() open = new EventEmitter<boolean>(true);
	@Output() success = new EventEmitter<string>();

	// FORM
	Feedback: FormGroup;

	// DATA
	whereData: Array<IKeyValue>;
	whatData: Array<IKeyValue>;
	dataList: Array<IKeyValue>;

	constructor(
		private fb: FormBuilder,
		private http: HttpClient
	) {

		this.whereData = [
			{ value: 'Product Name', id: 1 },
			{ value: 'Price', id: 2 },
			{ value: 'Images', id: 3 },
			{ value: 'Product Description', id: 4 },
			{ value: 'Prohibited/Offensive Product', id: 5 },
			{ value: 'Other product details', id: 6 }
		];

		this.dataList = [
			{ value: 'Doesn\'t match with product description', id: 1, catId: 1 },
			{ value: 'Doesn\'t match with product image', id: 2, catId: 1 },
			{ value: 'Incorrect/Misleading information', id: 3, catId: 1 },
			{ value: 'Is too high', id: 1, catId: 2 },
			{ value: 'Is not correct', id: 2, catId: 2 },
			{ value: 'Other', id: 3, catId: 2 },
			{ value: 'Different from product', id: 1, catId: 3 },
			{ value: 'Too few', id: 2, catId: 3 },
			{ value: 'Are not clear', id: 3, catId: 3 },
			{ value: 'Misleading image(s)', id: 4, catId: 3 },
			{ value: 'Other', id: 5, catId: 3 },
			{ value: 'Wrong product description', id: 1, catId: 4 },
			{ value: 'Missing Size or Dimensions', id: 2, catId: 4 },
			{ value: 'Size chart is missing/incorrect', id: 3, catId: 4 },
			{ value: 'Color/Size variation is not available', id: 4, catId: 4 },
			{ value: 'Other', id: 5, catId: 4 },
			{ value: 'Prohibited/illegal product', id: 1, catId: 5 },
			{ value: 'Offensive/Adult content', id: 2, catId: 5 },
			{ value: 'Other', id: 3, catId: 5 },
			{ value: 'Product recommendations not relevant', id: 1, catId: 6 },
			{ value: 'Misleading image(s) in recommendation module', id: 2, catId: 6 },
			{ value: 'Reviews are not helpful', id: 3, catId: 6 },
			{ value: 'FAQ are not helpful', id: 4, catId: 6 },
			{ value: 'Other', id: 5, catId: 6 }
		]

		this.form();
	}

	form() {
		// SINGLE
		this.Feedback = this.fb.group({
			Where: ['', Validators.required],
			What: [{ value: '', disabled: true }, Validators.required],
			Info: ['', Validators.required]
		})
	}

	feedback(i) {
		if (i === 'cancel') {
			this.open.emit(false);
		} else {
			this.http.post('', {'ID': this.id.sem3_id, 'Form': this.Feedback.value}).subscribe((r) => {
			})
			this.open.emit(false);
			this.success.emit(this.id.sem3_id);
		}
	}

	change(id) {
		this.Feedback.get('What').reset();
		this.Feedback.get('What').enable();
		this.whatData = this.dataList.filter((r) => r.catId === id);
	}
}

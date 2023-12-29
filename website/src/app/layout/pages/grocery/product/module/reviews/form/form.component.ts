import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {Location} from '@angular/common';

// SERVICES
import { ProductsService, Product } from '../../../../../../../core';

// SEO
import { Meta, Title } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';

@Component({
	selector: 'reviews-form',
	templateUrl: 'form.component.html',
})
export class ProductReviewsFormComponent {

	// PARAMS
	id: any;

	// IMAGE
	@ViewChild('file') file: ElementRef;
	url: any;
	images: FormArray;
	index = 0;

	// FORMGROUP
	Review: FormGroup;

	// PRODUCT
	product: Product;

	// SUBMIT
	message: string;
	alert: string;

	constructor(private location: Location, private http: HttpClient, private fb: FormBuilder, private PS: ProductsService, private route: ActivatedRoute, private meta: Meta, private title: Title) {
		meta.addTag({ name: 'description', content: 'Create a review and add your voice to help others make better choices when adding this' })

		this.form().statusChanges.subscribe(() => {
			console.log(this.Review.value);
		});
		this.images = <FormArray>this.Review.controls['images'];

		this.route.params.subscribe(params => {
			this.id = params['id'];

			this.getProduct(this.id);
		});
	}

	getProduct(i) {
		this.PS.getProduct(i).subscribe((r) => {
			this.product = r;

			this.title.setTitle('Create a Review for ' + this.product.name + ' - Grceri');
		});
	}

	ngOninit() {
	}

	form() {
		return this.Review = this.fb.group({
			rating: ['', [Validators.required]],
			images: this.fb.array([]),
			title: ['', [Validators.required]],
			description: ['', [Validators.required]]
		});
	}

	createImage(name: string, type: string, value: any, id?: number): FormGroup {
		if (id !== null) {
			this.index = id;
		} else {
			this.index = this.index + 1;
		}

		return this.fb.group({
			id: id,
			name: name,
			type: type,
			value: value
		});
	}

	addFile(event) {
		let reader = new FileReader();
		if (event.target.files && event.target.files.length > 0) {
			let file = event.target.files[0];
			reader.readAsDataURL(file);
			reader.onload = () => {
				this.images.push(this.createImage(file.name, file.type, reader.result.toString()));
			};
		}
	}

	removeFile(idx: number) {
		this.images.removeAt(idx);
		this.clearInputFile(this.file.nativeElement);
	}

	clearInputFile(f) {
		if (f.value) {
			try {
				f.value = ''; //for IE11, latest Chrome/Firefox/Opera...
			} catch (err) { }
			if (f.value) { //for IE5 ~ IE10
				var form = document.createElement('form'),
					parentNode = f.parentNode, ref = f.nextSibling;
				form.appendChild(f);
				form.reset();
				parentNode.insertBefore(f, ref);
			}
		}
	}

	submit(i) {
		this.http.post('', i).subscribe(
			(r) => {
				this.alert = 'success';
				this.message = 'Thank you for your review!';
			},
			(err) => {
				this.alert = 'error';
				this.message = 'Something went wrong, try again later.'
			});

		setTimeout(() => {
			this.location.back();
		}, 1000)
	}
}

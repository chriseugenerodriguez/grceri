import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, ViewChild, TemplateRef } from '@angular/core';

// SERVICES
import { CategoryAPIService, SearchBarService } from '../../../shared/services';

// RXJS
import { Subscription } from 'rxjs';

// BOOTSTRAP
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

// LOCATION
import { Location } from '@angular/common';

@Component({
	selector: 'mobile-breadcrumb',
	templateUrl: 'mobile-breadcrumb.component.html',
	styleUrls: ['mobile-breadcrumb.component.scss']
})
export class MobileBreadcrumbComponent implements OnInit, OnDestroy {
	@ViewChild('sort', { static: false }) sort: TemplateRef<any>;
	@Output() triggerSortValue = new EventEmitter<boolean>();
	@Input() breadcrumbHeader: any;

	categories: any[];
	cat: any;
	subCat: any;
	subSubCat: any;
	categoryName: any;

	// SUBSCRIPTION
	routerParamSubscription: Subscription;

	// SORT BY
	sortList = [
		{ text: 'Relevance', value: 'productId' },
		{ text: 'Rating', value: 'rating desc' },
		{ text: 'Price: High to Low', value: 'highestVendorPrice desc' },
		{ text: 'Price: Low to High', value: 'lowestVendorPrice asc' }
	];

	// BOOTSTRAP
	modalRef: BsModalRef;

	// OPTIONS
	config = {
		class: 'sort-popup',
		animated: false,
		backdrop: true,
		ignoreBackdropClick: false
	};

	constructor(
		public location: Location,
		private router: Router,
		public SBS: SearchBarService,
		private route: ActivatedRoute,
		private modalService: BsModalService,
		private CS: CategoryAPIService) {
	}

	ngOnInit() {
		this.routerParamSubscription = this.route.params.subscribe(params => {
			this.cat = params['cat'];
			this.subCat = params['sub'];
			this.subSubCat = params['subSub'];
		});

		this.getCurrentCategoryName();
	}

	ngOnDestroy() {
		if (this.routerParamSubscription) {
			this.routerParamSubscription.unsubscribe();
		}
	}

	getCurrentCategoryName() {
		this.CS.getCat().subscribe((res) => {
			if (res) {
				this.categories = res[0]['categories'];

				this.categories.forEach((b: any) => {
					// CATEGORY
					if (this.CS.formatted(b['name']) === this.cat) {
						this.categoryName = b['name'];

						if (b['categories']) {
							b['categories'].forEach((c) => {
								if (this.CS.formatted(c['name']) === this.subCat) {
									this.categoryName = c['name'];

									if (c['categories'] && c['categories'].length > 0) {
										c['categories'].forEach((d) => {
											if (this.CS.formatted(d['name']) === this.subSubCat) {
												this.categoryName = d['name'];
											}
										});
									}
								}
							})
						}
					}
				});
			}
		});
	}

	triggerMobileCategorySort() {
		this.modalRef = this.modalService.show(this.sort, this.config);
	}

	sortChanges(eventData) {
		this.SBS.selectedSortOption = eventData;
		this.triggerSortValue.emit(eventData);
		this.modalRef.hide();
	}
}

import {
	Input, Component, OnInit, AfterViewInit, OnChanges, ChangeDetectionStrategy,
	ChangeDetectorRef, SimpleChanges
} from '@angular/core';

// SERVICES
import { CategoryAPIService } from '../../../services';

// ROUTER
import { ActivatedRoute } from '@angular/router';

// INTERFACES
import { ICategoryFilter } from '../../../interfaces/filter/sections/category.filter.interface';

@Component({
	selector: 'department',
	templateUrl: './department.component.html',
	styleUrls: ['department.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class DepartmentComponent implements OnInit, AfterViewInit, OnChanges {
	// FILTERS
	@Input() aDepartments: ICategoryFilter[] = [];

	// CATEGORIES
	sDepartments: ICategoryFilter[] = [];

	// PLACEHOLDER
	nCategories = Array(10).fill(1);

	// ROUTER
	cat: string;

	constructor(private changeDetector: ChangeDetectorRef, private route: ActivatedRoute, private CS: CategoryAPIService) {
		this.route.params.subscribe(params => {
			this.cat = params['cat'];
		});
	}

	ngOnInit() {
	}

	ngAfterViewInit() {
		this.changeDetector.detach();
	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes['aDepartments']) {
			this.sDepartments = this.aDepartments;
		}

		this.changeDetector.detectChanges();
	}
}

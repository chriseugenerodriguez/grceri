import { Injectable } from '@angular/core';

// LODASH
import * as _ from 'lodash';

// SUBJECT
import { Subject } from 'rxjs';

@Injectable()
export class SortingService {
	// OBJECT
	sort: any = [{}];

	// ARRAY
	data: any = [];
	currentData: any = [];
	activeData: any = [];

	// NUMBER
	dataCount: any = [];
	dataTotal: any = [];
	dataIndex: any = [];
	dataChunk: any = [];

	// STRING
	activeSort: string;

	// SUBJECT
	next$: Subject<[]> = new Subject();

	results(res: any, sort: string, column: number, chunk: number, reset: number, depth?: number) {
		// SET DEFAULT VALUE FOR DEPTH
		if (!depth) {
			depth = 0;
		}

		// DATA
		this.data[depth] = res;

		// CHUNK
		this.dataChunk[depth] = chunk;

		// DEFAULT SORT
		let a = _.sortBy(res, sort);

		// SORT NAME
		this.activeSort = sort;

		// RESET SORT
		this._resetSort(column, reset);

		// SET SORT
		this.sort[column] = 'asc';

		// PARSE OBJECT
		this._setPaginationResults(a, depth);
	}

	sortIt(is: string, order: number, max: number, depth: number) {
		// SET DEFAULT VALUE FOR DEPTH
		if (!depth) {
			depth = 0;
		}

		// RESET SORT
		this._resetSort(order, max);

		// SORT OBJECT ARRAY
		this.sort[order] = this.sort[order] === 'asc' ? 'desc' : 'asc';

		// SORT FN
		let a = _.orderBy(this.data[depth], is, this.sort[order]);

		// ACTIVE SORT
		this.activeSort = is;

		// PARSE OBJECT
		this._setPaginationResults(a, depth);
	}

	pagChangeResults(index: any, depth?: number) {
		// SET DEFAULT VALUE FOR DEPTH
		if (!depth) {
			depth = 0;
		}
		// CHANGE FRAME BASED ON SELECTED INDEX
		this.activeData[depth] = this.currentData[depth][index - 1];

		// PASS TO SUBJECT
		this.next$.next(this.activeData[depth]);

		// SET CURRENT INDEX
		this.dataIndex[depth] = index;
	}

	_resetSort(index: number, max: number) {
		// RESET SORT
		for (let i = 0; i < max; i++) {
			if (index !== i) {
				this.sort[i] = 'desc';
			}
		}
	}

	_setPaginationResults(value: any, depth?: number) {
		// SET DEFAULT VALUE FOR DEPTH
		if (!depth) {
			depth = 0;
		}

		// CREATE CHUNKS
		this.currentData[depth] = this._pagMapResultsArray(value, this.dataChunk[depth]);

		// GET LENGTH OF CHUNKS
		this.dataTotal[depth] = this.currentData[depth].length;

		// DEFINE INDEX
		this.dataIndex[depth] = this.dataIndex[depth] === undefined || this.dataTotal[depth] === 1 ? 1 : this.dataIndex[depth];

		if (Array.isArray(value) && value.length === 0) {
			this.activeData[depth] = [];
		} else {
			// DYNAMIC PAGE CHANGE
			this.activeData[depth] = this.dataTotal[depth] > 1 ? this.currentData[depth][this.dataIndex[depth] - 1] : this.currentData[depth][0];
		}

		// PASS TO SUBJECT
		this.next$.next(this.activeData[depth]);
	}

	_pagMapResultsArray(value, length) {
		// SEPARATE INTO LENGTHS
		return _.chunk(value, length);
	}
}

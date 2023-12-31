import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable()
export class ExcelService {

	constructor() { }

	exportAsExcelFile(json: any[], excelFileName: string): void {

		const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
		const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
		const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
		this.saveAsExcelFile(excelBuffer, excelFileName);
	}

	private saveAsExcelFile(buffer: any, fileName: string): void {
		const data: Blob = new Blob([buffer], {
			type: EXCEL_TYPE
		});
		let url: string = window.URL.createObjectURL(data);
		let link: any = document.createElement("a");
		link.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(url);
		link.download = fileName + EXCEL_EXTENSION;
		link.click();
	}

}

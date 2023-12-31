import { String, Number } from './filter.interface';

export interface Category {
	id: string;
	name: string;
	sub?: Category[];
	category?: Category[];
}

export interface Product {
	id?: number;
	created_at?: number,
	description?: string,
	ean?: string,
	features?: Object,
	geo?: string[],
	gtins?: string[],
	height?: number,
	images_total?: number,
	length?: number,
	manufacturer?: string,
	messages?: string[],
	name?: string,
	price?: number,
	price_currency?: string,
	sem3_id?: string,
	sitedetails?: Object[],
	upc?: string,
	updated_at?: number,
	weight?: number,
	width?: number,
	quantity?: number,
	brand?: string,
	category?: string,
	savings?: any,
	offers?: String[],
	picture?: string,
	rating?: number,

}

export type ProductList = Product[];

// export interface Product {
//   id?: number;
//   name?: string;
//   picture?: string;
//   rating?: String[];
//   category?: String[];
//   brand?: String[];
//   offers?: String[];
//   price?: Number[];
//   images: object;
// }


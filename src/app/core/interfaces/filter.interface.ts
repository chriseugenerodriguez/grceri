
import { Category } from './product.interface';

export type String = {
	value: string;
};

export type Number = {
	value: number;
};

export interface CategoryFilter {
	id: string;
	name: string;
	sub?: Category[];
	category?: Category[];
	num?: number
}

export type BrandFilter = {
	name: string,
	num: number
}

export type PriceFilter = {
	from: number,
	to: number,
	num: number
}

export type RatingFilter = {
	rate: number,
	num: number
}

export interface Filter {
	rating?: RatingFilter[];
	category?: CategoryFilter[];
	brand?: BrandFilter[];
	offers?: String[];
	price?: PriceFilter[];
}

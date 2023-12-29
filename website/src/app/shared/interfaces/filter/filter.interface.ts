import { IRatingFilter } from './sections/rating.filter.interface';
import { ICategoryFilter } from './sections/category.filter.interface';
import { IBrandFilter } from './sections/brand.filter.interface';
import { IPriceFilter } from './sections/price.filter.interface';

export interface IString {
	value: string
}

export interface Filter {
	rating?: IRatingFilter[];
	category?: ICategoryFilter[];
	brand?: IBrandFilter[];
	shipping?: IString[];
	diet?: IString[];
	price?: IPriceFilter[];
}

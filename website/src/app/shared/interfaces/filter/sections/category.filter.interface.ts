import { Category } from '../../category/category.interface';

export interface ICategoryFilter {
	id: string;
	name: string;
	sub?: Category[];
	category?: Category[];
	num?: number
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Food } from '../index';
import { Observable, catchError, throwError } from 'rxjs';

const api = 'https://grcerifunctions.azurewebsites.net';

@Injectable()
export class DBService {
	constructor(private http: HttpClient) { }

	// GET PRODUCTS
	public getAllProducts() {
		return this.http.get(`${api}/categories`).pipe(
			catchError(this._errorHandler)
		);
	}

	public getProducts(cat) {
		return this.http.get(`${api}/categories/${cat}`).pipe(
			catchError(this._errorHandler)
		);
	}

	public getProduct(cat) {
		return this.http.get(`${api}/categories/${cat}/${cat.id}`).pipe(
			catchError(this._errorHandler)
		);
	}

	// SEARCH
	public postSearch(cat) {
		return this.http.post(`${api}/search/`, cat).pipe(
			catchError(this._errorHandler)
		);
	}

	// SLIDER
	public popularFoods() {
		return this.http.get(`${api}/slider/popular`).pipe(
			catchError(this._errorHandler)
		);
	}

	public searchedItems() {
		return this.http.get(`${api}/slider/search`).pipe(
			catchError(this._errorHandler)
		);
	}

	// USER
	public postUserCart(userId, product) {
		return this.http.post(`${api}/user/${userId}/cart/`, product).pipe(
			catchError(this._errorHandler)
		);
	}

	public postUserRecipe(userId, recipe) {
		return this.http.post(`${api}/user/${userId}/recipe/`, recipe).pipe(
			catchError(this._errorHandler)
		);
	}


	// addFood(food: Food) {
	// 	return this.http.post<Food>(`${api}/food/`, food);
	// }

	// updateFood(food: Food) {
	// 	return this.http.put<Food>(`${api}/food/${food.id}`, food);
	// }

	private _errorHandler(error: Response) {
		console.error(error);
		return throwError(error || 'Server Error');
	}
}

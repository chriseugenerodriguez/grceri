import * as fs from 'fs-extra';
import * as path from 'path';
import Constants from '../misc/constants';
import axios from 'axios';

// VARIABLES
let api = Constants.misc.api;

class ListAPI {

	async getMostWatchedLists(req, res, next) {
		try {
			const response = await axios.get(`${api}/lists/products/most-watched`);
			res.json(response.data);
		} catch (error) {
			next(error);
		}
	}

	async getMostWatchedListsID(req, res, next) {
		try {
			const response = await axios.get(`${api}/lists/products/most-watched/?productId=${req.params.productId}`);
			res.json(response.data);
		} catch (error) {
			next(error);
		}
	}

	async getMostViewedProducts(req, res, next) {
		try {
			const response = await axios.get(`${api}/lists/products/most-viewed`);
			res.json(response.data);
		} catch (error) {
			next(error);
		}
	}

	async getMostViewedProductsID(req, res, next) {
		try {
			const response = await axios.get(`${api}/lists/products/most-viewed/?productId=${req.params.productId}`);
			res.json(response.data);
		} catch (error) {
			next(error);
		}
	}

	async getMostFollowedLists(req, res, next) {
		try {
			const response = await axios.get(`${api}/lists/most-followed`);
			res.json(response.data);
		} catch (error) {
			next(error);
		}
	}
}

export default new ListAPI();

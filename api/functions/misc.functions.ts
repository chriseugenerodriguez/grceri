import * as fs from 'fs-extra';
import * as path from 'path';
import Constants from '../misc/constants';
import axios from 'axios';

// VARIABLES
let searchAPI = Constants.misc.search;
let api = Constants.misc.api;

class MiscAPI {

	async getCategories(req, res, next) {
		try {
			const response = await axios.get(`${api}/categories`);
			res.json(response.data);
		} catch (error) {
			next(error);
		}
	}

	async search(req, res, next) {
		try {
			const response = await axios.get(`${searchAPI}/${req.params.value}`);
			res.json(response.data);
		} catch (error) {
			next(error);
		}
	}
}

export default new MiscAPI();

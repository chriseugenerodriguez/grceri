import Constants from '../misc/constants';
import axios from 'axios';

let main = Constants.misc.api;

class SearchAPI {

	async getSearchPageSidebar(req, res, next) {
		try {
			const response = await axios.get(`${main}/products/searchSidebar/?category=${req.query.id}&search=${req.query.text}`);
			res.json(response.data);
		} catch (error) {
			next(error);
		}
	}

	async getSearchPageContent(req, res, next) {
		try {
			let request_url = '';

			if (req.query.filter === '') {
				request_url = `${main}/products/SearchResults/?category=${req.query.id}&search=${req.query.text}&$page=${req.query.page}&$pageSize=50`;
			} else {
				request_url = `${main}/products/SearchResults/?category=${req.query.id}&search=${req.query.text}&$filter=${req.query.filter}&$page=${req.query.page}&$pageSize=50`;
			}

			if (req.query.order !== '') {
				request_url = `${request_url}&${req.query.order}`;
			}

			console.log('Search Page Content', request_url);

			const response = await axios.get(request_url);
			res.json(response.data);
		} catch (error) {
			next(error);
		}
	}

	async searchUrlExists(req, res, next) {
		try {
			const response = await axios.post(`${main}/url/exists`, req.body);
			res.json(response.data);
		} catch (error) {
			next(error);
		}
	}

}

export default new SearchAPI();

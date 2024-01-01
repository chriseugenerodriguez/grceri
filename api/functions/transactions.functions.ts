import Constants from '../misc/constants';
import axios from 'axios';

let main = Constants.misc.api;

class TransactionsAPI {

	async getTransactions(req, res, next) {
		try {
			const response = await axios.get(`${main}/user/${req.params.uid}/transactions`);
			res.json(response.data);
		} catch (error) {
			next(error);
		}
	}

	async postTransaction(req, res, next) {
		try {
			const response = await axios.post(`${main}/user/${req.params.uid}/transactions`, req.body.obj);
			res.json(response.data);
		} catch (error) {
			next(error);
		}
	}

	async getTransaction(req, res, next) {
		try {
			const response = await axios.get(`${main}/user/${req.params.uid}/transactions/${req.params.tid}`);
			res.json(response.data);
		} catch (error) {
			next(error);
		}
	}

	async updateTransaction(req, res, next) {
		try {
			const response = await axios.put(`${main}/user/${req.params.uid}/transactions/${req.params.tid}`, req.body.obj);
			res.json(response.data);
		} catch (error) {
			next(error);
		}
	}

	async getPricingPlans(req, res, next) {
		try {
			console.log('Pricing Plans', `${main}/transactions/pricing-plans`);
			const response = await axios.get(`${main}/transactions/pricing-plans`);
			res.json(response.data);
		} catch (error) {
			next(error);
		}
	}

}

export default new TransactionsAPI();

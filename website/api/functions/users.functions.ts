import Constants from '../misc/constants';
import axios from 'axios';

import { HttpHeaders } from '@angular/common/http';

let main = Constants.misc.api;

class UsersAPI {

	async getEmail(req, res, next) {
		try {
			console.log('Email Check', `${main}/users/email/${req.params.email}`);
			const response = await axios.get(`${main}/users/email/${req.params.email}`);
			res.json(response.data);
		} catch (error) {
			next(error);
		}
	}

	async getUserProfile(req, res, next) {
		try {
			console.log('User Profile', `${main}/user/profile?jwt_token=${req.params.jwt_token}`);
			const response = await axios.get(`${main}/user/profile?jwt_token=${req.params.jwt_token}`);
			res.json(response.data);
		} catch (error) {
			next(error);
		}
	}

	async login(req, res, next) {
		try {
			console.log('Login', `${main}/users/login`);
			const response = await axios.post(`${main}/users/login`, req.body);
			res.json(response.data);
		} catch (error) {
			next(error);
		}
	}

	async loginCallback(req, res, next) {
		try {
			console.log('Login', `${main}/users/callback`);
			const response = await axios.post(`${main}/users/callback`, req.body);
			res.json(response.data);
		} catch (error) {
			next(error);
		}
	}

	async createStripeAccount(req, res, next) {
		try {
			console.log('Create Stripe Account', `${main}/customer`, req.body);
			const response = await axios.post(`${main}/customer`, req.body);
			res.json(response.data);
		} catch (error) {
			next(error);
		}
	}

	async createPaymentMethod(req, res, next) {
		try {
			console.log('Create Stripe Payment Method', `${main}/users/${req.params.uid}/settings/payment/add`, req.body);
			const response = await axios.post(`${main}/users/${req.params.uid}/settings/payment/add`, req.body);
			res.json(response.data);
		} catch (error) {
			next(error);
		}
	}

	async chargeCustomer(req, res, next) {
		try {
			console.log('POST Charge Customer', `${main}/users/${req.params.uid}/settings/payment/pay`, req.body);
			const response = await axios.post(`${main}/users/${req.params.uid}/settings/payment/pay`, req.body);
			res.json(response.data);
		} catch (error) {
			next(error);
		}
	}

	async editPaymentMethod(req, res, next) {
		try {
			console.log('Edit Stripe Payment Method', `${main}/users/${req.params.uid}/settings/payment/${req.params.paymentId}`, req.body);
			const response = await axios.put(`${main}/users/${req.params.uid}/settings/payment/${req.params.paymentId}`, req.body);
			res.json(response.data);
		} catch (error) {
			next(error);
		}
	}

	async removePaymentMethod(req, res, next) {
		try {
			console.log('Delete Stripe Payment Method', `${main}/users/${req.params.uid}/settings/payment/${req.params.paymentId}`);
			const response = await axios.delete(`${main}/users/${req.params.uid}/settings/payment/${req.params.paymentId}`);
			res.json(response.data);
		} catch (error) {
			next(error);
		}
	}

	async setPrimaryPaymentMethod(req, res, next) {
		try {
			console.log('Set Primary Stripe Payment Method', `${main}/users/${req.params.uid}/settings/payment/primary/${req.params.paymentId}`);
			const response = await axios.put(`${main}/users/${req.params.uid}/settings/payment/primary/${req.params.paymentId}`, req.body);
			res.json(response.data);
		} catch (error) {
			next(error);
		}
	}

	async getPaymentMethods(req, res, next) {
		try {
			console.log('Get Stripe Payment Methods', `${main}/users/${req.params.uid}/settings/payment`);
			const response = await axios.get(`${main}/users/${req.params.uid}/settings/payment`);
			res.json(response.data);
		} catch (error) {
			next(error);
		}
	}

	async getPricingPlan(req, res, next) {
		try {
			console.log('Get User Pricing Plan', `${main}/users/${req.params.uid}/settings/subscription`);
			const response = await axios.get(`${main}/users/${req.params.uid}/settings/subscription`);
			res.json(response.data);
		} catch (error) {
			next(error);
		}
	}

	async register(req, res, next) {
		try {
			console.log('Register', `${main}/users/register`);
			const response = await axios.post(`${main}/users/register`, req.body);
			res.json(response.data);
		} catch (error) {
			next(error);
		}
	}

	async createSubscription(req, res, next) {
		try {
			console.log('Create Subscription', `${main}/subscription`, req.body);
			const response = await axios.post(`${main}/subscription`, req.body);
			res.json(response.data);
		} catch (error) {
			next(error);
		}
	}

	async cancelSubscription(req, res, next) {
		try {
			console.log('Cancel Subscription', `${main}/subscription`, req.body);
			const options = {
				data: req.body
			};
			const response = await axios.delete(`${main}/subscription`, options);

			res.json(response.data);
		} catch (error) {
			next(error);
		}
	}

	async getFollowedLists(req, res, next) {
		try {
			const response = await axios.get(`${main}/users/${req.params.uid}/lists/following`);
			res.json(response.data);
		} catch (error) {
			next(error);
		}
	}

	async getDiscoverLists(req, res, next) {
		try {
			const response = await axios.get(`${main}/lists/discover`);
			res.json(response.data);
		} catch (error) {
			next(error);
		}
	}

	async getList(req, res, next) {
		try {
			const response = await axios.get(`${main}/users/${req.params.uid}/lists/${req.params.lid}`);
			res.json(response.data);
		} catch (error) {
			next(error);
		}
	}

	async postList(req, res, next) {
		try {
			console.log('Shopping List POST API', `${main}/users/${req.params.uid}/list/${req.params.name}`, req.body);
			const response = await axios.post(`${main}/users/${req.params.uid}/list/${req.params.name}`, req.body);
			res.json(response.data);
		} catch (error) {
			next(error);
		}
	}

	async verifyUserPassword(req, res, next) {
		try {
			console.log('Verify user password', `${main}/users/${req.params.uid}/validatePassword`, req.body);
			const response = await axios.post(`${main}/users/${req.params.uid}/validatePassword`, req.body);
			res.json(response.data);
		} catch (error) {
			next(error);
		}
	}

	async followList(req, res, next) {
		try {
			console.log('Follow list', `${main}/users/${req.params.uid}/lists/${req.params.lid}`, req.body);
			const response = await axios.post(`${main}/users/${req.params.uid}/lists/${req.params.lid}`, req.body);
			res.json(response.data);
		} catch (error) {
			next(error);
		}
	}

	async updateList(req, res, next) {
		try {
			console.log('UPDATE LIST PUT', `${main}/users/${req.params.uid}/lists/${req.params.lid}`, req.body);
			const response = await axios.put(`${main}/users/${req.params.uid}/lists/${req.params.lid}`, req.body);
			res.json(response.data);
		} catch (error) {
			next(error);
		}
	}

	async updatePassword(req, res, next) {
		try {
			console.log('UPDATE PASSWORD PUT', `${main}/users/${req.params.uid}/settings/security/password`, req.body);
			const response = await axios.put(`${main}/users/${req.params.uid}/settings/security/password`, req.body);
			res.json(response.data);
		} catch (error) {
			next(error);
		}
	}

	async updateEmail(req, res, next) {
		try {
			console.log('UPDATE EMAIL PUT', `${main}/users/${req.params.uid}/settings/security/email`, req.body);
			const response = await axios.put(`${main}/users/${req.params.uid}/settings/security/email`, req.body);
			res.json(response.data);
		} catch (error) {
			next(error);
		}
	}

	async updateTwoFactorAuthentication(req, res, next) {
		try {
			console.log('UPDATE TWO FACTOR PUT', `${main}/users/${req.params.uid}/settings/security/two-factor`, req.body);
			const response = await axios.put(`${main}/users/${req.params.uid}/settings/security/two-factor`, req.body);
			res.json(response.data);
		} catch (error) {
			next(error);
		}
	}

	async getTwoFactorAuthentication(req, res, next) {
		try {
			console.log('GET TWO FACTOR AUTH', `${main}/users/${req.params.uid}/settings/security/two-factor`);
			const response = await axios.get(`${main}/users/${req.params.uid}/settings/security/two-factor`);
			res.json(response.data);
		} catch (error) {
			next(error);
		}
	}

	async updateUserProfile(req, res, next) {
		try {
			console.log('UPDATE PROFILE PUT', `${main}/users/${req.params.uid}/settings/profile`, req.body);
			const response = await axios.put(`${main}/users/${req.params.uid}/settings/profile`, req.body);
			res.json(response.data);
		} catch (error) {
			next(error);
		}
	}

	async deleteList(req, res, next) {
		try {
			console.log("Delete list", `${main}/users/${req.params.uid}/lists/${req.params.lid}`);
			const response = await axios.delete(`${main}/users/${req.params.uid}/lists/${req.params.lid}`);
			res.json(response.data);
		} catch (error) {
			next(error);
		}
	}

	async unfollowList(req, res, next) {
		try {
			console.log("Unfollow list", `${main}/users/${req.params.uid}/lists/${req.params.listId}/unfollow`);
			const response = await axios.post(`${main}/users/${req.params.uid}/lists/${req.params.listId}/unfollow`);
			res.json(response.data);
		} catch (error) {
			next(error);
		}
	}

	async deleteUserListItem(req, res, next) {
		try {
			console.log('delete list item', `${main}/users/${req.params.uid}/lists/${req.params.listId}/${req.params.productID}`);
			const response = await axios.delete(`${main}/users/${req.params.uid}/lists/${req.params.listId}/${req.params.productID}`);
			res.json(response.data);
		} catch (error) {
			next(error);
		}
	}

	async deleteViewedProduct(req, res, next) {
		try {
			const response = await axios.delete(`${main}/users/${req.params.uid}/viewed/${req.params.productID}`);
			res.json(response.data);
		} catch (error) {
			next(error);
		}
	}

	async deleteSearch(req, res, next) {
		try {
			console.log('delete recently searched from API', `${main}/users/${req.params.uid}/history/search`);
			const response = await axios.delete(`${main}/users/${req.params.uid}/history/search`);
			res.json(response.data);
		} catch (error) {
			next(error);
		}
	}

	async getViewedProducts(req, res, next) {
		try {
			console.log('viewed products', `${main}/users/${req.params.uid}/viewed?$pageSize=${req.params.pageSize}`);
			const response = await axios.get(`${main}/users/${req.params.uid}/viewed?$pageSize=${req.params.pageSize}`);
			res.json(response.data);
		} catch (error) {
			next(error);
		}
	}

	async getSearched(req, res, next) {
		try {
			const response = await axios.get(`${main}/users/${req.params.uid}/history/search`);
			res.json(response.data);
		} catch (error) {
			next(error);
		}
	}

	async getSavedProducts(req, res, next) {
		try {
			const response = await axios.get(`${main}/users/${req.params.uid}/saved`);
			res.json(response.data);
		} catch (error) {
			next(error);
		}
	}

	async getWatchlist(req, res, next) {
		try {
			const response = await axios.get(`${main}/users/${req.params.uid}/watchlist`);
			res.json(response.data);
		} catch (error) {
			next(error);
		}
	}

	async getSettings(req, res, next) {
		try {
			const response = await axios.get(`${main}/user/${req.params.uid}/settings`);
			res.json(response.data);
		} catch (error) {
			next(error);
		}
	}

	async updateSettings(req, res, next) {
		try {
			const response = await axios.put(`${main}/user/${req.params.uid}/settings`, req.body.obj);
			res.json(response.data);
		} catch (error) {
			next(error);
		}
	}

	async getProfile(req, res, next) {
		try {
			const response = await axios.get(`${main}/users/${req.params.uid}`);
			res.json(response.data);
		} catch (error) {
			next(error);
		}
	}

	async getUserSettingsProfile(req, res, next) {
		try {
			console.log('User profile', `${main}/users/${req.params.uid}/settings/profile`);
			const response = await axios.get(`${main}/users/${req.params.uid}/settings/profile`);
			res.json(response.data);
		} catch (error) {
			next(error);
		}
	}

	async updateProfile(req, res, next) {
		try {
			const response = await axios.put(`${main}/user/${req.params.uid}/profile`, req.body.obj);
			res.json(response.data);
		} catch (error) {
			next(error);
		}
	}

	async productViewStatus(req, res, next) {
		try {
			console.log('Product Viewed API', `${main}/users/${req.body.uid}/viewed/${req.body.productID}`);
			const response = await axios.post(`${main}/users/${req.body.uid}/viewed/${req.body.productID}`);
			res.json(response.data);
		} catch (error) {
			next(error);
		}
	}

	async postProduct(req, res, next) {
		try {
			console.log('Save product API', `${main}/users/${req.body.uid}/save/${req.body.productID}`);
			const response = await axios.post(`${main}/users/${req.body.uid}/save/${req.body.productID}`);
			res.json(response.data);
		} catch (error) {
			next(error);
		}
	}

	async saveSearch(req, res, next) {
		try {
			console.log('Save recently searched API', `${main}/users/${req.body.uid}/history/search`);
			const response = await axios.post(`${main}/users/${req.params.uid}/history/search`, req.body);
			res.json(response.data);
		} catch (error) {
			next(error);
		}
	}

	async deleteProduct(req, res, next) {
		try {
			console.log('Delete product API', `${main}/users/${req.params.uid}/save/${req.params.productID}`);
			const response = await axios.delete(`${main}/users/${req.params.uid}/save/${req.params.productID}`);
			res.json(response.data);
		} catch (error) {
			next(error);
		}
	}

	async postWatchlist(req, res, next) {
		try {
			console.log('WatchList API', `${main}/users/${req.body.uid}/watchlist/${req.body.productID}`);
			const response = await axios.post(`${main}/users/${req.body.uid}/watchlist/${req.body.productID}`);
			res.json(response.data);
		} catch (error) {
			next(error);
		}
	}

	async removeFromWatchList(req, res, next) {
		try {
			console.log('Remove From WatchList API', `${main}/users/${req.params.uid}/watchlist/${req.params.productID}`);
			const response = await axios.delete(`${main}/users/${req.params.uid}/watchlist/${req.params.productID}`);
			res.json(response.data);
		} catch (error) {
			next(error);
		}
	}

	async updateLists(req, res, next) {
		try {
			console.log('Shopping List UPDATE API', `${main}/users/${req.params.uid}/lists/${req.params.listId}/${req.params.productID}`);
			const response = await axios.post(`${main}/users/${req.params.uid}/lists/${req.params.listId}/${req.params.productID}`);
			res.json(response.data);
		} catch (error) {
			next(error);
		}
	}

	async getLists(req, res, next) {
		try {
			console.log('Shopping List GET API', `${main}/users/${req.params.uid}/lists`);
			const response = await axios.get(`${main}/users/${req.params.uid}/lists`);
			res.json(response.data);
		} catch (error) {
			next(error);
		}
	}

	async postUserLabel(req, res, next) {
		try {
			console.log('POST User Label', `${main}/users/${req.params.uid}/labels/${req.params.label}`);
			const response = await axios.post(`${main}/users/${req.params.uid}/labels/${req.params.label}`);
			res.json(response.data);
		} catch (error) {
			next(error);
		}
	}

	async putUserLabel(req, res, next) {
		try {
			console.log('PUT User Label', `${main}/users/${req.params.uid}/labels`, req.body);
			const response = await axios.put(`${main}/users/${req.params.uid}/labels`, req.body);
			res.json(response.data);
		} catch (error) {
			next(error);
		}
	}

	async getUserLabels(req, res, next) {
		try {
			console.log('GET User Label', `${main}/users/${req.params.uid}/labels`);
			const response = await axios.get(`${main}/users/${req.params.uid}/labels`);
			res.json(response.data);
		} catch (error) {
			next(error);
		}
	}

	async getUserListLabels(req, res, next) {
		try {
			console.log('GET User List Label', `${main}/users/${req.params.uid}/lists/${req.params.listId}/labels`);
			const response = await axios.get(`${main}/users/${req.params.uid}/lists/${req.params.listId}/labels`);
			res.json(response.data);
		} catch (error) {
			next(error);
		}
	}

	async postUserListLabel(req, res, next) {
		try {
			console.log('POST User Label', `${main}/users/${req.params.uid}/lists/${req.params.listId}/labels/${req.params.label}`);
			const response = await axios.post(`${main}/users/${req.params.uid}/lists/${req.params.listId}/labels/${req.params.label}`);
			res.json(response.data);
		} catch (error) {
			next(error);
		}
	}

	async putUserListLabel(req, res, next) {
		try {
			console.log('PUT User Label', `${main}/users/${req.params.uid}/lists/${req.params.listId}/labels`, req.body);
			const response = await axios.put(`${main}/users/${req.params.uid}/lists/${req.params.listId}/labels`, req.body);
			res.json(response.data);
		} catch (error) {
			next(error);
		}
	}

	async removeUserListLabel(req, res, next) {
		try {
			console.log('DELETE User Label', `${main}/users/${req.params.uid}/lists/${req.params.listId}/labels/${req.params.label}`);
			const response = await axios.delete(`${main}/users/${req.params.uid}/lists/${req.params.listId}/labels/${req.params.label}`);
			res.json(response.data);
		} catch (error) {
			next(error);
		}
	}
}

export default new UsersAPI();

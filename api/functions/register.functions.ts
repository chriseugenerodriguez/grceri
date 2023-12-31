import Constants from '../misc/constants';
import axios from 'axios';

let main = Constants.misc.api;

class RegisterAPI {

	async registerPhoneNumber(req, res, next) {
		try {
			console.log('Register phone number', `${main}/register/${req.params.phone}`);
			const response = await axios.post(`${main}/register/${req.params.phone}`);
			res.json(response.data);
		} catch (error) {
			next(error);
		}
	}

}

export default new RegisterAPI();

// LODASH
import * as _ from 'lodash';

// Default configuations applied to all environments
const defaultConfig = {
	env: process.env.NODE_ENV,
	get envs() {
		return {
			development: process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'develop',
			production: process.env.NODE_ENV === 'production',
		};
	},
	misc: {
		'api': 'https://grceri-api-prod.azurewebsites.net/api',
		'search': 'https://grceri.search.windows.net'
	},
};


// Environment specific overrides
const environmentConfigs = {
	development: {

	},
	local: {

	},
	production: {
		ip: ''
	},
};
// Recursively merge configurations
export default _.merge(defaultConfig, environmentConfigs[process.env.NODE_ENV] || {});

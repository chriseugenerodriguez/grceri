import {
Router,
} from 'express';

import MiscAPI from '../functions/misc.functions';

const routes = Router();

routes.route('/categories').get(MiscAPI.getCategories);

routes.route('/search/:value').get(MiscAPI.search);

export default routes;

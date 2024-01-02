import {
	Router
} from 'express';

import ListAPI from '../functions/lists.functions';

const routes = Router();

routes.route('/followed').get(ListAPI.getMostFollowedLists);
routes.route('/viewed').get(ListAPI.getMostViewedProducts);
routes.route('/viewed/:productId').get(ListAPI.getMostViewedProductsID);
routes.route('/watched').get(ListAPI.getMostWatchedLists);
routes.route('/watched/:productId').get(ListAPI.getMostWatchedListsID);

export default routes;

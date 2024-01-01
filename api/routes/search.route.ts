import {
Router,
} from 'express';

import SearchAPI from '../functions/search.functions';

const routes = Router();

routes.route('/sidebar').get(SearchAPI.getSearchPageSidebar);

routes.route('/content').get(SearchAPI.getSearchPageContent);

routes.route('/url/exists').post(SearchAPI.searchUrlExists);

// routes.route('/:upc').get(ProductsAPI.getProduct);

export default routes;

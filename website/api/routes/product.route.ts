import {
	Router,
} from 'express';

import ProductsAPI from '../functions/products.functions';

const routes = Router();

routes.route('/').get(ProductsAPI.getProducts);

routes.route('/search').get(ProductsAPI.searchProducts);

routes.route('/sidebarFilters').get(ProductsAPI.getSidebarFilters);

routes.route('/:upc').get(ProductsAPI.getProduct);

// single product
routes.route('/product/details/:productId')
	.get(ProductsAPI.getProductDetails);
routes.route('/product/images/:productId')
	.get(ProductsAPI.getProductImages);
routes.route('/product/nutrition/:productId')
	.get(ProductsAPI.getProductNutrition);
routes.route('/product/vendors/:productId')
	.get(ProductsAPI.getProductVendors);
routes.route('/product/overview/:productId')
	.get(ProductsAPI.getProductOverview);
	routes.route('/product/history/:productId/:time')
	.get(ProductsAPI.getProductHistory);

// product feedback
routes.route('product/feedback').post(ProductsAPI.postFeedback);

routes.route('/product/get_pricing_plans')
	.get(ProductsAPI.getPricingPlans);

routes.route('/product/postTransactions')
	.post(ProductsAPI.postTransaction);

export default routes;

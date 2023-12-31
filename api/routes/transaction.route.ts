import {
Router,
} from 'express';

import TransactionsAPI from '../functions/transactions.functions';

const routes = Router();

routes.route('/:uid')
.get(TransactionsAPI.getTransactions)
.post(TransactionsAPI.postTransaction);

routes.route('/:uid/:tid')
.get(TransactionsAPI.getTransaction)
.put(TransactionsAPI.updateTransaction);

routes.route('/transaction/get_pricing_plans')
.get(TransactionsAPI.getPricingPlans);

// routes.route('/get_pricing_plans')
// .get(function(req, res, next){
//   console.log('Hello');
// });

export default routes;

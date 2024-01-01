import {
Router,
} from 'express';

import UsersAPI from '../functions/users.functions';

const routes = Router();

routes.route('/email/:email').get(UsersAPI.getEmail);

// STRIPE
routes.route('/customer')
.post(UsersAPI.createStripeAccount);
routes.route('/:uid/settings/payment/add')
.post(UsersAPI.createPaymentMethod);
routes.route('/:uid/settings/payment/:paymentId')
.put(UsersAPI.editPaymentMethod)
.delete(UsersAPI.removePaymentMethod);
routes.route('/:uid/settings/payment/primary/:paymentId')
.put(UsersAPI.setPrimaryPaymentMethod);
routes.route('/:uid/settings/payment')
.get(UsersAPI.getPaymentMethods);
routes.route('/:uid/settings/subscription')
.get(UsersAPI.getPricingPlan);
routes.route('/:uid/settings/payment/pay')
.post(UsersAPI.chargeCustomer);
routes.route('/subscription')
.post(UsersAPI.createSubscription);
routes.route('/subscription')
.delete(UsersAPI.cancelSubscription);

// login
routes.route('/profile/:jwt_token').get(UsersAPI.getUserProfile);
routes.route('/login').post(UsersAPI.login);
routes.route('/callback').post(UsersAPI.loginCallback);
routes.route('/register').post(UsersAPI.register);

// user lists
routes.route('/:uid/lists').get(UsersAPI.getLists);

// user list
routes.route('/:uid/list/:name').post(UsersAPI.postList);
routes.route('/:uid/validatePassword').post(UsersAPI.verifyUserPassword);
routes.route('/:uid/lists/:lid')
.post(UsersAPI.followList)
.get(UsersAPI.getList)
.put(UsersAPI.updateList)
.delete(UsersAPI.deleteList);

// shopping list
routes.route('/:uid/lists/:listId/:productID')
.post(UsersAPI.updateLists);
routes.route('/:uid/lists/:listId/delete/:productID')
.delete(UsersAPI.deleteUserListItem);
routes.route('/:uid/lists').get(UsersAPI.getLists);
routes.route('/:uid/lists/:listId').get(UsersAPI.getList);
routes.route('/:uid/lists/:listId/unfollow').post(UsersAPI.unfollowList);
routes.route('/:uid/lists/following').get(UsersAPI.getFollowedLists);
routes.route('/lists/discover').get(UsersAPI.getDiscoverLists);

// settings
routes.route('/:uid/settings/profile').get(UsersAPI.getUserSettingsProfile);
routes.route('/:uid/settings/profile').put(UsersAPI.updateUserProfile);
routes.route('/:uid/settings/security/password').put(UsersAPI.updatePassword);
routes.route('/:uid/settings/security/email').put(UsersAPI.updateEmail);
routes.route('/:uid/settings/security/two-factor')
.put(UsersAPI.updateTwoFactorAuthentication)
.get(UsersAPI.getTwoFactorAuthentication);
routes.route('/profile/settings/:uid')
.get(UsersAPI.getSettings)
.put(UsersAPI.updateSettings)
.delete(UsersAPI.deleteList);

// profile
routes.route('/:uid')
.get(UsersAPI.getProfile)
.put(UsersAPI.updateProfile);

// PRODUCT INFORMATION
routes.route('/:uid/viewed/:pageSize')
.get(UsersAPI.getViewedProducts);

routes.route('/:uid/viewed/:productID')
.delete(UsersAPI.deleteViewedProduct);

routes.route('/:uid/history/search')
.get(UsersAPI.getSearched);

routes.route('/:uid/history/search')
.post(UsersAPI.saveSearch);

routes.route('/:uid/history/search')
.delete(UsersAPI.deleteSearch);

routes.route('/:uid/saved')
.get(UsersAPI.getSavedProducts);

routes.route('/:uid/watchlist')
.get(UsersAPI.getWatchlist);

routes.route('/postProductStatusViewed')
.post(UsersAPI.productViewStatus);

routes.route('/postProduct')
.post(UsersAPI.postProduct);

routes.route('/:uid/deleteProduct/:productID')
.delete(UsersAPI.deleteProduct);

routes.route('/postWatchlist')
.post(UsersAPI.postWatchlist);

routes.route('/:uid/removeFromWatchList/:productID')
.delete(UsersAPI.removeFromWatchList);

// Label
routes.route('/:uid/labels/:label')
.post(UsersAPI.postUserLabel);

routes.route('/:uid/labels')
.put(UsersAPI.putUserLabel);

routes.route('/:uid/labels')
.get(UsersAPI.getUserLabels);

routes.route('/:uid/lists/:listId/labels')
.get(UsersAPI.getUserListLabels);

routes.route('/:uid/lists/:listId/labels/:label')
.post(UsersAPI.postUserListLabel);

routes.route('/:uid/lists/:listId/labels/:label')
.delete(UsersAPI.removeUserListLabel);

routes.route('/:uid/lists/:listId/labels')
.put(UsersAPI.putUserListLabel);

export default routes;

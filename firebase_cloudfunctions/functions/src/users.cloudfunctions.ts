import * as functions from "firebase-functions";
import axios from 'axios';



export const getEmail = functions.https.onRequest(async (req, res) => {
    try {
        const response = await axios.get(`${api}/users/${req.params.id}`);
        res.json(response.data);
    } catch (error: any) {
        res.status(500).send(error.message.toString());
    }
});


export const getUserProfile = functions.https.onRequest(async (req, res) => {
    try {
        const response = await axios.get(`${api}/user/profile?jwt_token=${req.params.jwt_token}`);
        res.json(response.data);
    } catch (error: any) {
        res.status(500).send(error.message.toString());
    }
});

export const login = functions.https.onRequest(async (req, res) => {
    try {
        const response = await axios.post(`${api}/users/login`, req.body);
        res.json(response.data);
    } catch (error: any) {
        res.status(500).send(error.message.toString());
    }
});

export const loginCallback = functions.https.onRequest(async (req, res) => {
    try {
        const response = await axios.post(`${api}/users/callback`, req.body);
        res.json(response.data);
    } catch (error: any) {
        res.status(500).send(error.message.toString());
    }
});

export const createStripeAccount = functions.https.onRequest(async (req, res) => {
    try {
        const response = await axios.post(`${api}/customer`, req.body);
        res.json(response.data);
    } catch (error: any) {
        res.status(500).send(error.message.toString());
    }
});

export const createPaymentMethod = functions.https.onRequest(async (req, res) => {
    try {
        const response = await axios.post(`${api}/users/${req.params.uid}/settings/payment/add`, req.body);
        res.json(response.data);
    } catch (error: any) {
        res.status(500).send(error.message.toString());
    }
});

export const chargeCustomer = functions.https.onRequest(async (req, res) => {
    try {
        const response = await axios.post(`${api}/users/${req.params.uid}/settings/payment/pay`, req.body);
        res.json(response.data);
    } catch (error: any) {
        res.status(500).send(error.message.toString());
    }
});

export const editPaymentMethod = functions.https.onRequest(async (req, res) => {
    try {
        const response = await axios.put(`${api}/users/${req.params.uid}/settings/payment/${req.params.paymentId}`, req.body);
        res.json(response.data);
    } catch (error: any) {
        res.status(500).send(error.message.toString());
    }
});

export const removePaymentMethod = functions.https.onRequest(async (req, res) => {
    try {
        const response = await axios.delete(`${api}/users/${req.params.uid}/settings/payment/${req.params.paymentId}`);
        res.json(response.data);
    } catch (error: any) {
        res.status(500).send(error.message.toString());
    }
});

export const setPrimaryPaymentMethod = functions.https.onRequest(async (req, res) => {
    try {
        const response = await axios.put(`${api}/users/${req.params.uid}/settings/payment/primary/${req.params.paymentId}`, req.body);
        res.json(response.data);
    } catch (error: any) {
        res.status(500).send(error.message.toString());
    }
});

export const getPaymentMethods = functions.https.onRequest(async (req, res) => {
    try {
        const response = await axios.get(`${api}/users/${req.params.uid}/settings/payment`);
        res.json(response.data);
    } catch (error: any) {
        res.status(500).send(error.message.toString());
    }
});
export const getPricingPlan = functions.https.onRequest(async (req, res) => {
    try {
        const response = await axios.get(`${api}/users/${req.params.uid}/settings/subscription`);
        res.json(response.data);
    } catch (error: any) {
        res.status(500).send(error.message.toString());
    }
});

export const register = functions.https.onRequest(async (req, res) => {
    try {
        const response = await axios.post(`${api}/users/register`, req.body);
        res.json(response.data);
    } catch (error: any) {
        res.status(500).send(error.message.toString());
    }
});
export const createSubscription = functions.https.onRequest(async (req, res) => {
    try {
        const response = await axios.post(`${api}/subscription`, req.body);
        res.json(response.data);
    } catch (error: any) {
        res.status(500).send(error.message.toString());
    }
});

export const cancelSubscription = functions.https.onRequest(async (req, res) => {
    try {
        const options = {
            data: req.body
        };
        const response = await axios.delete(`${api}/subscription`, options);
        res.json(response.data);
    } catch (error: any) {
        res.status(500).send(error.message.toString());
    }
});

export const getFollowedLists = functions.https.onRequest(async (req, res) => {
    try {
        const response = await axios.get(`${api}/users/${req.params.uid}/lists/following`);
        res.json(response.data);
    } catch (error: any) {
        res.status(500).send(error.message.toString());
    }
});

export const getDiscoverLists = functions.https.onRequest(async (req, res) => {
    try {
        const response = await axios.get(`${api}/lists/discover`);
        res.json(response.data);
    } catch (error: any) {
        res.status(500).send(error.message.toString());
    }
});

export const getList = functions.https.onRequest(async (req, res) => {
    try {
        const response = await axios.get(`${api}/users/${req.params.uid}/lists/${req.params.lid}`);
        res.json(response.data);
    } catch (error: any) {
        res.status(500).send(error.message.toString());
    }
});

export const postList = functions.https.onRequest(async (req, res) => {
    try {
        const response = await axios.post(`${api}/users/${req.params.uid}/list/${req.params.name}`, req.body);
        res.json(response.data);
    } catch (error: any) {
        res.status(500).send(error.message.toString());
    }
});

export const verifyUserPassword = functions.https.onRequest(async (req, res) => {
    try {
        const response = await axios.post(`${api}/users/${req.params.uid}/validatePassword`, req.body);
        res.json(response.data);
    } catch (error: any) {
        res.status(500).send(error.message.toString());
    }
});

export const followList = functions.https.onRequest(async (req, res) => {
    try {
        const response = await axios.post(`${api}/users/${req.params.uid}/lists/${req.params.lid}`, req.body);
        res.json(response.data);
    } catch (error: any) {
        res.status(500).send(error.message.toString());
    }
});

export const updateList = functions.https.onRequest(async (req, res) => {
    try {
        const response = await axios.put(`${api}/users/${req.params.uid}/lists/${req.params.lid}`, req.body);
        res.json(response.data);
    } catch (error: any) {
        res.status(500).send(error.message.toString());
    }
});

export const updatePassword = functions.https.onRequest(async (req, res) => {
    try {
        const response = await axios.put(`${api}/users/${req.params.uid}/settings/security/password`, req.body);
        res.json(response.data);
    } catch (error: any) {
        res.status(500).send(error.message.toString());
    }
});

export const updateEmail = functions.https.onRequest(async (req, res) => {
    try {
        const response = await axios.put(`${api}/users/${req.params.uid}/settings/security/email`, req.body);
        res.json(response.data);
    } catch (error: any) {
        res.status(500).send(error.message.toString());
    }
});

export const updateTwoFactorAuthentication = functions.https.onRequest(async (req, res) => {
    try {
        const response = await axios.put(`${api}/users/${req.params.uid}/settings/security/two-factor`, req.body);
        res.json(response.data);
    } catch (error: any) {
        res.status(500).send(error.message.toString());
    }
});

export const getTwoFactorAuthentication = functions.https.onRequest(async (req, res) => {
    try {
        const response = await axios.get(`${api}/users/${req.params.uid}/settings/security/two-factor`);
        res.json(response.data);
    } catch (error: any) {
        res.status(500).send(error.message.toString());
    }
});

export const updateUserProfile = functions.https.onRequest(async (req, res) => {
    try {
        const response = await axios.put(`${api}/users/${req.params.uid}/settings/profile`, req.body);
        res.json(response.data);
    } catch (error: any) {
        res.status(500).send(error.message.toString());
    }
});

export const deleteList = functions.https.onRequest(async (req, res) => {
    try {
        const response = await axios.delete(`${api}/users/${req.params.uid}/lists/${req.params.lid}`);
        res.json(response.data);
    } catch (error: any) {
        res.status(500).send(error.message.toString());
    }
});


export const unfollowList = functions.https.onRequest(async (req, res) => {
    try {
        const response = await axios.post(`${api}/users/${req.params.uid}/lists/${req.params.listId}/unfollow`);
        res.json(response.data);
    } catch (error: any) {
        res.status(500).send(error.message.toString());
    }
});

export const deleteUserListItem = functions.https.onRequest(async (req, res) => {
    try {
        const response = await axios.delete(`${api}/users/${req.params.uid}/lists/${req.params.listId}/${req.params.productID}`);
        res.json(response.data);
    } catch (error: any) {
        res.status(500).send(error.message.toString());
    }
});

export const deleteViewedProduct = functions.https.onRequest(async (req, res) => {
    try {
        const response = await axios.delete(`${api}/users/${req.params.uid}/viewed/${req.params.productID}`);
        res.json(response.data);
    } catch (error: any) {
        res.status(500).send(error.message.toString());
    }
});

export const deleteSearch = functions.https.onRequest(async (req, res) => {
    try {
        const response = await axios.delete(`${api}/users/${req.params.uid}/history/search`);
        res.json(response.data);
    } catch (error: any) {
        res.status(500).send(error.message.toString());
    }
});

export const getViewedProducts = functions.https.onRequest(async (req, res) => {
    try {

        const response = await axios.get(`${api}/users/${req.params.uid}/viewed?$pageSize=${req.params.pageSize}`);
        res.json(response.data);
    } catch (error: any) {
        res.status(500).send(error.message.toString());
    }
});

export const getSearched = functions.https.onRequest(async (req, res) => {
    try {
        const response = await axios.get(`${api}/users/${req.params.uid}/history/search`);
        res.json(response.data);
    } catch (error: any) {
        res.status(500).send(error.message.toString());
    }
});


export const getSavedProducts = functions.https.onRequest(async (req, res) => {
    try {
        const response = await axios.get(`${api}/users/${req.params.uid}/saved`);
        res.json(response.data);
    } catch (error: any) {
        res.status(500).send(error.message.toString());
    }
});

export const getWatchlist = functions.https.onRequest(async (req, res) => {
    try {
        const response = await axios.get(`${api}/users/${req.params.uid}/watchlist`);
        res.json(response.data);
    } catch (error: any) {
        res.status(500).send(error.message.toString());
    }
});

export const getSettings = functions.https.onRequest(async (req, res) => {
    try {
        const response = await axios.get(`${api}/user/${req.params.uid}/settings`);
        res.json(response.data);
    } catch (error: any) {
        res.status(500).send(error.message.toString());
    }
});

export const updateSettings = functions.https.onRequest(async (req, res) => {
    try {
        const response = await axios.put(`${api}/user/${req.params.uid}/settings`, req.body.obj);
        res.json(response.data);
    } catch (error: any) {
        res.status(500).send(error.message.toString());
    }
});

export const getProfile = functions.https.onRequest(async (req, res) => {
    try {
        const response = await axios.get(`${api}/users/${req.params.uid}`);
        res.json(response.data);
    } catch (error: any) {
        res.status(500).send(error.message.toString());
    }
});

export const getUserSettingsProfile = functions.https.onRequest(async (req, res) => {
    try {
        const response = await axios.get(`${api}/users/${req.params.uid}/settings/profile`);
        res.json(response.data);
    } catch (error: any) {
        res.status(500).send(error.message.toString());
    }
});

export const updateProfile = functions.https.onRequest(async (req, res) => {
    try {
        const response = await axios.put(`${api}/user/${req.params.uid}/profile`, req.body.obj);
        res.json(response.data);
    } catch (error: any) {
        res.status(500).send(error.message.toString());
    }
});

export const productViewStatus = functions.https.onRequest(async (req, res) => {
    try {
        const response = await axios.post(`${api}/users/${req.body.uid}/viewed/${req.body.productID}`);
        res.json(response.data);
    } catch (error: any) {
        res.status(500).send(error.message.toString());
    }
});


export const postProduct = functions.https.onRequest(async (req, res) => {
    try {
        const response = await axios.post(`${api}/users/${req.body.uid}/save/${req.body.productID}`);
        res.json(response.data);
    } catch (error: any) {
        res.status(500).send(error.message.toString());
    }
});

export const saveSearch = functions.https.onRequest(async (req, res) => {
    try {
        const response = await axios.post(`${api}/users/${req.params.uid}/history/search`, req.body);
        res.json(response.data);
    } catch (error: any) {
        res.status(500).send(error.message.toString());
    }
});

export const deleteProduct = functions.https.onRequest(async (req, res) => {
    try {
        const response = await axios.delete(`${api}/users/${req.params.uid}/save/${req.params.productID}`);
        res.json(response.data);
    } catch (error: any) {
        res.status(500).send(error.message.toString());
    }
});

export const postWatchlist = functions.https.onRequest(async (req, res) => {
    try {
        const response = await axios.post(`${api}/users/${req.body.uid}/watchlist/${req.body.productID}`);
        res.json(response.data);
    } catch (error: any) {
        res.status(500).send(error.message.toString());
    }
});

export const removeFromWatchList = functions.https.onRequest(async (req, res) => {
    try {
        const response = await axios.delete(`${api}/users/${req.params.uid}/watchlist/${req.params.productID}`);
        res.json(response.data);
    } catch (error: any) {
        res.status(500).send(error.message.toString());
    }
});


export const updateLists = functions.https.onRequest(async (req, res) => {
    try {
        const response = await axios.post(`${api}/users/${req.params.uid}/lists/${req.params.listId}/${req.params.productID}`);
        res.json(response.data);
    } catch (error: any) {
        res.status(500).send(error.message.toString());
    }
});

export const getLists = functions.https.onRequest(async (req, res) => {
    try {
        const response = await axios.get(`${api}/users/${req.params.uid}/lists`);
        res.json(response.data);
    } catch (error: any) {
        res.status(500).send(error.message.toString());
    }
});

export const postUserLabel = functions.https.onRequest(async (req, res) => {
    try {
        const response = await axios.post(`${api}/users/${req.params.uid}/labels/${req.params.label}`);
        res.json(response.data);
    } catch (error: any) {
        res.status(500).send(error.message.toString());
    }
});

export const putUserLabel = functions.https.onRequest(async (req, res) => {
    try {
        const response = await axios.put(`${api}/users/${req.params.uid}/labels`, req.body);
        res.json(response.data);
    } catch (error: any) {
        res.status(500).send(error.message.toString());
    }
});

export const getUserLabels = functions.https.onRequest(async (req, res) => {
    try {
        const response = await axios.get(`${api}/users/${req.params.uid}/labels`);
        res.json(response.data);
    } catch (error: any) {
        res.status(500).send(error.message.toString());
    }
});

export const getUserListLabels = functions.https.onRequest(async (req, res) => {
    try {
        const response = await axios.get(`${api}/users/${req.params.uid}/lists/${req.params.listId}/labels`);
        res.json(response.data);
    } catch (error: any) {
        res.status(500).send(error.message.toString());
    }
});

export const postUserListLabel = functions.https.onRequest(async (req, res) => {
    try {
        const response = await axios.post(`${api}/users/${req.params.uid}/lists/${req.params.listId}/labels/${req.params.label}`);
        res.json(response.data);
    } catch (error: any) {
        res.status(500).send(error.message.toString());
    }
});

export const putUserListLabel = functions.https.onRequest(async (req, res) => {
    try {
        const response = await axios.put(`${api}/users/${req.params.uid}/lists/${req.params.listId}/labels`, req.body);
        res.json(response.data);
    } catch (error: any) {
        res.status(500).send(error.message.toString());
    }
});

export const removeUserListLabel = functions.https.onRequest(async (req, res) => {
    try {
        const response = await axios.delete(`${api}/users/${req.params.uid}/lists/${req.params.listId}/labels/${req.params.label}`);
        res.json(response.data);
    } catch (error: any) {
        res.status(500).send(error.message.toString());
    }
});
import * as functions from "firebase-functions";
import axios from 'axios';

export const getProducts = functions.https.onRequest(async (req, res) => {
    try {
        let request_url;
        request_url = (req.query.order === '') ?
            `${api}/products/all/?$filter=${req.query.id} eq ` +
            `${req.query.cat}${req.query.filter}&$page=${req.query.pag}&$pageSize=50` :
            `${api}/products/all/?$filter=${req.query.id} eq ${req.query.cat}` +
            `${req.query.filter}&$page=${req.query.pag}&${req.query.order}&$pageSize=50`;
        const response = await axios.get(request_url);
        res.json(response.data);
    } catch (error: any) {
        res.status(500).send(error.message.toString());
    }
});

export const searchProducts = functions.https.onRequest(async (req, res) => {
    try {
        let request_url;
        request_url = (req.query.category !== undefined
            && req.query.category !== '0') ?
            `${api}/products/SearchResults?` +
            `category=${req.query.category}&$page=1&$pageSize=10&` +
            `search=${req.query.search}` :
            `${api}/products/search?type=${req.query.type}&$page=1` +
            `&$pageSize=10&search=${req.query.search}`;
        const response = await axios.get(request_url);
        res.json(response.data);
    } catch (error: any) {
        res.status(500).send(error.message.toString());
    }
});

export const getSidebarFilters = functions.https.onRequest(async (req, res) => {
    try {
        const response = await axios.get(`${api}/products/sidebarFilters?$filter=${req.query.id} eq ${req.query.cat}`);
        res.json(response.data);
    } catch (error: any) {
        res.status(500).send(error.message.toString());
    }
});

export const getProduct = functions.https.onRequest(async (req, res) => {
    try {
        const response = await axios.get(`${api}/product/${req.params.upc}`);
        res.json(response.data);
    } catch (error: any) {
        res.status(500).send(error.message.toString());
    }
});

export const getProductDetails = functions.https.onRequest(async (req, res) => {
    try {
        const response = await axios.get(`${api}/products/${req.params.productId}/details`);
        res.json(response.data);
    } catch (error: any) {
        res.status(500).send(error.message.toString());
    }
});

export const getProductImages = functions.https.onRequest(async (req, res) => {
    try {
        const response = await axios.get(`${api}/products/${req.params.productId}/images`);
        res.json(response.data);
    } catch (error: any) {
        res.status(500).send(error.message.toString());
    }
});

export const getProductNutrition = functions.https.onRequest(async (req, res) => {
    try {
        const response = await axios.get(`${api}/products/${req.params.productId}/nutrition`);
        res.json(response.data);
    } catch (error: any) {
        res.status(500).send(error.message.toString());
    }
});

export const getProductVendors = functions.https.onRequest(async (req, res) => {
    try {
        const response = await axios.get(`${api}/products/${req.params.productId}/vendors`);
        res.json(response.data);
    } catch (error: any) {
        res.status(500).send(error.message.toString());
    }
});

export const getProductOverview = functions.https.onRequest(async (req, res) => {
    try {
        const response = await axios.get(`${api}/products/${req.params.productId}/overview`);
        res.json(response.data);
    } catch (error: any) {
        res.status(500).send(error.message.toString());
    }
});

export const getProductHistory = functions.https.onRequest(async (req, res) => {
    try {
        const response = await axios.get(`${api}/products/${req.params.productId}/price-history?$timeframe=${req.params.time}`);
        res.json(response.data);
    } catch (error: any) {
        res.status(500).send(error.message.toString());
    }
});

export const postFeedback = functions.https.onRequest(async (req, res) => {
    try {
        const response = await axios.post(`${api}/feedback/`, req.body.obj);
        res.json(response.data);
    } catch (error: any) {
        res.status(500).send(error.message.toString());
    }
});

export const postProductTransaction = functions.https.onRequest(async (req, res) => {
    try {
        const response = await axios.post(`${api}/transactions/`, req.body);
        res.json(response.data);
    } catch (error: any) {
        res.status(500).send(error.message.toString());
    }
});
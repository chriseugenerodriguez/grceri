import * as functions from "firebase-functions";
import axios from 'axios';

export const getMostWatchedLists = functions.https.onRequest(async (req, res) => {
    try {
        const response = await axios.get(`${api}/lists/products/most-watched`);
        res.json(response.data);
    } catch (error: any) {
        res.status(500).send(error.message.toString());
    }
});

export const getMostWatchedListsID = functions.https.onRequest(async (req, res) => {
    try {
        const response = await axios.get(`${api}/lists/products/most-watched/?productId=${req.params.productId}`);
        res.json(response.data);
    } catch (error: any) {
        res.status(500).send(error.message.toString());
    }
});

export const getMostViewedProducts = functions.https.onRequest(async (req, res) => {
    try {
        const response = await axios.get(`${api}/lists/products/most-viewed`);
        res.json(response.data);
    } catch (error: any) {
        res.status(500).send(error.message.toString());
    }
});

export const getMostViewedProductsID = functions.https.onRequest(async (req, res) => {
    try {
        const response = await axios.get(`${api}/lists/products/most-viewed/?productId=${req.params.productId}`);
        res.json(response.data);
    } catch (error: any) {
        res.status(500).send(error.message.toString());
    }
});

export const getMostFollowedLists = functions.https.onRequest(async (req, res) => {
    try {
        const response = await axios.get(`${api}/lists/most-followed`);
        res.json(response.data);
    } catch (error: any) {
        res.status(500).send(error.message.toString());
    }
});
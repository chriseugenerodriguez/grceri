import * as functions from "firebase-functions";

import axios from 'axios';

export const getCategories = functions.https.onRequest(async (req, res) => {
    try {
        const response = await axios.get(`${api}/categories`);
        res.json(response.data);
    } catch (error: any) {
        res.status(500).send(error.message.toString());
    }
});

export const search = functions.https.onRequest(async (req, res) => {
    try {
        const response = await axios.get(`${searchAPI}/${req.params.value}`);
        res.json(response.data);
    } catch (error: any) {
        res.status(500).send(error.message.toString());
    }
});

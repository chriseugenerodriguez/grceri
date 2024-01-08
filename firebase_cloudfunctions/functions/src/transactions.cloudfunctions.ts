import * as functions from "firebase-functions";
import axios from 'axios';

export const getTransactions = functions.https.onRequest(async (req, res) => {
    try {
        const response = await axios.get(`${api}/user/${req.params.uid}/transactions`);
        res.json(response.data);
    } catch (error: any) {
        res.status(500).send(error.message.toString());
    }
});

export const postTransaction = functions.https.onRequest(async (req, res) => {
    try {
        const response = await axios.post(`${api}/user/${req.params.uid}/transactions`, req.body.obj);
        res.json(response.data);
    } catch (error: any) {
        res.status(500).send(error.message.toString());
    }
});

export const getTransaction = functions.https.onRequest(async (req, res) => {
    try {
        const response = await axios.get(`${api}/user/${req.params.uid}/transactions/${req.params.tid}`);
        res.json(response.data);
    } catch (error: any) {
        res.status(500).send(error.message.toString());
    }
});

export const updateTransaction = functions.https.onRequest(async (req, res) => {
    try {
        const response = await axios.put(`${api}/user/${req.params.uid}/transactions/${req.params.tid}`, req.body.obj);
        res.json(response.data);
    } catch (error: any) {
        res.status(500).send(error.message.toString());
    }
});

export const getPricingPlans = functions.https.onRequest(async (req, res) => {
    try {
        const response = await axios.get(`${api}/transactions/pricing-plans`);
        res.json(response.data);
    } catch (error: any) {
        res.status(500).send(error.message.toString());
    }
});

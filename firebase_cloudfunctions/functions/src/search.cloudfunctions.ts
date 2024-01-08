import * as functions from "firebase-functions";
import axios from 'axios';

export const getSearchPageSidebar = functions.https.onRequest(async (req, res) => {
    try {
        const response = await axios.get(`${api}/products/searchSidebar/?category=${req.query.id}&search=${req.query.text}`);
        res.json(response.data);
    } catch (error: any) {
        res.status(500).send(error.message.toString());
    }
});

export const getSearchPageContent = functions.https.onRequest(async (req, res) => {
    try {
        let request_url = '';

        if (req.query.filter === '') {
            request_url = `${api}/products/SearchResults/?category=${req.query.id}&search=${req.query.text}&$page=${req.query.page}&$pageSize=50`;
        } else {
            request_url = `${api}/products/SearchResults/?category=${req.query.id}&search=${req.query.text}&$filter=${req.query.filter}&$page=${req.query.page}&$pageSize=50`;
        }

        if (req.query.order !== '') {
            request_url = `${request_url}&${req.query.order}`;
        }
        const response = await axios.get(request_url);
        res.json(response.data);
    } catch (error: any) {
        res.status(500).send(error.message.toString());
    }
});

export const searchUrlExists = functions.https.onRequest(async (req, res) => {
    try {
        const response = await axios.post(`${api}/url/exists`, req.body);
        res.json(response.data);
    } catch (error: any) {
        res.status(500).send(error.message.toString());
    }
});
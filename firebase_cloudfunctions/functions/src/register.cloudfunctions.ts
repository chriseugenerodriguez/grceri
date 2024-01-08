import * as functions from "firebase-functions";


import axios from 'axios';

export const registerPhoneNumber = functions.https.onRequest(async (req, res) => {
    try {

        const response = await axios.post(`${api}/register/${req.params.phone}`);
        res.json(response.data);
    } catch (error: any) {
        res.status(500).send(error.message.toString());
    }
});
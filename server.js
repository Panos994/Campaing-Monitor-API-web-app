const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

const apiKey = process.env.CM_API_KEY;
const clientId = process.env.CM_CLIENT_ID;
let listId = process.env.CM_LIST_ID;
const baseUrl = `https://api.createsend.com/api/v3.3`;

// Function for getting the authorization header
const getAuthHeader = () => {
    const token = Buffer.from(`${apiKey}:`).toString('base64');
    const authHeader = `Basic ${token}`;
    return authHeader;
};

app.use(async (req, res, next) => {
    try {
        await fetchListId();
        next();
    } catch (error) {
        console.error('Error fetching list details:', error);
        res.status(500).json({ error: 'Error fetching list details' });
    }
});

const fetchListId = async () => {
    if (!listId) {
        try {
            const response = await axios.get(`${baseUrl}/clients/${clientId}/lists.json`, {
                headers: { 'Authorization': getAuthHeader() }
            });
            if (response.data && response.data.length > 0) {
                listId = response.data[0].ListID;
                console.log('Fetched List ID:', listId);
            } else {
                throw new Error('No lists found for the client');
            }
        } catch (error) {
            console.error('Error fetching list details:', error);
            throw error;
        }
    }
};

app.get('/api/subscribers', async (req, res) => {
    try {
        const subscribers = await fetchAllSubscribers();
        res.json(subscribers);
    } catch (error) {
        console.error('Error fetching subscribers:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Error fetching subscribers' });
    }
});

const fetchAllSubscribers = async () => {
    try {
        const response = await axios.get(`${baseUrl}/lists/${listId}/active.json`, {
            headers: { 'Authorization': getAuthHeader() }
        });
        return response.data.Results; // Adjust this based on the actual response structure
    } catch (error) {
        console.error('Error fetching all subscribers:', error.response ? error.response.data : error.message);
        throw error;
    }
};

// Add subscriber
app.post('/api/subscribers', async (req, res) => {
    const { email, name, consent } = req.body;
    try {
        const response = await axios.post(`${baseUrl}/subscribers/${listId}.json`, {
            EmailAddress: email,
            Name: name,
            Resubscribe: true,
            ConsentToTrack: consent
        }, {
            headers: { 'Authorization': getAuthHeader() }
        });
        console.log('Subscriber added:', response.data);
        res.json({ success: true, data: response.data });
    } catch (error) {
        console.error('Error adding subscriber:', error.response ? error.response.data : error.message);
        res.status(500).json({ success: false, error: error.response ? error.response.data : error.message });
    }
});

// Remove subscriber
app.delete('/api/subscribers', async (req, res) => {
    const { email } = req.body;

    if (!email || !isValidEmail(email)) {
        return res.status(400).json({ success: false, error: 'Invalid email address' });
    }

    try {
        const response = await axios.delete(`${baseUrl}/subscribers/${listId}.json`, {
            params: { email },
            headers: { 'Authorization': getAuthHeader() }
        });
        console.log('Subscriber removed:', response.data);
        res.json({ success: true, data: response.data });
    } catch (error) {
        console.error('Error removing subscriber:', error.response ? error.response.data : error.message);
        res.status(500).json({ success: false, error: error.response ? error.response.data : error.message });
    }
});

const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

app.listen(port, async () => {
    console.log(`Server running on http://localhost:${port}`);
    try {
        await fetchListId(); // Fetch list details once server starts
    } catch (error) {
        console.error('Error fetching list details:', error);
    }
});

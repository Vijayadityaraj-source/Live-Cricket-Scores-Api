const express = require('express');
const axios = require('axios');
const xml2js = require('xml2js');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 8800;

// Use environment variables for configuration
const CRICINFO_URL = process.env.CRICINFO_URL || 'https://static.cricinfo.com/rss/livescores.xml';

// Configure CORS
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

app.get('/api/livescores', async (req, res) => {
    try {
        const response = await axios.get(CRICINFO_URL);
        const parser = new xml2js.Parser({ explicitArray: false, mergeAttrs: true });
        
        parser.parseString(response.data, (err, result) => {
            if (err) {
                throw new Error('Failed to parse XML');
            }
            const matches = result.rss.channel.item;
            res.json(matches);
        });
    } catch (error) {
        console.error('Error fetching live scores:', error);
        res.status(500).json({ error: 'Failed to fetch live scores' });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

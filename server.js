const express = require('express');
const axios = require('axios');
const xml2js = require('xml2js');
const cors = require('cors');

const app = express();
const port = 8800;

app.use(cors());

app.get('/api/livescores', async (req, res) => {
    try {
        const response = await axios.get('https://static.cricinfo.com/rss/livescores.xml');
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

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
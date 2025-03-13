require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5001;
const BASE_URL = 'http://rest.nbaapi.com/api';

app.use(cors());
app.use(express.json());

app.get('/player/:name', async (req, res) => {
    try {
        const playerName = req.params.name;
        const playerUrl = `${BASE_URL}/PlayerDataTotals/name/${encodeURIComponent(playerName)}`;
        
        const response = await axios.get(playerUrl);
        if (!response.data || response.data.length === 0) {
            return res.status(404).json({ error: 'Player not found' });
        }

        // Sort by season to get the latest stats
        const sortedStats = response.data.sort((a, b) => b.season - a.season);
        const latestSeason = sortedStats[0];

        res.json(latestSeason);
    } catch (error) {
        console.error('Error fetching player data:', error);
        res.status(500).json({ error: 'Failed to fetch player data' });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Add this line

const app = express();

const corsOptions = {
  origin: 'https://hodlinfodemo.netlify.app', 
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
}; 

mongoose.connect(process.env.DB_URL).then(() => console.log("db connected"));

const tickerSchema = new mongoose.Schema({
  name: String,
  last: Number,
  buy: Number,
  sell: Number,
  volume: Number,
  base_unit: String
});

const Ticker = mongoose.model('Ticker', tickerSchema);

async function fetchAndStoreData() {
  try {
    const response = await fetch('https://api.wazirx.com/api/v2/tickers');
    const data = await response.json();

    const top10 = Object.values(data).slice(0, 10);
    await Ticker.deleteMany({});
    await Ticker.insertMany(top10);

    console.log('Data updated successfully');
  } catch (error) {
    console.error('Error fetching or storing data:', error);
  }
}

app.get('/api/tickers', async (req, res) => {
  try {
    const tickers = await Ticker.find().limit(10);
    res.json(tickers);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving data' });
  }
});

app.use(express.static('public'));
let port = process.env.port || 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  fetchAndStoreData();
  setInterval(fetchAndStoreData, 5 * 60 * 1000);
});

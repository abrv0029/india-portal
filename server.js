require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
app.use(express.static('public'));

const WEATHER_KEY = process.env.WEATHER_API_KEY;
const NEWS_KEY = process.env.NEWS_API_KEY;
const WAQI_TOKEN = process.env.WAQI_TOKEN;

app.get('/api/weather', async (req, res) => {
  try {
    const city = req.query.city || 'Jaipur';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_KEY}&units=metric`;
    const response = await axios.get(url);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'Weather failed' });
  }
});

app.get('/api/aqi', async (req, res) => {
  try {
    const city = req.query.city || 'Jaipur';
    const coords = {
      'Jaipur':      { lat: 26.91, lng: 75.79 },
      'Jodhpur':     { lat: 26.29, lng: 73.01 },
      'Udaipur':     { lat: 24.58, lng: 73.68 },
      'Kota':        { lat: 25.18, lng: 75.84 },
      'Ajmer':       { lat: 26.45, lng: 74.63 },
      'Bikaner':     { lat: 28.02, lng: 73.31 },
      'Alwar':       { lat: 27.55, lng: 76.62 },
      'Bharatpur':   { lat: 27.21, lng: 77.49 },
      'Barmer':      { lat: 25.74, lng: 71.38 },
      'Sikar':       { lat: 27.61, lng: 75.14 },
      'Lucknow':     { lat: 26.85, lng: 80.95 },
      'Kanpur':      { lat: 26.46, lng: 80.33 },
      'Agra':        { lat: 27.18, lng: 78.01 },
      'Varanasi':    { lat: 25.32, lng: 83.01 },
      'Prayagraj':   { lat: 25.43, lng: 81.84 },
      'Meerut':      { lat: 28.98, lng: 77.71 },
      'Noida':       { lat: 28.54, lng: 77.39 },
      'Ghaziabad':   { lat: 28.67, lng: 77.45 },
      'Ahmedabad':   { lat: 23.03, lng: 72.58 },
      'Surat':       { lat: 21.17, lng: 72.83 },
      'Vadodara':    { lat: 22.31, lng: 73.18 },
      'Rajkot':      { lat: 22.30, lng: 70.80 },
      'Gandhinagar': { lat: 23.22, lng: 72.65 },
      'Bhavnagar':   { lat: 21.76, lng: 72.15 },
      'Jamnagar':    { lat: 22.47, lng: 70.07 },
      'Mumbai':      { lat: 19.08, lng: 72.88 },
      'Pune':        { lat: 18.52, lng: 73.86 },
      'Nagpur':      { lat: 21.15, lng: 79.09 },
      'Nashik':      { lat: 19.99, lng: 73.79 },
      'Aurangabad':  { lat: 19.88, lng: 75.34 },
      'Solapur':     { lat: 17.69, lng: 75.91 },
      'Kolhapur':    { lat: 16.70, lng: 74.24 }
    };
    const c = coords[city];
    if (!c) return res.json({ aqi: null });
    const url = `https://api.waqi.info/feed/geo:${c.lat};${c.lng}/?token=${WAQI_TOKEN}`;
    const response = await axios.get(url);
    const result = response.data;
    if (result.status !== 'ok') return res.json({ aqi: null });
    res.json({ aqi: result.data.aqi, station: result.data.city.name });
  } catch (err) {
    res.status(500).json({ error: 'AQI failed' });
  }
});

app.get('/api/news', async (req, res) => {
  try {
    const city = req.query.city || 'Rajasthan';
    const state = req.query.state || '';
    const url = `https://newsapi.org/v2/everything?q=${city}+${state}&language=en&sortBy=publishedAt&apiKey=${NEWS_KEY}`;
    const response = await axios.get(url);
    res.json(response.data);
  } catch (err) {
    console.error('NEWS ERROR:', err.response?.data || err.message);
    res.status(500).json({ error: 'News failed' });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const validStates = ['rajasthan', 'uttar-pradesh', 'gujarat', 'maharashtra'];
app.get('/:state', (req, res) => {
  const state = req.params.state;
  if (validStates.includes(state)) {
    res.sendFile(path.join(__dirname, 'public', `${state}.html`));
  } else {
    res.redirect('/');
  }
});

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
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
'Kolhapur':    { lat: 16.70, lng: 74.24 },
      // Extra Rajasthan
'Jhunjhunu':      { lat: 28.13, lng: 75.40 },
'Nagaur':         { lat: 27.20, lng: 73.73 },
'Pali':           { lat: 25.77, lng: 73.32 },
'Tonk':           { lat: 26.17, lng: 75.79 },
'Sawai Madhopur': { lat: 26.02, lng: 76.35 },
'Dausa':          { lat: 26.89, lng: 76.33 },
'Dholpur':        { lat: 26.70, lng: 77.89 },
'Bundi':          { lat: 25.44, lng: 75.64 },
'Chittorgarh':    { lat: 24.89, lng: 74.62 },
'Rajsamand':      { lat: 25.07, lng: 73.88 },
'Bhilwara':       { lat: 25.35, lng: 74.63 },
'Dungarpur':      { lat: 23.84, lng: 73.71 },
'Banswara':       { lat: 23.55, lng: 74.44 },
'Sirohi':         { lat: 24.88, lng: 72.86 },
'Jalore':         { lat: 25.35, lng: 72.62 },
'Hanumangarh':    { lat: 29.58, lng: 74.33 },
'Ganganagar':     { lat: 29.92, lng: 73.88 },
'Churu':          { lat: 28.30, lng: 74.96 },
'Jhalawar':       { lat: 24.60, lng: 76.17 },
'Baran':          { lat: 25.10, lng: 76.51 },
'Karauli':        { lat: 26.50, lng: 77.02 },
'Pratapgarh':     { lat: 24.03, lng: 74.78 },
// Extra UP
'Bareilly':       { lat: 28.36, lng: 79.41 },
'Aligarh':        { lat: 27.88, lng: 78.08 },
'Moradabad':      { lat: 28.84, lng: 78.77 },
'Gorakhpur':      { lat: 26.76, lng: 83.37 },
'Saharanpur':     { lat: 29.96, lng: 77.55 },
'Firozabad':      { lat: 27.15, lng: 78.39 },
'Jhansi':         { lat: 25.45, lng: 78.57 },
'Mathura':        { lat: 27.49, lng: 77.67 },
'Hapur':          { lat: 28.73, lng: 77.78 },
'Rampur':         { lat: 28.81, lng: 79.02 },
'Shahjahanpur':   { lat: 27.88, lng: 79.91 },
'Farrukhabad':    { lat: 27.39, lng: 79.58 },
'Ayodhya':        { lat: 26.79, lng: 82.20 },
'Hardoi':         { lat: 27.39, lng: 80.13 },
'Bulandshahr':    { lat: 28.40, lng: 77.85 },
'Sitapur':        { lat: 27.56, lng: 80.68 },
'Muzaffarnagar':  { lat: 29.47, lng: 77.70 },
// Extra Gujarat
'Junagadh':       { lat: 21.52, lng: 70.46 },
'Anand':          { lat: 22.56, lng: 72.95 },
'Navsari':        { lat: 20.95, lng: 72.92 },
'Mehsana':        { lat: 23.60, lng: 72.38 },
'Surendranagar':  { lat: 22.73, lng: 71.64 },
'Bharuch':        { lat: 21.70, lng: 72.99 },
'Amreli':         { lat: 21.60, lng: 71.22 },
'Porbandar':      { lat: 21.64, lng: 69.60 },
'Patan':          { lat: 23.84, lng: 72.12 },
'Valsad':         { lat: 20.59, lng: 72.92 },
'Dahod':          { lat: 22.83, lng: 74.25 },
'Kutch':          { lat: 23.73, lng: 69.86 },
'Banaskantha':    { lat: 24.17, lng: 72.43 },
// Extra Maharashtra
'Thane':          { lat: 19.22, lng: 72.97 },
'Amravati':       { lat: 20.93, lng: 77.75 },
'Nanded':         { lat: 19.15, lng: 77.32 },
'Sangli':         { lat: 16.86, lng: 74.57 },
'Malegaon':       { lat: 20.55, lng: 74.52 },
'Jalgaon':        { lat: 21.00, lng: 75.56 },
'Akola':          { lat: 20.71, lng: 77.00 },
'Latur':          { lat: 18.40, lng: 76.56 },
'Dhule':          { lat: 20.90, lng: 74.77 },
'Ahmednagar':     { lat: 19.09, lng: 74.74 },
'Chandrapur':     { lat: 19.95, lng: 79.30 },
'Parbhani':       { lat: 19.27, lng: 76.77 },
'Yavatmal':       { lat: 20.39, lng: 78.12 },
'Ratnagiri':      { lat: 16.99, lng: 73.30 },
'Satara':         { lat: 17.68, lng: 74.00 },
'Beed':           { lat: 18.99, lng: 75.76 },
'Osmanabad':      { lat: 18.18, lng: 76.04 },
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
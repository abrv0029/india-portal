let currentCity = 'Ahmedabad';

function changeDistrict() {
  currentCity = document.getElementById('districtSelect').value;

  // Update headings
  document.getElementById('weatherCity').innerText = currentCity;
  document.getElementById('aqiCity').innerText = currentCity;
  document.getElementById('newsCity').innerText = currentCity;

  // Show skeletons
  document.getElementById('weatherData').innerHTML = `
    <div class="skeleton tall"></div>
    <div class="skeleton short"></div>`;
  document.getElementById('aqiData').innerHTML = `
    <div class="skeleton tall"></div>
    <div class="skeleton short"></div>`;
  document.getElementById('newsData').innerHTML = `
    <div class="skeleton"></div>
    <div class="skeleton short"></div>
    <div class="skeleton"></div>
    <div class="skeleton short"></div>`;

  loadWeather();
  loadAQI();
  loadNews();
}

async function loadWeather() {
  try {
    const res = await fetch(`/api/weather?city=${currentCity}`);
    const d = await res.json();
    if (d.error || d.cod === '404') throw new Error();
    document.getElementById('weatherData').innerHTML = `
      <div class="big-number">${Math.round(d.main.temp)}°C</div>
      <div class="label">${d.weather[0].description}</div>
      <div class="weather-grid">
        <div class="weather-stat">
          <div class="wlabel">Feels Like</div>
          <div class="wvalue">${Math.round(d.main.feels_like)}°C</div>
        </div>
        <div class="weather-stat">
          <div class="wlabel">Humidity</div>
          <div class="wvalue">${d.main.humidity}%</div>
        </div>
        <div class="weather-stat">
          <div class="wlabel">Min</div>
          <div class="wvalue">${Math.round(d.main.temp_min)}°C</div>
        </div>
        <div class="weather-stat">
          <div class="wlabel">Max</div>
          <div class="wvalue">${Math.round(d.main.temp_max)}°C</div>
        </div>
      </div>`;
  } catch {
    document.getElementById('weatherData').innerHTML =
      `<div class="label">Weather key activating... try in 1 hour</div>`;
  }
}

async function loadAQI() {
  try {
    const res = await fetch(`/api/aqi?city=${currentCity}`);
    const d = await res.json();
    if (!d.aqi) {
      document.getElementById('aqiData').innerHTML =
        `<div class="label">No station near ${currentCity}</div>`;
      return;
    }
    const aqi = d.aqi;
    let colorClass = aqi <= 50 ? 'aqi-good' :
                     aqi <= 100 ? 'aqi-moderate' :
                     aqi <= 150 ? 'aqi-unhealthy' : 'aqi-hazardous';
    let status = aqi <= 50 ? 'Good' :
                 aqi <= 100 ? 'Moderate' :
                 aqi <= 150 ? 'Unhealthy' : 'Hazardous';
    document.getElementById('aqiData').innerHTML = `
      <div class="big-number ${colorClass}">${aqi}</div>
      <div class="label ${colorClass}">${status}</div>
      <div class="sub">Station: ${d.station || currentCity}</div>`;
  } catch {
    document.getElementById('aqiData').innerHTML =
      `<div class="label">Failed to load AQI</div>`;
  }
}

async function loadNews() {
  try {
    const res = await fetch(`/api/news?city=${currentCity}`);
    const d = await res.json();
    if (!d.articles || d.articles.length === 0) {
      document.getElementById('newsData').innerHTML =
        `<div class="label">No news found for ${currentCity}</div>`;
      return;
    }
    document.getElementById('newsData').innerHTML = d.articles.slice(0, 6).map(a => `
      <div class="news-item">
        <a href="${a.url}" target="_blank">${a.title}</a>
        <p>${a.description || ''}</p>
      </div>`).join('');
  } catch {
    document.getElementById('newsData').innerHTML =
      `<div class="label">Failed to load news</div>`;
  }
}

// Load on start
loadWeather();
loadAQI();
loadNews();
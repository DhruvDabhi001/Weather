const apiKey = '82b39f2d9f26bfc3c52136a9b8d1613d'; // Replace with your actual OpenWeatherMap API key

const cityInput = document.getElementById('cityInput');
const getWeatherBtn = document.getElementById('getWeatherBtn');
const useLocationBtn = document.getElementById('useLocationBtn');
const weatherResult = document.getElementById('weatherResult');
const loader = document.getElementById('loader');
const toggleDarkBtn = document.getElementById('toggleDark');

// DARK MODE TOGGLE
toggleDarkBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark');

    const isDark = document.body.classList.contains('dark');
    
    // Toggle body background
    document.body.classList.toggle('bg-light', !isDark);
    document.body.classList.toggle('bg-dark', isDark);
    document.body.classList.toggle('text-light', isDark);
    document.body.classList.toggle('text-dark', !isDark);

    // Toggle button text
    toggleDarkBtn.textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
});

getWeatherBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city === '') {
        showError('Please enter a city name.');
        return;
    }
    getWeatherByCity(city);
});

useLocationBtn.addEventListener('click', () => {
    console.log("Use My Location clicked");
    if (navigator.geolocation) {
        loader.style.display = 'block';
        navigator.geolocation.getCurrentPosition(position => {
            console.log("Position fetched:", position);
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            getWeatherByCoords(lat, lon);
        }, (error) => {
            console.error("Geolocation error:", error);
            showError('Location access denied.');
        });
    } else {
        showError('Geolocation is not supported by this browser.');
    }
});


function getWeatherByCity(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    fetchWeather(url);
}

function getWeatherByCoords(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    fetchWeather(url);
}
function fetchWeather(url) {
    loader.style.display = 'block';
    weatherResult.innerHTML = '';

    fetch(url)
        .then(response => response.json())
        .then(data => {
            loader.style.display = 'none';
            if (data.cod !== 200) {
                showError(data.message);
                return;
            }

            const temp = data.main.temp;
            const description = data.weather[0].description;
            const humidity = data.main.humidity;
            const windSpeed = data.wind.speed;
            const iconCode = data.weather[0].icon;
            const iconUrl = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;

            weatherResult.innerHTML = `
        <div class="card p-4 fade-in mx-auto" style="max-width: 400px;">
          <h2 class="card-title">${data.name}</h2>
          <img src="${iconUrl}" class="weather-icon" alt="Weather icon" />
          <p><strong>Temperature:</strong> ${temp} °C</p>
          <p><strong>Description:</strong> ${description}</p>
          <p><strong>Humidity:</strong> ${humidity}%</p>
          <p><strong>Wind Speed:</strong> ${windSpeed} m/s</p>
        </div>
      `;
        })
        .catch(error => {
            loader.style.display = 'none';
            showError('Error fetching weather data.');
            console.error(error);
        });
}

function showError(message) {
    weatherResult.innerHTML = `<div class="alert alert-danger fade-in">${message}</div>`;
    loader.style.display = 'none';
}
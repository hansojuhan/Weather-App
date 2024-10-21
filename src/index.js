import "./styles.css";

// Gets weather data for a location
async function getLocationWeatherData(location) {

  // Make call and await fetch
  const API_KEY = '4R4G4DX4KUZYPNVRYS5Z8KMY7';
  const link = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=metric&include=days&key=${API_KEY}&contentType=json`;

  try {
    let response = await fetch(link);
    let weatherData = await response.json();
    return weatherData;

  } catch (error) {
    console.log("Failed to fetch due to error:", error);
    alert("Failed to fetch");
    return null;
  }
}

// Processes raw weather data and outputs info to be used in the app
function processWeatherData(data) {
  let processedData = {};

  // Location info
  processedData.city = data.address;
  processedData.address = data.resolvedAddress;

  // Current weather
  processedData.currentWeather = {};
  processedData.currentWeather.currentDate = data.days[0].datetime;
  processedData.currentWeather.icon = data.days[0].icon;
  processedData.currentWeather.description = data.days[0].description;
  processedData.currentWeather.temperature = data.days[0].temp;
  processedData.currentWeather.temperatureMax = data.days[0].tempmax;
  processedData.currentWeather.temperatureMin = data.days[0].tempmin;
  processedData.currentWeather.windSpeed = data.days[0].windspeed;
  processedData.currentWeather.humidity = data.days[0].humidity;

  // Get forecast for the next 7 days
  processedData.forecast = []
  for (let i = 1; i < 8; i++) {
    processedData.forecast.push(processDayFromWeatherData(data, i));
  }

  console.log(processedData);

  return processedData;
}

// Processes from the weather data information for a specific day and returns it
function processDayFromWeatherData(weatherData, forecastDay) {
  let result = {};
  
  result.date = weatherData.days[forecastDay].datetime;
  result.description = weatherData.days[forecastDay].description;
  result.temperature = weatherData.days[forecastDay].temp;
  result.temperatureMax = weatherData.days[forecastDay].tempmax;
  result.temperatureMin = weatherData.days[forecastDay].tempmin;
  result.windSpeed = weatherData.days[forecastDay].windspeed;
  result.humidity = weatherData.days[forecastDay].humidity;

  return result;
}

// Display results on page
function renderWeatherData(data) {
  // Find container
  const container = document.getElementById('results');

  const todayContainer = document.createElement('div');
  todayContainer.id = 'weather-today-container';
  container.append(todayContainer);

  // Main location info
  const city = document.createElement('p');
  city.innerText = data.city;
  const address = document.createElement('p');
  address.innerText = data.address;
  const date = document.createElement('p');
  date.innerText = data.currentWeather.currentDate;

  // Today's weather
  const temperature = document.createElement('p');
  temperature.innerText = data.currentWeather.temperature;

  const tempMin = document.createElement('p');
  tempMin.innerText = data.currentWeather.temperatureMin;

  const tempMax = document.createElement('p');
  tempMax.innerText = data.currentWeather.temperatureMax;

  const description = document.createElement('p');
  description.innerText = data.currentWeather.description;

  const wind = document.createElement('p');
  wind.innerText = data.currentWeather.windSpeed;

  const humidity = document.createElement('p');
  humidity.innerText = data.currentWeather.humidity;

  todayContainer.append(city, address, date, temperature, tempMin, tempMax, description, wind, humidity);
}

// On page load
window.onload = function() {

  const weatherFromButton = document.getElementById('weather-data-form-submit');

  weatherFromButton.addEventListener('click', () => {

    // Get location input
    const locationInput = document.getElementById('location-input').value;

    getLocationWeatherData(locationInput) // Get weather data
    .then((data) => { // Once ready, move on to processing the data
      if (data) {
        const processedData = processWeatherData(data);
        renderWeatherData(processedData);
      }
    })
    .catch((error) => {
      alert('Error fetching weather data:', error);
    });

  });
}



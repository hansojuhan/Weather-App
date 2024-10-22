import "./styles.css";
import githubIconSvg from './img/github-96.svg';

// Gets weather data for a location
async function getLocationWeatherData(location) {

  // Make call and await fetch
  const API_KEY = '4R4G4DX4KUZYPNVRYS5Z8KMY7';
  const link = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=metric&include=days&key=${API_KEY}&contentType=json`;

  try {
    // Set spinner
    setButtonSpinner(true);

    let response = await fetch(link);
    let weatherData = await response.json();
    return weatherData;

  } catch (error) {
    // Reset spinner
    setButtonSpinner(false);

    console.log("This location does not exist!");
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
  processedData.currentWeather.currentDate = new Date(data.days[0].datetime);
  processedData.currentWeather.icon = data.days[0].icon;
  processedData.currentWeather.description = data.days[0].conditions;
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

function setButtonSpinner(setSpinner){
  const spinnerMarkup = '<div class="lds-ring"><div></div><div></div><div></div><div></div></div>';

  // Get button
  const searchButton = document.getElementById('weather-data-form-submit');

  if (setSpinner) {
    searchButton.innerText = '';
    searchButton.innerHTML = spinnerMarkup;
  } else {
    searchButton.innerHTML = ''; 
    searchButton.innerText = 'Search';
  }
}

// Processes from the weather data information for a specific day and returns it
function processDayFromWeatherData(weatherData, forecastDay) {
  let result = {};
  
  result.date = new Date(weatherData.days[forecastDay].datetime);
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

  container.innerHTML = '';

  const todayContainer = document.createElement('div');
  todayContainer.classList.add('weather-today-container');
  container.append(todayContainer);

  const iconAddressContainer = document.createElement('div');
  iconAddressContainer.classList.add('icon-address-container');

  const mainInfoContainer = document.createElement('div');
  mainInfoContainer.classList.add('main-info');

  const addressContainer = document.createElement('div');
  addressContainer.classList.add('address-container');

  // Main location info
  const city = document.createElement('p');
  city.innerText = data.address;
  city.classList.add('city');
  const date = document.createElement('p');
  date.innerText = formatDate(data.currentWeather.currentDate);

  addressContainer.append(city, date);

  // Today's weather
  const tempContainer = document.createElement('div');
  tempContainer.classList.add('temp-container');

  const tempInfoContainer = document.createElement('div');
  tempInfoContainer.classList.add('temperature');

  const temperature = document.createElement('h2');
  temperature.innerText = `${data.currentWeather.temperature} °`;

  const description = document.createElement('p');
  description.innerText = `${data.currentWeather.description}.`;

  tempInfoContainer.append(temperature, description);

  const tempIconContainer = document.createElement('div');
  tempIconContainer.classList.add('icon-container');

  // Icon
  const icon = document.createElement('img');
  icon.src = require(`./img/${data.currentWeather.icon}.svg`);
  tempIconContainer.append(icon);

  tempContainer.append(tempIconContainer, tempInfoContainer);

  iconAddressContainer.append(tempIconContainer, addressContainer);
  mainInfoContainer.append(iconAddressContainer, tempInfoContainer);

  // More info
  const moreInfoContainer = document.createElement('div');
  moreInfoContainer.classList.add('more-info');

  const moreInfoTable = document.createElement('table');
  const moreInfoTableBody = document.createElement('tbody');


  const tempMin = document.createElement('tr');
  tempMin.innerHTML = `<td>Min temp:</td><td>${data.currentWeather.temperatureMin} °</td>`;

  const tempMax = document.createElement('tr');
  tempMax.innerHTML = `<td>Max temp:</td><td>${data.currentWeather.temperatureMax} °</td>`;

  const wind = document.createElement('tr');
  wind.innerHTML = `<td>Wind speed:</td><td>${data.currentWeather.windSpeed} km/h</td>`;

  const humidity = document.createElement('tr');
  humidity.innerHTML = `<td>Humidity:</td><td>${data.currentWeather.humidity} %</td>`;

  moreInfoTableBody.append(tempMin, tempMax, wind, humidity);
  moreInfoTable.append(moreInfoTableBody);

  moreInfoContainer.append(moreInfoTable);

  todayContainer.append(mainInfoContainer, moreInfoContainer);
}

// Helper method to capitalize a string
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Helper method to format the date
function formatDate(date) {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// On page load
window.onload = function() {
  const weatherFromButton = document.getElementById('weather-data-form-submit');
  
  // Listener for form submit click
  weatherFromButton.addEventListener('click', (event) => handleFormSubmit(event));
  
  // Listener for enter press
  const form = document.getElementById('get-weather-data-form');
  form.addEventListener('keydown', (event) => {
    if (event.key == 'Enter' ) {
      console.log("ENTER");
      
      event.preventDefault();
      handleFormSubmit(event);
    }
  });

  var formInput = document.getElementById('location-input');

  // Add event listener for focus on each input field
  formInput.addEventListener('focus', () => {
      // Add 'formTop' class to the corresponding label
      var formLabel = document.getElementById('location-input-label');
      if (formLabel) {
        formLabel.classList.add('form-top');
        formLabel.classList.add('form-top-color');
      }
    });

  // Add event listener for focusout on each input field
  formInput.addEventListener('focusout', () => {
    var formLabel = document.getElementById('location-input-label');
    
    // Remove 'formTop' class if input is empty
    if (formInput.value.length == 0) {
      formLabel.classList.remove('form-top');
    }

    if (formLabel) {
      formLabel.classList.remove('form-top-color');
    }
  });

  // Add who made and a github link
  const titleSection = document.getElementById('title-section');
  const subtitleContainer = document.createElement('a');
  subtitleContainer.id = 'subtitle';
  const subtitle = document.createElement('p');
  subtitle.innerText = 'Created by hje, oct 2024'

  const githubIcon = document.createElement('img');
  githubIcon.src = githubIconSvg;

  subtitleContainer.href = 'https://github.com/your-repo-url'; // Add the correct GitHub repo URL here
  subtitleContainer.target = '_blank'; // Opens link in a new tab
  subtitleContainer.rel = 'noopener noreferrer'; // Security best practices
  
  subtitleContainer.append(githubIcon, subtitle);
  titleSection.append(subtitleContainer);

  renderDefaultContent();
}

// Function that handles form submission
function handleFormSubmit(event) {
  // Prevent default
  event.preventDefault();

  // Validation
  const form = document.getElementById('get-weather-data-form');
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  // Get location input
  const locationInput = document.getElementById('location-input').value;

  getLocationWeatherData(locationInput) // Get weather data
  .then((data) => { // Once ready, move on to processing the data
    if (data) {
      const processedData = processWeatherData(data);
      renderWeatherData(processedData);

      // Reset button loading spinner
      setButtonSpinner(false);
    }
  })
  .catch((error) => {
    // Reset button loading spinner
    setButtonSpinner(false);

    alert('Error fetching weather data:', error);
  });
}

// Adds an image as default view in the content section
function renderDefaultContent() {

  // Get container
  const content = document.getElementById('content');
  
  // Clear existing content
  content.innerHTML = '';
  
  // Generate default content
  const defaultText = document.createElement('h3');
  defaultText.innerText = 'Search for a place to see what the weather is like'

  const defaultImage = document.createElement('img');
  defaultImage.src = require(`./img/showers-day.svg`);

  const defaultContainer = document.createElement('div');
  defaultContainer.id = 'default-content';

  defaultContainer.append(defaultImage, defaultText);
  content.append(defaultContainer);
}

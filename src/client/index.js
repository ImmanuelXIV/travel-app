import './styles/style.scss'
import { postData } from './js/app'
import { updateUI } from './js/app'
import { img } from '../../images/teaser.jpg'

export {
    postData,
    updateUI
};


// Add Event Listener
const gen = document.getElementById('generate');

// Make async GET request to the OpenWeatherMap API
gen.addEventListener('click', function() {
    let city = document.getElementById('city').value;
    let date = document.getElementById('date').value;

    Client.postData('http://localhost:9000/postGeoData', {city: city, date: date})
    .then(function(geoData) {
        geoData.date = date; 

        // Get current/future weather forecast from Weatherbit APIs
        Client.postData('http://localhost:9000/postWeatherData', geoData)
        .then(function(weatherData) {
            // Update UI
            updateUI("Temperature (celsius): ", "temp", weatherData.temp);
            updateUI("Cloud coverage (%): ", "clouds", weatherData.clouds);
            updateUI("Wind speed (m/s): ", "wind_spd", weatherData.wind_spd);
            updateUI("Wind direction (degrees): ", "wind_dir", weatherData.wind_dir);
            updateUI("Relative humidity (%): ", "rh", weatherData.rh);
            updateUI("Visibility (km): ", "vis", weatherData.vis);
            updateUI("Precip (mm/hr): ", "precip", weatherData.precip);
            updateUI("Snow (mm/hr): ", "snow", weatherData.snow);
        })
        // Get image of city 
        .then(function() {
            Client.postData('http://localhost:9000/postImageData', {city: city})
            .then(function(imgData) {
                updateUI("", "trip-image", imgData.imgUrl);
            });
        })
        // Get country info from REST Countries API
        .then(function() {
            Client.postData('http://localhost:9000/postCountryData', {countryName: geoData.countryName})
            .then(function(countryData) {
                updateUI("The city you've chosen lays in: ", "country", geoData.countryName);
                updateUI("It's located in the region: ", "subregion", countryData[0].subregion);
                updateUI("It has a population of: ", "population", countryData[0].population);
                updateUI("The capital is called: ", "capital", countryData[0].capital);
                updateUI("The language spoken there is: ", "language", countryData[0].languages[0].name);
            });
        });
    });
});
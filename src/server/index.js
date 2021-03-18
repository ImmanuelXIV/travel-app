// Setup empty JS object to act as endpoint for all routes
let projectData = {};

// Require Express, Body-Parser, and Cors to run server and routes
// For installation instructions see README.md
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fetch = require('node-fetch')
const dotenv = require('dotenv');

// get API key
dotenv.config();

// Start up an instance of app
const app = express();

// Middleware
// Configure express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
app.use(cors());

// Initialize the main project folder
app.use(express.static('./dist'));
app.use('/images', express.static('images')); 

// Setup Server
const port = 9000;
const server = app.listen(port, serverRunning);

// Export for testing (index.test.js)
module.exports = app;

function serverRunning() {
    console.log(`Server is running on localhost: ${port}`);
};

app.get('/', function(req, res) {
    res.sendFile('dist/index.html');
});

// GeoNames API
// Get city from client and make API request
app.post('/postGeoData', async function(req, res) {
    const city = req.body.city;
    let geoData = await fetch(`http://api.geonames.org/searchJSON?q=${city}&maxRows=1&username=${process.env.GEO_USER}`);
    
    try {
        geoData = await geoData.json();
        // only send lat, lng and countryName to reduce bandwith
        res.send({
            lat: geoData.geonames[0].lat,
            lng: geoData.geonames[0].lng,
            countryName: geoData.geonames[0].countryName
        });
    }
    catch(error) {
        console.log(`An error occurred during the GeoNames API request: ${error}`);
    }
})

// Weatherbit API
// Get weather data via API request
app.post('/postWeatherData', async function(req, res) {
    // check diff today vs date
    let dayDiff = getDateDiff(req.body.date);
    let url = '';
 
    if (dayDiff <= 7) {
        // If trip is within a week, get current weather forecast
        url = `https://api.weatherbit.io/v2.0/current?lat=${req.body.lat}&lon=${req.body.lng}&key=${process.env.WEATHERBIT_API_KEY}`;
        dayDiff = 0;
    }
    else {
        // Else get predicted forecast
        url = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${req.body.lat}&lon=${req.body.lng}&key=${process.env.WEATHERBIT_API_KEY}`;
    }

    let weatherData = await fetch(url);
    try {
        weatherData = await weatherData.json();
        res.send({
            temp: weatherData.data[dayDiff].temp,
            clouds: weatherData.data[dayDiff].clouds,
            wind_spd: weatherData.data[dayDiff].wind_spd,
            wind_dir: weatherData.data[dayDiff].wind_dir,
            rh: weatherData.data[dayDiff].rh,
            vis: weatherData.data[dayDiff].vis,
            precip: weatherData.data[dayDiff].precip,
            snow: weatherData.data[dayDiff].snow
        });
    }
    catch(error) {
        console.log(`An error occurred during the Weatherbit API request: ${error}`);
    }
})

function getDateDiff(date) {
    const clientDate = new Date(date);
    const today = new Date();
    const dayDiff = (clientDate.getTime() - today.getTime()) / ( 24 * 60 * 60 * 1000 );
    return Math.round(dayDiff);
};

// Pixabay API
// Get city from client and make API request to get image
app.post('/postImageData', async function(req, res) {
    let location = encodeURI(req.body.city);
    let imgData = await fetch(`https://pixabay.com/api/?key=${process.env.PIXABAY_API_KEY}&q=${location}&image_type=photo`);
    
    try {
        imgData = await imgData.json();
        res.send({
            imgUrl: imgData.hits[0].webformatURL
        });
    }
    catch(error) {
        console.log(`An error occurred during the Pixabay API request: ${error}`);
    }
});

// REST Countries API 
// Get country data from client and make API request to get country infos
app.post('/postCountryData', async function(req, res) {
    let country = encodeURI(req.body.countryName);
    const f1 = "capital", f2 = "subregion", f3 = "population", f4 = "languages";
    let countryData = await fetch(`https://restcountries.eu/rest/v2/name/${country}?fields=${f1};${f2};${f3};${f4}`);
    
    try {
        res.send(await countryData.json());
    }
    catch(error) {
        console.log(`An error occurred during the REST Countries API request: ${error}`);
    }
});

// Get request for testing purposes
app.get('/testing', async function(req, res) {
    res.json({ text: "correct" });
});
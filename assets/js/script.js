var today, lat, lon;
var apiKey = '318dd89627c7bbdd887f3385d00e0216';
var currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?limit=1&units=metric&appid=${apiKey}&`;

// UPDATE THE UI WITH THE CURRENT WEATHER
function updateCurrentWeatherUI(currData) {
    console.log(currData);

    // get date with current timezone
    today = moment().add(currData.timezone, 'seconds').format('DD/MM/YYYY');

    var currCity = currData.name + ' - ' + currData.sys.country;
    var currTemp = 'Temp: ' + Math.round(currData.main.temp) + ' \u2103';
    var currWind = 'Wind: ' + currData.wind.speed + ' KPH';
    var currHumidity = 'Humidity: ' + currData.main.humidity + '%';
    var currWeatherIcon = currData.weather[0].icon;

    var currentWeather = `
    <div class='currWeatherContainer'>
        <div class='d-flex flex-row'>
            <h2 id='currCity'>${currCity} (${today})</h2>
            <img class='currWeatherIcon' src=' http://openweathermap.org/img/wn/${currWeatherIcon}@2x.png' alt=''>
        </div>
        <h4 id='currTemp'>${currTemp}</h4>
        <h4 id='currWind'>${currWind}</h4>
        <h4 id='currHumidity'>${currHumidity}</h4>
    </div>`

    $('#today').html(currentWeather);
}

// GET CURRENT WEATHER DATA
function getCurrentWeatherData(cityName) {
    if (cityName) {
        $.get(`${currentWeatherUrl}q=${cityName}`)
            .then(function (currentData) {
                updateCurrentWeatherUI(currentData)
            });
    } else {
        alert('Please enter a city name.');
    }
}



$('#search-button').click(function (e) {
    e.preventDefault();
    // GET USER INPUT
    var city = $('#search-input').val();

    getCurrentWeatherData(city)



});
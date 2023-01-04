var apiKey = '318dd89627c7bbdd887f3385d00e0216';

var currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?limit=1&units=metric&appid=${apiKey}&`;
var fiveDaysForecastUrl = `https://api.openweathermap.org/data/2.5/forecast?units=metric&appid=${apiKey}&`;

var city = '';
var validCity = false;

var searchHistory = [];

// GET HISTORY DATA FROM LOCAL STORAGE TO DISPLAY SEARCHED CITIES
// Check if localStorage has searchHistory item. if not, create it.
if (!localStorage.getItem("searchHistory")) {
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
} else {
    searchHistory = JSON.parse(localStorage.getItem("searchHistory"));
    $.each(searchHistory, function (index, city) {
        var historyButton = `<button class="btn history-city-button">${city}</button>`
        $('#history').append(historyButton);
    });
}

// FUNCTION TO ADD CITY TO SEARCH HISTORY
function addCityToSearchHistory(city) {
    searchHistory = JSON.parse(localStorage.getItem("searchHistory"));
    if (city && !searchHistory.includes(city) && validCity) {
        searchHistory.push(city);
        localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
        var historyButton = `<button class="btn history-city-button">${city}</button>`
        $('#history').append(historyButton);
    }

    if (searchHistory.length > 0) {
        $('.delete-search-history').addClass('display-block');
    }
}

// FUNCTION TO UPDATE THE UI WITH FIVE DAYS WEATHER
function updatefiveDaysForecastUI(fiveDaysData) {
    console.log('fiveDaysData', fiveDaysData);

    $('.five-days-header').addClass('display-block');
    $('#forecast').html('');

    $.each(fiveDaysData.list, function (index, element) {
        var date = moment(element.dt_txt, 'YYYY-MM-DD hh:mm:ss').add(fiveDaysData.city.timezone, 'seconds').format('DD/MM/YYYY');
        var hour = moment(element.dt_txt, 'YYYY-MM-DD hh:mm:ss').add(fiveDaysData.city.timezone, 'seconds').format('ha');
        var fiveDaysIcon = `http://openweathermap.org/img/wn/${element.weather[0].icon}@2x.png`
        var fiveDaysTemp = 'Temp: ' + Math.round(element.main.temp) + ' \u2103';
        var fiveDaysWind = 'Wind: ' + element.wind.speed + ' KPH';
        var fiveDaysHumidity = 'Humidity: ' + element.main.humidity + '%';

        var fiveDaysForecast = `
        <div class="five-days-card">
            <h4 class="card-date">${date}</h4>
            <h5 class="card-date">${hour}</h5>
            <img src='${fiveDaysIcon}' alt="">
            <h5 class="card-weather">${fiveDaysTemp}</h5>
            <h5 class="card-weather">${fiveDaysWind}</h5>
            <h5 class="card-weather">${fiveDaysHumidity}</h5>
        </div>`
        $('#forecast').append(fiveDaysForecast);
    });


}

// FUNCTION TO GET 5-DAYS WEATHER DATA
function getfiveDaysForecastData(currentData) {
    if (currentData) {
        var lon = currentData.coord.lon;
        var lat = currentData.coord.lat;

        $.get(fiveDaysForecastUrl + `lat=${lat}&lon=${lon}`)
            .then(function (fiveDaysData) {
                updatefiveDaysForecastUI(fiveDaysData);
            })
    }
}



// FUNCTION TO UPDATE THE UI WITH THE CURRENT WEATHER
function updateCurrentWeatherUI(currData) {
    // console.log(currData);

    // reset #today content
    $('#today').html('');

    // get date with current timezone
    var today = moment().add(currData.timezone, 'seconds').format('DD/MM/YYYY');

    var currCity = currData.name;
    var currTemp = 'Temp: ' + Math.round(currData.main.temp) + ' \u2103';
    var currWind = 'Wind: ' + currData.wind.speed + ' KPH';
    var currHumidity = 'Humidity: ' + currData.main.humidity + '%';
    var currWeatherIcon = currData.weather[0].icon;

    var currentWeather = `
    <div class='currWeatherContainer'>
        <div class='d-flex flex-row'>
            <h2 id='currCity'>${currCity} (${today})</h2>
            <img class='currWeatherIcon' src='http://openweathermap.org/img/wn/${currWeatherIcon}@2x.png'>
        </div>
        <h4 id='currTemp'>${currTemp}</h4>
        <h4 id='currWind'>${currWind}</h4>
        <h4 id='currHumidity'>${currHumidity}</h4>
    </div>`

    $('#today').html(currentWeather);
}

// FUNCTION TO GET WEATHER DATA
function getWeatherData(city) {
    if (city) {
        $.get(`${currentWeatherUrl}q=${city}`)
            .then(function (currentData) {
                updateCurrentWeatherUI(currentData)
                getfiveDaysForecastData(currentData)
                // if get  valid responce will added to searched history
                validCity = true;
                addCityToSearchHistory(city)
            }).fail(function () {
                alert('Please enter a valid city name.');
            });;
    } else {
        alert('Please enter a city name.');
    }
}

// ON CLICK SEARCH BUTTON
$('#search-button').click(function (e) {
    e.preventDefault();
    // GET USER INPUT
    city = $('#search-input').val().toUpperCase();

    getWeatherData(city)
});


// ON CLICK HISTORY BUTTON
$('.history-city-button').click(function (e) {
    e.preventDefault();
    var city = $(this).html();

    console.log(city)
    getWeatherData(city)

});

// ON CLICK DELETE SEARCH HISTORY
$('.delete-search-history').click(function (e) {
    e.preventDefault();
    var searchHistory = [];
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    $('#history').html('');
    $(this).removeClass('.display-block');
});
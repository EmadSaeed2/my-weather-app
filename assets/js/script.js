var apiKey = '318dd89627c7bbdd887f3385d00e0216';

var currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?limit=1&units=metric&appid=${apiKey}&`;
var fiveDaysWeatherUrl = `https://api.openweathermap.org/data/2.5/forecast?units=metric&appid=${apiKey}&`;

// GET HISTORY DATA FROM LOCALSTORAGE
var searchHistory = [];

// function to display history data



// Check if localStorage has searchHistory item if not, create it.
if (!localStorage.getItem("searchHistory")) {
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
} else { // get data from localStorage
    searchHistory = JSON.parse(localStorage.getItem("searchHistory"));
    $.each(searchHistory, function (index, hCity) {
        var historyButton = `<button class="btn history-button">${hCity}</button>`
        $('#history').append(historyButton);
    });
}

// UPDATE THE UI WITH FIVE DAYS WEATHER
function updateFiveDaysWeatherUI(fiveDaysData) {
    console.log('fiveDaysData', fiveDaysData);

    $('.five-days-header').removeClass('display-none');
    $('.five-days-header').addClass('display-block');
    $('#forecast').html('');

    $.each(fiveDaysData.list, function (index, element) {
        var date = moment(element.dt_txt, 'YYYY-MM-DD hh:mm:ss').add(fiveDaysData.city.timezone, 'seconds').format('DD/MM/YYYY');
        var hour = moment(element.dt_txt, 'YYYY-MM-DD hh:mm:ss').add(fiveDaysData.city.timezone, 'seconds').format('ha');
        var fiveDaysIcon = `http://openweathermap.org/img/wn/${element.weather[0].icon}@2x.png`
        var fiveDaysTemp = 'Temp: ' + Math.round(element.main.temp) + ' \u2103';
        var fiveDaysWind = 'Wind: ' + element.wind.speed + ' KPH';
        var fiveDaysHumidity = 'Humidity: ' + element.main.humidity + '%';

        var fiveDaysWeather = `
        <div class="five-days-card">
            <h4 class="card-date">${date}</h4>
            <h5 class="card-date">${hour}</h5>
            <img src='${fiveDaysIcon}' alt="">
            <h5 class="card-weather">${fiveDaysTemp}</h5>
            <h5 class="card-weather">${fiveDaysWind}</h5>
            <h5 class="card-weather">${fiveDaysHumidity}</h5>
        </div>`
        $('#forecast').append(fiveDaysWeather);
    });


}

// GET 5-DAYS WEATHER DATA
function getFiveDaysWeatherData(currentData) {
    if (currentData) {
        var lon = currentData.coord.lon;
        var lat = currentData.coord.lat;

        $.get(fiveDaysWeatherUrl + `lat=${lat}&lon=${lon}`)
            .then(function (fiveDaysData) {
                updateFiveDaysWeatherUI(fiveDaysData);
            })
    }

}



// UPDATE THE UI WITH THE CURRENT WEATHER
function updateCurrentWeatherUI(currData) {
    // console.log(currData);

    // get date with current timezone
    var today = moment().add(currData.timezone, 'seconds').format('DD/MM/YYYY');

    var currCity = currData.name + ' - ' + currData.sys.country;
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

// GET WEATHER DATA
function getWeatherData(cityName) {
    if (cityName) {
        $.get(`${currentWeatherUrl}q=${cityName}`)
            .then(function (currentData) {
                updateCurrentWeatherUI(currentData)
                getFiveDaysWeatherData(currentData)
            });
    } else {
        alert('Please enter a city name.');
    }
}

// ON CLICK SEARCH BUTTON
$('#search-button').click(function (e) {
    e.preventDefault();
    // GET USER INPUT
    var city = $('#search-input').val();
    getWeatherData(city)

    // ADD CITY TO searchHistory
    searchHistory = JSON.parse(localStorage.getItem("searchHistory"));
    if (!searchHistory.includes(city)) {
        searchHistory.push(city);
        localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
        var historyButton = `<button class="btn history-button">${city}</button>`
        $('#history').append(historyButton);
    }
});

// DeletesearchHistory
$('.delete-search-history').click(function (e) {
    e.preventDefault();
    var searchHistory = [];
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    $('#history').html('');

});
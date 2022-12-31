var apiKey = '318dd89627c7bbdd887f3385d00e0216';
var currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?limit=1&units=metric&appid=${apiKey}&`;

// UPDATE THE UI WITH THE CURRENT WEATHER




// GET CURRENT WEATHER DATA
function getCurrentWeatherData(cityName) {
    if (cityName) {
        $.get(`${currentWeatherUrl}q=${cityName}`)
            .then(function (data) {
                console.log(data);
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
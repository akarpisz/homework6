// GIVEN a weather dashboard with form inputs
// WHEN I search for a city
// THEN I am presented with current and future conditions for that city and that city is added to the search history
// WHEN I view current weather conditions for that city
// THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
// WHEN I view the UV index
// THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
// WHEN I view future weather conditions for that city
// THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, and the humidity
// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city
// WHEN I open the weather dashboard
// THEN I am presented with the last searched city forecast

//form input-city

//sidebar?
//recent searches

//current conditions div, main

// within, name header with date, weather icon
//temp, humidity, windspeed
//UV index with color

//5 day forcast div
//5 dynamically created divs/boxes. each with dates, icons, temp, and humidit
$(document).ready(function () {
  var location = $("#location");
  var recent; //array? object? localStorage?
  var currentDiv = $(".current");
  var forecastDiv = $(".forecast");
  var goBtn = $(".submit");
  var city;
  var input;
  var state;
  var apiKey = "appid=951c1caaa9c7a31e8b0914294d5fe3e2";
  var cityarr = [];


  // function isUpper(char) {
  //     return (char === char.toUpperCase());
  // }
  function convertToF(temp) {
      temp = (temp - 273.15) * 9/5 + 32;
  }

  function clear() {
    currentDiv.empty();
    forecastDiv.empty();
  }

  function isSpace(char) {
    return char === " ";
  }

  $(goBtn).on("click", function (event) {
    event.preventDefault();
    input = location.val().trim();

    var last = input.length - 1;
    var secLast = input.length - 2;
    var thirdLast = input.length - 3;

    if (isSpace(input.charAt(thirdLast))) {
      localStorage.setItem("location", input);
      state = input.charAt(secLast) + input.charAt(last);
      cityarr = input.split(" ");
      cityarr.pop();
      city = cityarr.join(" ");

      console.log(state);
      console.log(city);

      queryUrl =
        "https://api.openweathermap.org/data/2.5/weather?q=" +
        city +
        "," +
        state +
        "001" +
        "&" +
        apiKey;
      // console.log(state);
    } else {
      queryUrl =
        "https://api.openweathermap.org/data/2.5/weather?q=" +
        city +
        "&" +
        apiKey;
      // console.log(state);
    }

    $.ajax({
      url: queryUrl,
      method: "GET",
    }).then(function (response) {
      clear();
      console.log(response);
      //current conditions div, main

      // within, name header with date, weather icon
      //temp, humidity, windspeed
      //UV index with color

      //the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
      var cityName = response.name;
      var date;
      var icon = response.weather._0.icon;
      var temp = response.main.temp;
    });
  });
});

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

//favorable -green 0-3
//moderate - yellow 4-6
//severe - red 7-10

//form input-city

//sidebar?
//recent searches

//current conditions div, main

// within, name header with date, weather icon
//temp, humidity, windspeed
//UV index with color

//5 day forcast div
//5 dynamically created divs/boxes. each with dates, icons, temp, and humidit
var now = moment();
var date = now.format("dddd, M/D/YYYY, h:mm a");
var moment = moment().days(0).hours(1).minutes(0).seconds(0).milliseconds(0);
// var modMoment;

$(document).ready(function () {
  var location = $("#location");
  var recent = $(".recent");
  var forecastDiv = $(".forecast");
  var goBtn = $(".submit");
  var currentHeader = $(".currentHeader");
  var tempSpan = $(".temperature");
  var humSpan = $(".humidity");
  var wsSpan = $(".windspeed");
  var uvSpan = $(".uvIndex");
  var currIconImg = $("#currIcon");
  var forecastHeader = $(".forecast");
  var recentArr = [];
  var city;
  var input;
  var state;
  var apiKey = "appid=951c1caaa9c7a31e8b0914294d5fe3e2";
  var cityarr = [];
  var last;
  var secLast;
  var thirdLast;
  var cityName;
  var icon;
  var iconURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
  var temp;
  var tempF;
  var humidity;
  var windSpeed;
  var uvIndex;
  var lat;
  var lon;
  var query2;
  var daily;
  var responseObj = {};
  var cardDiv;
  var contentDiv;
  var dateSpan;
  var iconSpanF;
  var fIconImage;
  var tempSpanF;
  var humiditySpan;
  // var uvSpan;

  function colorUV() {
    uvSpan.css("color", "black");
    if (uvIndex >= 7) {
      uvSpan.css("background-color", "red");
    } else if (uvIndex >= 4) {
      uvSpan.css("background-color", "yellow");
    } else {
      uvSpan.css("background-color", "green");
    }
  }

  function fiveDay() {
    daily = responseObj.daily;
    forecastHeader.text("Here's your 5-day forecast for " + cityName + ":");
    var modMoment = moment.clone();
    for (var i = 0; i < 5; i++) {
      modMoment = modMoment.add(1, "d");

      icon = daily[i].weather[0].icon;

      temp = daily[i].temp.day;
      humidity = parseInt(daily[i].humidity);
      windSpeed = parseInt(daily[i].wind_speed);
      uvIndex = parseInt(daily[i].uvi);
      convertToF(temp);

      cardDiv = $("<div>");
      contentDiv = $("<div>");
      dateSpan = $("<span>");
      iconSpanF = $("<span>");
      fIconImage = $("<img>");
      tempSpanF = $("<span>");
      humiditySpan = $("<span>");
      uvSpan = $("<span>");

      dateSpan.html(modMoment.format("M/D ddd") + "<br/>");

      fIconImage.attr("src", iconURL);

      fIconImage.attr("alt", "weather icon");

      tempSpanF.html("Temperature: " + tempF + " F" + "<br/>");

      humiditySpan.html("Humidity: " + humidity + "<br/>");

      uvSpan.html("UV Index: " + uvIndex);
      colorUV();

      iconSpanF.append(fIconImage);
      iconSpanF.append("<br/>");

      cardDiv.addClass("card");

      contentDiv.addClass("card-body");

      $(forecastDiv).append(
        $(cardDiv).append(
          $(contentDiv).append(
            dateSpan,
            iconSpanF,
            tempSpanF,
            humiditySpan,
            uvSpan
          )
        )
      );
    }
  }

  function current() {
    $(currentHeader).text(cityName + ", " + date);
    $(currIconImg).attr("src", iconURL);
    $(currIconImg).attr("alt", "weather icon");
    $(tempSpan).text("Current Temperature: " + tempF + " F");
    $(humSpan).text("Humidity: " + humidity);
    $(wsSpan).text("Windspeed: " + windSpeed + " mph");
    $(uvSpan).text("UV Index: " + uvIndex);
    colorUV();
  }

  function convertToF(temp) {
    tempF = (((temp - 273.15) * 9) / 5 + 32).toFixed(0);
  }

  function isSpace(char) {
    return char === " ";
  }

  function prepInput(event) {
    // input = location.val().trim();
    last = input.length - 1;
    secLast = input.length - 2;
    thirdLast = input.length - 3;
    
    if (isSpace(input.charAt(thirdLast))) {
      state = input.charAt(secLast) + input.charAt(last);
      cityarr = input.split(" ");
      cityarr.pop();
      city = cityarr.join(" ");

      queryUrl =
        "https://api.openweathermap.org/data/2.5/weather?q=" +
        city +
        "," +
        state +
        "001" +
        "&" +
        apiKey;
    } else {
      queryUrl =
        "https://api.openweathermap.org/data/2.5/weather?q=" +
        input +
        "&" +
        apiKey;
    }
  }

  function getResults() {
    prepInput();
    $.ajax({
      url: queryUrl,
      method: "GET",
    }).then(function (response) {
      cityName = response.name;
      icon = response.weather[0].icon;
      iconURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
      temp = parseInt(response.main.temp);
      humidity = parseInt(response.main.humidity);
      windSpeed = parseInt(response.wind.speed);
      lon = response.coord.lon;
      lat = response.coord.lat;
      convertToF(temp);
      query2 =
        "https://api.openweathermap.org/data/2.5/onecall?lat=" +
        lat +
        "&" +
        "lon=" +
        lon +
        "&" +
        apiKey;
      $.ajax({
        url: query2,
        method: "GET",
      }).then(function (response) {
        responseObj = response;
        uvIndex = parseInt(response.current.uvi);
        current();
        fiveDay();
      });
    });
  }

  function saveRecent() {
      recentArr= [];
    for (var i = 0; i < localStorage.length; i++) {
      var key = localStorage.key(i);
      var value = JSON.parse(localStorage[key]);
      //   console.log(key + " => " + value);
      recentArr.push(value);
    }
  }

  function displayRecent() {
    recent.empty();
    var len = recentArr.length;
    var list = $("<ul>");
    var li;

    for (var i = 0; i < len; i++) {
      li = $("<li>");
      li.text(recentArr[i]);
      list.append(li);
    }
    recent.append(list);
  }

  saveRecent();
  displayRecent();
  console.log(recentArr);
  $(goBtn).on("click", function (event) {
    event.preventDefault();
    input = location.val().trim();
    localStorage.setItem(localStorage.length + 1, JSON.stringify(input));
    getResults();
    saveRecent();
    displayRecent();
  });

  $(recent).on("click", "li", function(event) {
    event.preventDefault();
    e = $(event.target);
    input = e.text();
    getResults();
    displayRecent();
  });
});

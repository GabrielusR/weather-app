//script.js

var APPID = "4ffc70eb22e7108feb842ad56cb45d4c";
var temp;
var loc;
var icon;
var humidity;
var wind;
var direction;

// Usando a API do open weather map 
// para coletar dados por cidade.
function updateByCity(city) {
    var url = "http://api.openweathermap.org/data/2.5/weather?" +
    "q="+ city + 
    "&lang=pt" +
    "&APPID=" + APPID;
    sendRequest(url);
}

// Usando a API do open weather map 
// para coletar dados por localização geográfica.
function updateByGeo(lat, lon) {
    var url = "http://api.openweathermap.org/data/2.5/weather?" + "lat=" + lat +
    "&lon=" + lon +
    "&APPID=" + APPID;
    sendRequest(url);
}

function sendRequest(url) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
      if(xmlhttp.readyState === 4 && xmlhttp.status === 200)   {
            var data = JSON.parse(xmlhttp.responseText);
            var weather = {};
            weather.icon = data.weather[0].id;
            weather.humidity = data.main.humidity;
            weather.wind = ms2kmh(data.wind.speed);
            weather.direction = deg2dir(data.wind.deg);
            weather.loc = data.name;
            weather.temp = k2c(data.main.temp);
          
            update(weather);
      }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function ms2kmh (msspeed) {
    return Math.round(msspeed*3.6);
}

function deg2dir(deg) {
    var range = 360/16;
    var low = 360 - range/2;
    var high = (low + range) % 360;
    var angles = ["N", "NNE", "LNE", "L", "LSE", "SE", "SSE", "S", "SSO", "SO", "OSO", "ONO", "NNO"];
    for (i in angles) {
        if(deg >= low && deg < high) {
            return angles[i];
        }
        low = (low + range) % 360;
        high = (high + range) % 360;
    }
    
    return "N";
}

function k2c(ktemp) {
    return Math.round(ktemp - 273.15);
}

function update(weather) {
    wind.innerHTML = weather.wind;
    direction.innerHTML = weather.direction;
    humidity.innerHTML = weather.humidity;
    loc.innerHTML = weather.loc;
    temp.innerHTML = weather.temp;
    icon.src = "imgs/codes/" + weather.icon + ".png";
}

function showPosition(position) {
    updateByGeo(position.coords.latitude, position.coords.longitude);
}

window.onload = function() {
    temp = document.getElementById("temperature");
    loc = document.getElementById("location");
    icon = document.getElementById("icon");
    humidity = document.getElementById("humidity");
    wind = document.getElementById("wind");
    direction = document.getElementById("direction");
    
    if(!navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        var city = window.prompt("Não podemos descobrir sua localização. Em que cidade você está?")
        updateByCity(city);
    }
}

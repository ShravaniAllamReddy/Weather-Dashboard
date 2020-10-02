// This .on("click") function will trigger the AJAX Call
$(document).ready(function () {

    let cities = JSON.parse(window.localStorage.getItem("cities")) || [];

    $("#cityweather").on("click", function (event) {
        event.preventDefault();
        let cityValue = $("#city-input").val().trim();
        // console.log(cityValue);    
        $("#city-input").val("");
        weatherForecast(cityValue);
    });


    $(".append-list").on("click", "li", function () {
        weatherForecast($(this).text());
    });

    if (cities.length > 0) {
        //console.log(cities);
        weatherForecast(cities[cities.length - 1]);
    }
    for (let i = 0; i < cities.length; i++) {
        appendCity(cities[i]);
        //console.log(cities[i]);
    }

    function appendCity(city) {
        let cityDiv = $("<li>");
        cityDiv.text(city);
        cityDiv.addClass("list-group-item list-group-item-action");
        $(".append-list").append(cityDiv);
    }


    // This function gets the weather and 5day forecast from openweatherAPI for a searched location
    function weatherForecast(city) {

        let APIKey = "e258ae8e15a82c16efcfa4a02bc029ae";
        // Here we construct our URL
        let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;


        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {

            if (cities.indexOf(city) === -1) {
                cities.push(city);
                window.localStorage.setItem("cities", JSON.stringify(cities));
                appendCity(city);
            }

            $("#weather").css("display", "block");
            $(".card").css("display", "block");


            console.log(response);
            let KTemp = response.main.temp;

            //Convert the temp to fahrenheit
            let Ftemp = (KTemp - 273.15) * 1.80 + 32;

            let weatherIcon = response.weather[0].icon;

            let iconURL = "https://openweathermap.org/img/w/" + weatherIcon + ".png";

            let icon = $("<img>").attr("src", iconURL);

            let location = $("<h3>").html(response.name + "(" + moment().format('L') + ")").append(icon);

            let temperature = $("<p>").html("Temperature: " + Ftemp.toFixed(2) + "&#176;F");

            let humidity = $("<p>").text("Humidity: " + response.main.humidity + "%");
            //converts windspeed from meters/second to Miles per hour
            let windSpeed = $("<p>").html("Wind Speed: " + ((response.wind.speed) * 2.236937).toFixed(2) + " MPH");

            let latitude = response.coord.lat;

            let longitude = response.coord.lon;
            //To grab the UVINdex value we need to make a call to UVURL
            let UVURL = "https://api.openweathermap.org/data/2.5/uvi?" + "appid=" + APIKey + "&lat=" + latitude + "&lon=" + longitude;

            let cityID = response.id;

            //console.log(cityID);
            $.ajax({
                url: UVURL,
                method: "GET"
            }).then(function (response) {

                let UVValue = response.value;
                // let UVValue = 2.88;
                //console.log(response);
                //'d-inline' class is used to color just the UVvalue part instead of entire paragraph
                let UVIndex = $("<p>").text(UVValue).addClass("d-inline");
                let UVIndexDiv = $("<p>").text("UV Index: ");
                UVIndexDiv.append(UVIndex);
                // console.log(UVIndexDiv);
                if (UVValue >= 0 && UVValue < 3) {
                    UVIndex.css("background-color", "green");
                    UVIndex.css("color", "white");
                    // UVIndex.addClass("bg-success")
                }
                else if (UVValue > 2 && UVValue < 8) {
                    UVIndex.css("background-color", "yellow");
                    // UVIndex.addClass("bg-warning")
                }
                else if (UVValue > 8 && UVValue < 20) {
                    UVIndex.css("background-color", "red");
                    UVIndex.css("color", "white");
                    // UVIndex.addClass("bg-danger");
                }

                let card = $("<div>").addClass("card");
                let cardBody = $("<div>").addClass("card-body");
                //cardBody.empty();
                cardBody.append(location, temperature, humidity, windSpeed, UVIndexDiv);
                //card.empty();
                card.append(cardBody);
                $("#weather-view").empty();
                $("#weather-view").append(card);

                // This calls the five day forecast URL and grabs the values
                let forecastURL = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityID + "&appid=" + APIKey;
                $.ajax({
                    url: forecastURL,
                    method: "GET"
                }).then(function (response) {
                    $("#fivedayforecast").empty();
                    //  This filters the list of 40items into  list of 5 items with respect to 
                    // time value as original array gives 3hour forecast
                    let reducedArray = response.list.filter(function (element) {

                        let dateValue = element.dt_txt.split(" ");

                        if (dateValue[1] === "12:00:00") {
                            return dateValue[1];
                        }

                    })
                    //console.log(reducedArray);
                    for (let i = 0; i < reducedArray.length; i++) {
                        let tempK = reducedArray[i].main.temp;
                        let tempF = (tempK - 273.15) * 1.80 + 32;
                        let weatherIcon1 = reducedArray[i].weather[0].icon;
                        let iconURL = "https://openweathermap.org/img/w/" + weatherIcon1 + ".png";
                        let icon = $("<img>").attr("src", iconURL);
                        let dateValue = $("<h6>").text(moment(reducedArray[i].dt_txt).format("MM/DD/YYYY"));
                        let temp = $("<p>").html("Temp: " + tempF.toFixed(2) + "&#176;F");
                        let humid = $("<p>").text("Humidity: " + reducedArray[i].main.humidity + "%");
                        let card = $("<div>").addClass("card");
                        let cardBody = $("<div>").addClass("card-body");

                        cardBody.append(dateValue, icon, temp, humid);

                        card.append(cardBody);
                        card.css("background-color", "blue");
                        card.css("color", "white");


                        $("#fivedayforecast").append(card);
                    }

                })

            })
        })
    }

});


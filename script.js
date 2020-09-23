// This .on("click") function will trigger the AJAX Call
$(document).ready(function () {
    let city = "";
    let citiesSearched = [];

    $("#cityweather").on("click", function (event) {
        let cityName = $("#city-input").val().trim();
        // Preventing the submit button from trying to submit the form
        event.preventDefault();

        // $("#city-input").val("");
        weatherForecast(cityName);
        searchHistory();
        // Here we grab the text from the input box
    });

    function searchHistory() {
        let citiesSaved = [];
        city = $("#city-input").val().trim();
        // console.log(city);
        citiesSearched.push(city);
        $("#city-input").val("");
        // console.log(citiesSearched);
        localStorage.setItem("cities", JSON.stringify(citiesSearched));
        citiesSaved = JSON.parse(localStorage.getItem("cities"));
        let cityDiv = $("<li>");
        for (let i = 0; i < citiesSaved.length; i++) {

            //localStorage.setItem("cities", JSON.stringify(citiesSearched));
            // $("#city-input").val("");

            // let cityDiv = $("<li>");
            //citiesSaved = JSON.parse(localStorage.getItem("cities"));
            //console.log(citiesSaved);
            cityDiv.text(citiesSaved[i]);
            //console.log(citiesSaved);
            cityDiv.addClass("list-group-item");
            $(".append-list").append(cityDiv);
            // $(document).on("click", ".list-group-item", weatherForecast);

            $(".list-group-item").on("click", function (event) {

                event.preventDefault();
                let cityInput = $(this).text().trim();

                console.log(cityInput);

                weatherForecast(cityInput);
            });
        }
    }

    function weatherForecast(city) {

        //city = $("#city-input").val().trim();
        // $("#city-input").val("");
        let APIKey = "e258ae8e15a82c16efcfa4a02bc029ae";
        // localStorage.setItem("city", JSON.stringify(city));
        // Here we construct our URL
        let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {

            $("#weather-view").empty();
            $("#weatherInfo").css("display", "block");
            $(".searchList").css("display", "block");

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

            let windSpeed = $("<p>").html("Wind Speed: " + (response.wind.speed * 0.62).toFixed(2) + " MPH");

            let latitude = response.coord.lat;

            let longitude = response.coord.lon;

            let UVURL = "https://api.openweathermap.org/data/2.5/uvi?" + "appid=" + APIKey + "&lat=" + latitude + "&lon=" + longitude;

            let cityID = response.id;

            console.log(cityID);
            $.ajax({
                url: UVURL,
                method: "GET"
            }).then(function (response) {

                let UVValue = response.value;
                // let UVValue = 2.88;
                console.log(response);
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
                cardBody.append(location, temperature, humidity, windSpeed, UVIndexDiv);

                card.append(cardBody);
                $("#weather-view").empty();
                $("#weather-view").append(card);


                let forecastURL = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityID + "&appid=" + APIKey;
                $.ajax({
                    url: forecastURL,
                    method: "GET"
                }).then(function (response) {

                    $("#fivedayforecast").empty();
                    let reducedArray = response.list.filter(function (element) {

                        let dateValue = element.dt_txt.split(" ");

                        if (dateValue[1] === "12:00:00") {
                            return dateValue[1];
                        }

                    })
                    console.log(reducedArray);
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


})


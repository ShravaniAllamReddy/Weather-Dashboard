// This .on("click") function will trigger the AJAX Call
$("#cityweather").on("click", function (event) {

    // Preventing the submit button from trying to submit the form
    event.preventDefault();
    let APIKey = "e258ae8e15a82c16efcfa4a02bc029ae";
    // Here we grab the text from the input box
    let city = $("#city-input").val().trim();

    localStorage.setItem("city", city);

    let cityDiv = $("<li>");
    cityDiv.text(localStorage.getItem("city"));
    cityDiv.addClass("list-group-item");

    $(".append-list").append(cityDiv);


    // addclass("list-group-item");
    // Here we construct our URL
    let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
       
        $("#weather-view").empty();

        $("#weatherInfo").css("display", "block");
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


            console.log(response);
            let UVIndex = $("<p>").text("UV Index: " + response.value);
            let card = $("<div>").addClass("card");
            let cardBody = $("<div>").addClass("card-body");
            cardBody.append(location, temperature, humidity, windSpeed, UVIndex);
            card.append(cardBody);
            $("#weather-view").append(card);

            let forecastURL = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityID + "&appid=" + APIKey;
            $.ajax({
                url: forecastURL,
                method: "GET"
            }).then(function (response) {
                $("#city-input").empty();
                $("#fivedayforecast").empty();
                let reducedArray = response.list.filter(function (element) {

                    let dateValue = element.dt_txt.split(" ");

                    if (dateValue[1] === "00:00:00") {
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

});
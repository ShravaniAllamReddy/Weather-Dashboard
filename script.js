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

        $(".card").css("display", "block");
        console.log(response);
        let KTemp = response.main.temp;

        //Convert the temp to fahrenheit
        let tempF = (KTemp - 273.15) * 1.80 + 32;

        let weatherIcon = response.weather[0].icon;

        let iconURL = "https://openweathermap.org/img/w/" + weatherIcon + ".png";

        let icon = $("<img>").attr("src", iconURL);

        let location = $("<h3>").html(response.name + "(" + moment().format('L') + ")").append(icon);

        let temperature = $("<p>").html("Temperature: " + tempF.toFixed(2) + "&#176;F");

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

            $("#first-day-forecast").empty();
            $("#second-day-forecast").empty();
            $("#third-day-forecast").empty();
            $("#fourth-day-forecast").empty();
            $("#fifth-day-forecast").empty();

            console.log(response);
            let UVIndex = $("<p>").text("UV INdex: " + response.value);
            $("#weather-view").append(location, temperature, humidity, windSpeed, UVIndex);

            let forecastURL = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityID + "&appid=" + APIKey;
            $.ajax({
                url: forecastURL,
                method: "GET"
            }).then(function (response) {

               
                let tempK1 = response.list[4].main.temp;
                let tempF1 = (tempK1 - 273.15) * 1.80 + 32;
                let weatherIcon1 = response.list[4].weather[0].icon;
                let iconURL1 = "https://openweathermap.org/img/w/" + weatherIcon1 + ".png";
                let icon1 = $("<img>").attr("src", iconURL1);
                let dateValue1 = $("<h6>").text(moment(response.list[4].dt_txt).format("MM/DD/YYYY"));
                let temp1 = $("<p>").html("Temp: " + tempF1.toFixed(2) + "&#176;F");
                let humid1 = $("<p>").text("Humidity: " + response.list[4].main.humidity + "%");


                $("#first-day-forecast").append(dateValue1, icon1, temp1, humid1);

                let tempK2 = response.list[12].main.temp;
                let tempF2 = (tempK2 - 273.15) * 1.80 + 32;
                let weatherIcon2 = response.list[12].weather[0].icon;
                let iconURL2 = "https://openweathermap.org/img/w/" + weatherIcon2 + ".png";
                let icon2 = $("<img>").attr("src", iconURL2);
                let dateValue2 = $("<h6>").text(moment(response.list[12].dt_txt).format("MM/DD/YYYY"));
                let temp2 = $("<p>").html("Temp: " + tempF2.toFixed(2) + "&#176;F");
                let humid2 = $("<p>").text("Humidity: " + response.list[12].main.humidity + "%");

                $("#second-day-forecast").append(dateValue2, icon2, temp2, humid2);

                let tempK3 = response.list[20].main.temp;
                let tempF3 = (tempK3 - 273.15) * 1.80 + 32;
                let weatherIcon3 = response.list[20].weather[0].icon;
                let iconURL3 = "https://openweathermap.org/img/w/" + weatherIcon3 + ".png";
                let icon3 = $("<img>").attr("src", iconURL3);
                let dateValue3 = $("<h6>").text(moment(response.list[20].dt_txt).format("MM/DD/YYYY"));
                let temp3 = $("<p>").html("Temp: " + tempF3.toFixed(2) + "&#176;F");
                let humid3 = $("<p>").text("Humidity: " + response.list[20].main.humidity + "%");

                $("#third-day-forecast").append(dateValue3, icon3, temp3, humid3);

                let tempK4 = response.list[28].main.temp;
                let tempF4 = (tempK4 - 273.15) * 1.80 + 32;
                let weatherIcon4 = response.list[28].weather[0].icon;
                let iconURL4 = "https://openweathermap.org/img/w/" + weatherIcon4 + ".png";
                let icon4 = $("<img>").attr("src", iconURL4);
                let dateValue4 = $("<h6>").text(moment(response.list[28].dt_txt).format("MM/DD/YYYY"));
                let temp4 = $("<p>").html("Temp: " + tempF4.toFixed(2) + "&#176;F");
                let humid4 = $("<p>").text("Humidity: " + response.list[28].main.humidity + "%");

                $("#fourth-day-forecast").append(dateValue4, icon4, temp4, humid4);

                let tempK5 = response.list[36].main.temp;
                let tempF5 = (tempK5 - 273.15) * 1.80 + 32;
                let weatherIcon5 = response.list[36].weather[0].icon;
                let iconURL5 = "https://openweathermap.org/img/w/" + weatherIcon5 + ".png";
                let icon5 = $("<img>").attr("src", iconURL5);
                let dateValue5 = $("<h6>").text(moment(response.list[36].dt_txt).format("MM/DD/YYYY"));
                let temp5 = $("<p>").html("Temp: " + tempF5.toFixed(2) + "&#176;F");
                let humid5 = $("<p>").text("Humidity: " + response.list[36].main.humidity + "%");

                $("#fifth-day-forecast").append(dateValue5, icon5, temp5, humid5);

                console.log(forecastURL);

                //$("#five-day-forecast")
            })

        })
    })

});
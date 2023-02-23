const apiKey = 'b22f2950ee874eeeae8124033232002';
window.onload = () => {
    window.addEventListener("click", clickEvent);
    startingLocation('London');
    const searchElemnt = document.getElementById('search');
    searchElemnt.addEventListener('input', () => {
        workOfSearchElement(searchElemnt);
    })

}
function workOfSearchElement(chehcked) {
    const locationsBoxElemnet = document.getElementById('locationsBox')
    if (chehcked.value.length > 2) {
        fetch(`https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${chehcked.value}`)
            .then((response) => response.json())
            .then((data) => {
                locationsBoxElemnet.innerHTML = "";
                for (let i = 0; i < data.length; i++) {
                    if (i === data.length - 1) {
                        locationsBoxElemnet.insertAdjacentHTML('beforeend', `<button class="location locationBottom" id="${data[i].lat},${data[i].lon}" >${data[i].name}, ${data[i].region}, ${data[i].country}</button>`)

                    } else {
                        locationsBoxElemnet.insertAdjacentHTML('beforeend', `<button class="location" id="${data[i].lat},${data[i].lon}" >${data[i].name}, ${data[i].region}, ${data[i].country}</button>`)
                    }
                }
                searchBorderModifier(chehcked.value.length > 2 && locationsBoxElemnet.innerHTML !== "")
            });
    }
    else {
        locationsBoxElemnet.innerHTML = "";
        searchBorderModifier(false)
    }


}
function clickEvent(event) {
    if (event.target.className == "location" || event.target.className == "location locationBottom") {
        const countryCode = event.target.id;
        workingAPI(event.target.id,event.target.textContent)
        clearSearch();
    }
}
function displayWeather(object, btnName) {
    let lcationName = btnName.split(',')[0];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    changeLocationNameFontSize(lcationName);
    document.getElementById('name').textContent = lcationName;
    document.getElementById('date').textContent = months[Number(object.location.localtime.slice(5, 7)) - 1] + ' ' + object.location.localtime.slice(8, 10) + ',' + object.location.localtime.slice(0, 4);
    document.getElementById('temp').textContent = Math.round(object.current.temp_c) + '°';
    document.getElementById('icon').src = object.current.condition.icon;
    document.getElementById('text').textContent = object.current.condition.text;
}
function displayCurrentMinMax(object) {
    document.getElementById('minmax').textContent = Math.round(object.forecast.forecastday[0].day.mintemp_c) + '° / ' + Math.round(object.forecast.forecastday[0].day.maxtemp_c) + '°';
}
function displayWeatherForecast(object) {
    const horizontal2Element = document.getElementById('horizontal2');
    horizontal2Element.innerHTML = '';
    let day = ''
    for (let i = 1; i < 7; i++) {
        day = new Date(object.forecast.forecastday[i].date);
        horizontal2Element.insertAdjacentHTML('beforeend', `<div class="forecast">
        <div class="forecastDay">${String(day).slice(0, 3)}</div>
        <img class="forecastIcon" src=${object.forecast.forecastday[i].day.condition.icon}></img>
        <div class="forecastMinMax">${Math.round(object.forecast.forecastday[i].day.mintemp_c) + '°/' + Math.round(object.forecast.forecastday[i].day.maxtemp_c)}</div>
    </div>`)
    }
}
function searchBorderModifier(active) {
    const searchMainElement = document.getElementById('searchmain')
    if (active) {
        searchMainElement.style.borderBottomLeftRadius = '0px';
        searchMainElement.style.borderBottomRightRadius = '0px';
        searchMainElement.style.borderTopLeftRadius = '12px';
        searchMainElement.style.borderTopRightRadius = '12px';
    }
    else {
        searchMainElement.style.borderBottomLeftRadius = '50px';
        searchMainElement.style.borderBottomRightRadius = '50px';
        searchMainElement.style.borderTopLeftRadius = '50px';
        searchMainElement.style.borderTopRightRadius = '50px';
    }
}
function clearSearch() {
    const locationsBoxElemnet = document.getElementById('locationsBox')
    locationsBoxElemnet.innerHTML = "";
    const searchElemnt = document.getElementById('search');
    searchElemnt.value = ""
    searchBorderModifier(false)
}
function backGroundChanger(obj) {
    let currentHour = Number(obj.current.last_updated.split(' ')[1].split(':')[0]);
    if (currentHour < 7) {
        document.getElementById('main-container').style.backgroundImage = "url('night.jpg')";
    }
    else if (currentHour > 17) {
        document.getElementById('main-container').style.backgroundImage = "url('night.jpg')";
    }
    else {
        document.getElementById('main-container').style.backgroundImage = "url('day.jpg')";

    }
}
function changeLocationNameFontSize(locationName) {
    const NameElement = document.getElementById("name");
    if (locationName.length < 9) {
        NameElement.style.fontSize = '50px'
    }
    else if (locationName.length < 19) {
        NameElement.style.fontSize = '25px'
    }
    else {
        NameElement.style.fontSize = '16px'
    }
}
function startingLocation(location){
    workingAPI(location,location);
}
function workingAPI(locationCode,locationName){
    const countryCode = locationCode;
    fetch(`http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${countryCode}`)
        .then((response) => response.json())
        .then((data) => {
            backGroundChanger(data)
            displayWeather(data, locationName);
        });
    fetch(`http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${countryCode}&days=1`)
        .then((response) => response.json())
        .then((data) => {
            displayCurrentMinMax(data);
        });
    fetch(`http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${countryCode}&days=7`)
        .then((response) => response.json())
        .then((data) => {
            displayWeatherForecast(data);
        });
}

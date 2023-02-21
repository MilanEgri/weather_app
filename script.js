const apiKey = 'b22f2950ee874eeeae8124033232002';
window.onload = () => {
    window.addEventListener("click", clickEvent);
    const searchElemnt = document.getElementById('search');
    searchElemnt.addEventListener('input', () => {
        workOfSearchElement(searchElemnt);
    })

}
function workOfSearchElement(chehcked) {
    const locationsBoxElemnet = document.getElementById('locationsBox')
    if (chehcked.value.length > 2) {
        locationsBoxElemnet.innerHTML = ""
        fetch(`https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${chehcked.value}`)
            .then((response) => response.json())
            .then((data) => {
                data.forEach(element => {
                    locationsBoxElemnet.insertAdjacentHTML('beforeend', `<button class=location >${element.name}, ${element.region}, ${element.country}</button>`)
                });
            });
    }

}
function clickEvent(event) {
    if (event.target.className == "location") {
        const countrydata = event.target.textContent.split(`,`)
        const countryCode = countrydata[0] + ',' + countrydata[2].slice(1, countrydata[2].length)
        fetch(`http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${countryCode}}`)
            .then((response) => response.json())
            .then((data) => {
                displayWeather(data);
            });
        fetch(`http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${countryCode}&days=1`)
            .then((response) => response.json())
            .then((data) => {
                displayWeatherIcon(data);
            });
        fetch(`http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${countryCode}&days=7`)
            .then((response) => response.json())
            .then((data) => {
                displayWeatherForecast(data);
            });
    }
}
function displayWeather(object) {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    object.location.name.length>8? document.getElementById("name").style.fontSize = "25px":document.getElementById("name").style.fontSize = "50px";
    document.getElementById('name').textContent = object.location.name;
    document.getElementById('date').textContent = months[Number(object.location.localtime.slice(5, 7)) - 1] + ' ' + object.location.localtime.slice(8, 10) + ',' + object.location.localtime.slice(0, 4);
    document.getElementById('temp').textContent = Math.round(object.current.temp_c) + '°';
    document.getElementById('icon').src = object.current.condition.icon;
    document.getElementById('text').textContent = object.current.condition.text;
}
function displayWeatherIcon(object) {
    document.getElementById('minmax').textContent = object.forecast.forecastday[0].day.mintemp_c+'° / '+object.forecast.forecastday[0].day.maxtemp_c+'°';
}
function displayWeatherForecast(object)
{
    const horizontal2Element =document.getElementById('horizontal2');
    horizontal2Element.innerHTML='';
    let day =''
    for(let i=1;i<7;i++)
    {
         day =new Date(object.forecast.forecastday[i].date);
        console.log(Math.round(object.forecast.forecastday[i].day.mintemp_c)+'°/'+Math.round(object.forecast.forecastday[i].day.maxtemp_c)+'°')
        horizontal2Element.insertAdjacentHTML('beforeend',`<div class="forecast">
        <div class="forecastDay">${String(day).slice(0,3)}</div>
        <img class="forecastIcon" src=${object.forecast.forecastday[i].day.condition.icon}></img>
        <div class="forecastMinMax">${Math.round(object.forecast.forecastday[i].day.mintemp_c)+'°/'+Math.round(object.forecast.forecastday[i].day.maxtemp_c)}</div>
    </div>`)
    }
}

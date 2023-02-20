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
            const countrydata =event.target.textContent.split(`,`)
            const countryCode = countrydata[0]+','+countrydata[2].slice(1,countrydata[2].length)
            fetch(`http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${countryCode}}`)
                .then((response) => response.json())
                .then((data) => {
                    console.log(data);
                    displayWeather(data)
                });
        } 
}
function displayWeather(object){
    const months  = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul","Aug", "Sep", "Oct", "Nov", "Dec"];
    console.log(object);
    document.getElementById('cityName').textContent = object.location.name;
    document.getElementById('date').textContent =  months[Number(object.location.localtime.slice(5,7))-1]+' '+object.location.localtime.slice(8,10)+','+object.location.localtime.slice(0,4);
    document.getElementById('celsius').textContent = Math.round(object.current.temp_c)+'°';
    document.getElementById('conditionIcon').src =object.current.condition.icon;
    document.getElementById('coditionText').textContent = object.current.condition.text;
    console.log(object.current.condition.icon);
}
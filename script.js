const api_key='8cf585be50d71b413ef0d1500283f683'

const userTab=document.querySelector("[data-userWeather]")
const searchTab=document.querySelector("[data-searchWeather]")
const userContainer=document.querySelector(".weather-container")

const grantAccessContainer=document.querySelector(".data-grantAccess")
const searchForm=document.querySelector("[data-searchForm]")
const loadingScreen=document.querySelector(".loading-container")
const userInfoContainer=document.querySelector(".user-info-container")

let currentTab=userTab
currentTab.classList.add("current-tab");

function switchTab(clickedtab){
    if(clickedtab != currentTab){
        currentTab.classList.remove("current-tab");
        currentTab=clickedtab;
        currentTab.classList.add("current-tab")
    
    if(!searchForm.classList.contains("active")){
        userInfoContainer.classList.remove('active')
        grantAccessContainer.classList.remove('active')
        searchForm.classList.add('active');
    }
    else{
        searchForm.classList.remove('active')
        userInfoContainer.classList.remove('active')
        getFormSessionStroage()
    }
}
}

userTab.addEventListener('click',()=>{
    switchTab(userTab)
})

searchTab.addEventListener('click',()=>{
    switchTab(searchTab)
})

function getFormSessionStroage(){
    const localCoordinates=sessionStorage.getItem("user-coordinates");

    if(!localCoordinates){
        grantAccessContainer.classList.add("active")
    }
    else{
       const coordinates=JSON.parse(localCoordinates)
       fetchUserWeatherInfo(coordinates)
}}

 async function fetchUserWeatherInfo(coordinates){
    let {lat,lon}=coordinates
    grantAccessContainer.classList.remove('active')
    loadingScreen.classList.add('active')
    renderInfo(data)

    try {
        let res=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`)

        const data= await res.json()
        loadingScreen.classList.remove('active')
        userInfoContainer.classList.add('active')

    } catch (error) {
        loadingScreen.classList.remove('active')
        // hw
    }
}

function renderInfo(weatherInfo){
    const city=document.querySelector("[data-cityName]")
    const countryIcon=document.querySelector("[data-countryIcon]")
    const desc=document.querySelector("[data-weatherDesc]")
    const wetherIcon=document.querySelector("[data-weatherIcon]")
    const temp=document.querySelector("[data-temp]")
    const windSpeed=document.querySelector("[data-windspeed]")
    const humidity=document.querySelector("[data-humidity]")
    const cloudness=document.querySelector("[data-cloud]")

    city.innerText=weatherInfo?.name;
    countryIcon.src=`https://flagcdn.com/144×108/${weatherInfo?.sys?.country.toLowerCase()}.png`;

    desc.innerText=weatherInfo?.weather?.[0]?.description;

    wetherIcon.src=`http://openweathermap.org/img/w/${wetherInfo?.weather?.[0]?.icon}.png`
}
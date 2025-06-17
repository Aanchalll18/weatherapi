const api_key = '8cf585be50d71b413ef0d1500283f683';

const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location-container"); // FIXED
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

let currentTab = userTab;
currentTab.classList.add("current-tab");
getFromSessionStorage();

function switchTab(clickedTab) {
	if (clickedTab !== currentTab) {
		currentTab.classList.remove("current-tab");
		currentTab = clickedTab;
		currentTab.classList.add("current-tab");

		if (!searchForm.classList.contains("active")) {
			userInfoContainer.classList.remove("active");
			grantAccessContainer.classList.remove("active");
			searchForm.classList.add("active");
		} else {
			searchForm.classList.remove("active");
			userInfoContainer.classList.remove("active");
			getFromSessionStorage();
		}
	}
}

userTab.addEventListener('click', () => switchTab(userTab));
searchTab.addEventListener('click', () => switchTab(searchTab));

function getFromSessionStorage() {
	const localCoordinates = sessionStorage.getItem("user-coordinates");
	if (!localCoordinates) {
		grantAccessContainer.classList.add("active");
	} else {
		const coordinates = JSON.parse(localCoordinates);
		fetchUserWeatherInfo(coordinates);
	}
}

async function fetchUserWeatherInfo(coordinates) {
	const { lat, lon } = coordinates;

	grantAccessContainer.classList.remove("active");
	loadingScreen.classList.add("active");

	try {
		const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`);
		const data = await res.json();

		loadingScreen.classList.remove("active");
		userInfoContainer.classList.add("active");

		renderInfo(data);
	} catch (error) {
		loadingScreen.classList.remove("active");
		alert("Failed to fetch weather info.");
	}
}

function renderInfo(weatherInfo) {
	const city = document.querySelector("[data-cityName]");
	const countryIcon = document.querySelector("[data-countryIcon]");
	const desc = document.querySelector("[data-weatherDesc]");
	const weatherIcon = document.querySelector("[data-weatherIcon]");
	const temp = document.querySelector("[data-temp]");
	const windSpeed = document.querySelector("[data-windspeed]");
	const humidity = document.querySelector("[data-humidity]");
	const cloudiness = document.querySelector("[data-cloud]");

	if (!weatherInfo) return;

	city.innerText = weatherInfo?.name || "Unknown";
	countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country?.toLowerCase()}.png`;
	desc.innerText = weatherInfo?.weather?.[0]?.description || "No description";
	weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
	temp.innerText = `${weatherInfo?.main?.temp ?? 'N/A'}°C`;
	windSpeed.innerText = `${weatherInfo?.wind?.speed ?? 'N/A'} m/s`;
	humidity.innerText = `${weatherInfo?.main?.humidity ?? 'N/A'}%`;
	cloudiness.innerText = `${weatherInfo?.clouds?.all ?? 'N/A'}%`;
}

function getLocation() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(showPosition);
	} else {
		alert("Geolocation not supported or allowed");
	}
}

function showPosition(position) {
	const userCoordinates = {
		lat: position.coords.latitude,
		lon: position.coords.longitude
	};
	sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
	fetchUserWeatherInfo(userCoordinates);
}

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);

const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit", (e) => {
	e.preventDefault();
	let cityName = searchInput.value.trim();

	if (cityName === '') return;
	fetchSearchWeatherInfo(cityName);
});

async function fetchSearchWeatherInfo(city) {
	loadingScreen.classList.add("active");
	userInfoContainer.classList.remove("active");
	grantAccessContainer.classList.remove("active");

	try {
		const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}&units=metric`);
		const data = await res.json();

		loadingScreen.classList.remove("active");
		userInfoContainer.classList.add("active");
		renderInfo(data);
	} catch (error) {
		loadingScreen.classList.remove("active");
		alert("Failed to fetch city weather info.");
	}
}

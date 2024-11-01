var APIKEY = '04849affb4017f3ba9888dff4b554c13'
var units = 'metric'

function getLocalTime(offset) {
    var utcTime = new Date().getTime() + new Date().getTimezoneOffset() * 60000;
    var localTime = new Date(utcTime + offset * 1000);

    return localTime.toLocaleTimeString();
  }

const container = document.querySelector('.container');
const search = document.querySelector('.search-box button');
const weatherBox = document.querySelector('.weather-box');
const weatherDetails = document.querySelector('.weather-details');
const error404 = document.querySelector('.not-found');

search.addEventListener('click', () => {
    const city = document.querySelector('.search-box input').value;

    if (city === '')
        return;

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKEY}&units=${units}`)
        .then(response => {
            console.log(response);
            return response.json()})
            
        .then(json => {
            console.log(json);

            if (json.cod === '404') {
                container.style.height = '400px';
                weatherBox.style.display = 'none';
                weatherDetails.style.display = 'none';
                error404.style.display = 'block';
                error404.classList.add('fadeIn');
                return;
            }

            error404.style.display = 'none';
            error404.classList.remove('fadeIn');

            document.querySelector('.outfit-recommendations').classList.remove('hidden');
            document.querySelector('.peripheral-recommendations').classList.remove('hidden');

            const image = document.querySelector('.weather-box img');
            const temperature = document.querySelector('.weather-box .temperature');
            const description = document.querySelector('.weather-box .description');
            const localTimeDisplay = document.querySelector('.weather-details .time .local-time')
            const country = document.querySelector('.weather-box .country')
            const humidity = document.querySelector('.weather-details .humidity span');
            const wind = document.querySelector('.weather-details .wind span');
            const feels_like = document.querySelector('.weather-details .feels-like span');

            switch (json.weather[0].main) {
                case 'Clear':
                    image.src = 'images/clear.png';
                    break;

                case 'Rain':
                    image.src = 'images/rain.png';
                    break;

                case 'Snow':
                    image.src = 'images/snow-storm.png';
                    break;

                case 'Thunderstorm':
                    image.src = 'images/snow.png';
                    break;

                case 'Clouds':
                    image.src = 'images/cloud.png';
                    break;

                case 'Haze':
                    image.src = 'images/mist.png';
                    break;

                case 'Mist':
                    image.src = 'images/mist.png';
                    break;   
                
                case 'Fog':
                    image.src = 'images/mist.png';
                    break; 

                default:
                    image.src = '';
            }

            temperature.innerHTML = `${parseInt(json.main.temp)}<span>°C</span>`;
            description.innerHTML = `${json.weather[0].description}`;
            country.innerHTML = `Country: ${json.sys.country}`;
            humidity.innerHTML = `${json.main.humidity}%`;
            wind.innerHTML = `${parseInt(json.wind.speed)}Km/h`;
            feels_like.innerHTML = `${json.main.feels_like}<span>°C</span>`;

            const localTime = getLocalTime(json.timezone);
            localTimeDisplay.innerHTML = `${localTime}`;

            const currentWeather = json.weather[0].main;
            const currentTemperature = json.main.temp;

            weatherBox.style.display = '';
            weatherDetails.style.display = '';
            weatherBox.classList.add('fadeIn');
            weatherDetails.classList.add('fadeIn');
            container.style.height = '590px';

            showForecast(city);
            showOutfits(currentWeather,currentTemperature);
            showPeripherals(currentWeather);
            
        });


});

function showForecast(city) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${APIKEY}&units=${units}`)
        .then(response => response.json())
        .then(json => {
            const weekList = document.querySelector('.week-list');
            weekList.innerHTML = ''; // Clear previous forecast data

            // Filter forecast data to one per day (around noon)
            const dailyForecasts = json.list.filter(forecast => forecast.dt_txt.includes("12:00:00"));
            
            dailyForecasts.forEach(day => {
                const dayElement = document.createElement('li');
                
                const dayName = document.createElement('span');
                dayName.classList.add('day-name');
                dayName.innerText = new Date(day.dt_txt).toLocaleDateString('en-US', { weekday: 'long' });

                const dayTemp = document.createElement('span');
                dayTemp.classList.add('day-temp');
                dayTemp.innerHTML = `${parseInt(day.main.temp)}°C`;

                const dayIcon = document.createElement('img');
                dayIcon.classList.add('day-icon');
                const weatherMain = day.weather[0].main;
                switch (weatherMain) {
                    case 'Clear':
                        dayIcon.src = 'images/clear.png';
                        break;
                    case 'Rain':
                        dayIcon.src = 'images/rain.png';
                        break;
                    case 'Snow':
                        dayIcon.src = 'images/snow-storm.png';
                        break;
                    case 'Thunderstorm':
                        dayIcon.src = 'images/snow.png';
                        break;
                    case 'Clouds':
                        dayIcon.src = 'images/cloud.png';
                        break;
                    case 'Haze':
                    case 'Mist':
                        dayIcon.src = 'images/mist.png';
                        break;
                    case 'Mist':
                    dayIcon.src = 'images/mist.png';
                    break;
                    default:
                        dayIcon.src = '';
                }

                dayElement.appendChild(dayName);
                dayElement.appendChild(dayTemp);
                dayElement.appendChild(dayIcon);

                weekList.appendChild(dayElement);
            });
        })
        .catch(error => console.log("Error fetching forecast data:", error));
}

const outfitImages = {
    Clear: [
        { image: "images/tshirt.png", description: "T-shirt " },
        { image: "images/dress.png", description: "Light dress" },
        { image: "images/sneakers.png", description: "Shoes" }
    ],
    Rain: [
        { image: "images/raincoat.png", description: "Raincoat" },
        { image: "images/waterproof-shoes.png", description: "Waterproof shoes" },
        { image: "images/umbrella.png", description: "Umbrella" }
    ],
    Snow: [
        { image: "images/heavy-coat.png", description: "Heavy coat" },
        { image: "images/waterproof-shoes.png", description: "Boots" },
        { image: "images/gloves.png", description: "Scarf and gloves" }
    ],
    Clouds: [
        { image: "images/long-sleeve.png", description: "Long-sleeve shirt" },
        { image: "images/jeans.png", description: "Jeans" },
        { image: "images/light-jacket.png", description: "Light jacket" }
    ],
    Haze: [
        { image: "images/light-jacket.png", description: "Light jacket" },
        { image: "images/mask.png", description: "Breathable mask" }
    ],
    Mist: [
        { image: "images/light-jacket.png", description: "Light jacket" },
        { image: "images/mask.png", description: "Breathable mask" }
    ],
    Default: [
        { image: "images/casual.png", description: "Comfortable casual wear" }
    ]
};

const peripheralImages = {
    Clear: [
        { image: "images/sunglasses.png", description: "Sunglasses" },
        { image: "images/hat.png", description: "Hat" },
        { image: "images/sunscreen.png", description: "Sunscreen" }
    ],
    Rain: [
        { image: "images/umbrella.png", description: "Umbrella" },
        { image: "images/waterproof-shoes.png", description: "Rain Boots" },
        { image: "images/raincoat.png", description: "Raincoat" }
    ],
    Snow: [
        { image: "images/waterproof-shoes.png", description: "Snow Shoes" },
        { image: "images/gloves.png", description: "Snow Gloves and Scarf" }
    ],
    Clouds: [
        { image: "images/light-jacket.png", description: "Light Jacket" },
        { image: "images/jeans.png", description: "Jeans" },
        { image: "images/sneakers.png", description: "Shoes" }
    ],
    Haze: [
        { image: "images/mask.png", description: "Breathable Mask" },
        { image: "images/light-jacket.png", description: "Light Jacket" }
    ],
    Mist: [
        { image: "images/mask.png", description: "Breathable Mask" },
        { image: "images/light-jacket.png", description: "Light Jacket" }
    ],
    Default: [
        { image: "images/casual.png", description: "Comfortable Casual Wear" }
    ]
};

function getOutfitRecommendationByTemperature(temperature) {
    if (temperature >= 25) {
        return [
            { image: "images/tshirt.png", description: "T-shirt" },
            { image: "images/dress.png", description: "Light dress" },
            { image: "images/sunglasses.png", description: "Sunglasses" }
        ];
    } else if (temperature >= 15 && temperature < 25) {
        return [
            { image: "images/long-sleeve.png", description: "Long-sleeve shirt" },
            { image: "images/jeans.png", description: "Jeans" },
            { image: "images/light-jacket.png", description: "Light jacket" }
        ];
    } else if (temperature >= 5 && temperature < 15) {
        return [
            { image: "images/sweater.png", description: "Sweater" },
            { image: "images/coat.png", description: "Coat" },
            { image: "images/jeans.png", description: "Jeans" }
        ];
    } else {
        return [
            { image: "images/heavy-coat.png", description: "Heavy coat" },
            { image: "images/waterproof-shoes.png", description: "Boots" },
            { image: "images/gloves.png", description: "Scarf and gloves" }
        ];
    }
}

function showOutfits(weather, temperature) {
    const outfitList = document.querySelector('.outfit-list');
    outfitList.innerHTML = ''; 

    const weatherOutfits = outfitImages[weather] || outfitImages.Default;
    const tempOutfits = getOutfitRecommendationByTemperature(temperature);
    const recommendedOutfits = [...weatherOutfits, ...tempOutfits];

    recommendedOutfits.forEach(outfit => {
        const outfitItem = document.createElement('div');
        outfitItem.classList.add('outfit-item');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = outfit.description;
        checkbox.classList.add('outfit-checkbox');

        const outfitImage = document.createElement('img');
        outfitImage.src = outfit.image;
        outfitImage.alt = outfit.description;

        const outfitDescription = document.createElement('span');
        outfitDescription.innerText = outfit.description;

        outfitItem.appendChild(checkbox);
        outfitItem.appendChild(outfitImage);
        outfitItem.appendChild(outfitDescription);
        outfitList.appendChild(outfitItem);
    });
}

function showPeripherals(weather) {
    const peripheralList = document.querySelector('.peripheral-list');
    peripheralList.innerHTML = ''; 

    const recommendedPeripherals = peripheralImages[weather] || peripheralImages.Default;

    recommendedPeripherals.forEach(peripheral => {
        const peripheralItem = document.createElement('div');
        peripheralItem.classList.add('peripheral-item');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = peripheral.description;
        checkbox.classList.add('peripheral-checkbox');

        const peripheralImage = document.createElement('img');
        peripheralImage.src = peripheral.image;
        peripheralImage.alt = peripheral.description;

        const peripheralDescription = document.createElement('span');
        peripheralDescription.innerText = peripheral.description;

        peripheralItem.appendChild(checkbox);
        peripheralItem.appendChild(peripheralImage);
        peripheralItem.appendChild(peripheralDescription);
        peripheralList.appendChild(peripheralItem);
    });
}

function loadItinerary() {
    return JSON.parse(localStorage.getItem('itinerary')) || [];
}

// Save items to itinerary in localStorage
function saveToItinerary(item) {
    let itinerary = loadItinerary();
    const newItem = { id: Date.now(), ...item }; // Include description and peripherals
    itinerary.push(newItem);
    localStorage.setItem('itinerary', JSON.stringify(itinerary));
}

// Function to add selected outfits to itinerary
function addSelectedItemsToItinerary() {
    // Get selected outfits
    const selectedOutfits = Array.from(document.querySelectorAll('.outfit-recommendations .outfit-checkbox:checked'));

    // Create a descriptions array for outfits
    const outfitDescriptions = selectedOutfits.map(item => item.value).join(', ');

    if (outfitDescriptions) {
        // Show the peripheral recommendations section
        document.querySelector('.peripheral-recommendations').classList.remove('hidden');
        
        // Optionally, you can clear previous selections
        document.querySelectorAll('.peripheral-checkbox').forEach(checkbox => checkbox.checked = false);
        
        // Store the selected outfits in a variable to be used later
        window.selectedOutfits = outfitDescriptions;

        // Clear the outfit selection
        selectedOutfits.forEach(item => item.checked = false); // Clear the checkboxes
        alert("Outfits added! Now, please select your peripherals.");
    } else {
        alert("No outfits selected!");
    }
}

// Add event listener for the "Add Selected Outfits to Itinerary" button
document.querySelector('.outfit-recommendations .add-button').addEventListener('click', addSelectedItemsToItinerary);

// Handle adding peripherals to the itinerary
document.querySelector('.peripheral-recommendations .add-button').addEventListener('click', () => {
    // Get selected peripherals
    const selectedPeripherals = Array.from(document.querySelectorAll('.peripheral-recommendations .peripheral-checkbox:checked'));

    // Create a list of selected peripheral descriptions
    const peripheralItems = selectedPeripherals.map(item => item.value).join(', ') || 'No peripherals selected';

    // Create the itinerary item
    const itineraryItem = {
        description: window.selectedOutfits, // Use the stored outfits
        item: peripheralItems
    };

    // Save the itinerary item
    saveToItinerary(itineraryItem);
    alert("Selected items added to itinerary!");

    // Redirect to the itinerary page
    window.location.href = "itinerary.html"; 
});

// Initialize variable for selected outfits
window.selectedOutfits = ''; // Reset on page load

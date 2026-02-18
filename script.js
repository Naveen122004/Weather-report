// ===========================
// WEATHER APP - MAIN JAVASCRIPT
// ===========================

// API Configuration
const API_KEY = '741268beb456f6606cc270c4e2a45665';
const API_BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';
const GEOLOCATION_API_URL = 'https://api.openweathermap.org/geo/1.0/reverse';

// DOM Elements (will be populated after DOM loads)
let cityInput;
let searchBtn;
let geoBtn;
let themeBtn;
let weatherCard;
let errorMsg;
let loadingSpinner;
let closeBtn;
let locationName;
let temperature;
let condition;
let humidity;
let windSpeed;
let feelsLike;
let pressure;
let weatherIcon;
let timezone;
let coordinates;
let recentSearchesContainer;
let recentList;

// ===========================
// STATE MANAGEMENT
// ===========================

const state = {
    recentSearches: JSON.parse(localStorage.getItem('recentSearches')) || [],
    isDarkMode: localStorage.getItem('darkMode') === 'true',
    currentWeather: null,
};

// ===========================
// INITIALIZATION
// ===========================

/**
 * Get all DOM elements after page loads
 */
function initializeDOMElements() {
    // Input & Buttons
    cityInput = document.getElementById('cityInput');
    searchBtn = document.getElementById('searchBtn');
    geoBtn = document.getElementById('geoBtn');
    themeBtn = document.getElementById('themeBtn');
    closeBtn = document.getElementById('closeBtn');

    // Main containers
    weatherCard = document.getElementById('weatherCard');
    errorMsg = document.getElementById('errorMsg');
    loadingSpinner = document.getElementById('loadingSpinner');

    // Weather data display
    locationName = document.getElementById('location');
    temperature = document.getElementById('temperature');
    condition = document.getElementById('condition');
    humidity = document.getElementById('humidity');
    windSpeed = document.getElementById('windSpeed');
    feelsLike = document.getElementById('feelsLike');
    pressure = document.getElementById('pressure');
    weatherIcon = document.getElementById('weatherIcon');
    timezone = document.getElementById('timezone');
    coordinates = document.getElementById('coordinates');

    // Recent searches
    recentSearchesContainer = document.getElementById('recentSearches');
    recentList = document.getElementById('recentList');

    // Verify all elements loaded
    const allElements = [
        cityInput, searchBtn, geoBtn, themeBtn, weatherCard, errorMsg,
        loadingSpinner, closeBtn, locationName, temperature, condition,
        humidity, windSpeed, feelsLike, pressure, weatherIcon, timezone,
        coordinates, recentSearchesContainer, recentList
    ];

    const nullElements = allElements.filter(el => el === null);
    if (nullElements.length > 0) {
        console.warn('⚠️ Some DOM elements were not found');
    } else {
        console.log('✓ All DOM elements loaded successfully');
    }
}

/**
 * Initialize the app on page load
 */
function initializeApp() {
    // Initialize DOM elements first
    initializeDOMElements();

    // Check if critical elements exist
    if (!searchBtn || !geoBtn || !themeBtn) {
        console.error('❌ Critical UI elements not found. Page may not have loaded properly.');
        return;
    }

    // Apply dark mode if it was enabled
    if (state.isDarkMode) {
        enableDarkMode();
    }

    // Load and display recent searches
    updateRecentSearchesUI();

    // Add event listeners
    searchBtn.addEventListener('click', handleSearchWeather);
    geoBtn.addEventListener('click', handleGeolocation);
    themeBtn.addEventListener('click', toggleDarkMode);
    closeBtn.addEventListener('click', hideWeatherCard);
    cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearchWeather();
        }
    });

    console.log('✅ Weather App Initialized Successfully!');
}

// Run initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);

// ===========================
// WEATHER API FUNCTIONS
// ===========================

/**
 * Fetch weather data from API
 * @param {string} city - City name
 * @returns {Promise<Object>} Weather data
 */
async function fetchWeatherData(city) {
    try {
        // Validate input
        if (!city || city.trim() === '') {
            throw new Error('Please enter a city name');
        }

        // Show loading state
        showLoadingSpinner();
        hideErrorMessage();

        // Construct API URL
        const url = `${API_BASE_URL}?q=${encodeURIComponent(city.trim())}&appid=${API_KEY}&units=metric`;

        // Fetch data
        const response = await fetch(url);

        // Handle API errors
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error(`City "${city}" not found. Please check the spelling.`);
            } else if (response.status === 401) {
                throw new Error('API Key Error: Invalid or expired API key');
            } else {
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }
        }

        const data = await response.json();
        hideLoadingSpinner();

        return data;
    } catch (error) {
        hideLoadingSpinner();
        throw error;
    }
}

/**
 * Fetch weather data using coordinates (for geolocation)
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise<Object>} Weather data
 */
async function fetchWeatherByCoordinates(lat, lon) {
    try {
        const url = `${API_BASE_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Failed to fetch weather data from your location');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
}

// ===========================
// EVENT HANDLERS
// ===========================

/**
 * Handle weather search by city name
 */
async function handleSearchWeather() {
    const city = cityInput.value.trim();

    if (!city) {
        showErrorMessage('Please enter a city name');
        return;
    }

    try {
        const weatherData = await fetchWeatherData(city);
        displayWeatherData(weatherData);
        addToRecentSearches(weatherData.name);
        cityInput.value = '';
    } catch (error) {
        showErrorMessage(error.message);
        console.error('Weather Fetch Error:', error);
    }
}

/**
 * Handle geolocation request
 */
function handleGeolocation() {
    if (!navigator.geolocation) {
        showErrorMessage('Geolocation is not supported by your browser');
        return;
    }

    hideErrorMessage();
    showLoadingSpinner();

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            try {
                const { latitude, longitude } = position.coords;
                const data = await fetchWeatherByCoordinates(latitude, longitude);
                hideLoadingSpinner();
                displayWeatherData(data);
                addToRecentSearches(data.name);
                console.log('Geolocation Weather Fetched Successfully ✓');
            } catch (error) {
                hideLoadingSpinner();
                showErrorMessage(error.message);
                console.error('Geolocation Weather Error:', error);
            }
        },
        (error) => {
            hideLoadingSpinner();
            const errorMessages = {
                1: 'Location permission denied. Please enable location access.',
                2: 'Unable to retrieve your location. Please try again.',
                3: 'Geolocation request timeout. Please try again.',
            };
            showErrorMessage(errorMessages[error.code] || 'Geolocation error occurred');
            console.error('Geolocation Error:', error);
        },
        {
            enableHighAccuracy: false,
            timeout: 10000,
            maximumAge: 0,
        }
    );
}

// ===========================
// DISPLAY FUNCTIONS
// ===========================

/**
 * Display weather data on the UI
 * @param {Object} weatherData - Weather data from API
 */
function displayWeatherData(weatherData) {
    try {
        state.currentWeather = weatherData;

        // Extract data from API response
        const {
            name,
            sys: { country },
            main: { temp, feels_like, humidity: hum, pressure: pres },
            weather: [{ main, description, icon }],
            wind: { speed },
            coord: { lat, lon },
            timezone: tz,
        } = weatherData;

        // Update weather card
        locationName.textContent = `${name}, ${country}`;
        temperature.textContent = `${Math.round(temp)}°C`;
        condition.textContent = description;
        humidity.textContent = `${hum}%`;
        windSpeed.textContent = `${speed} m/s`;
        feelsLike.textContent = `${Math.round(feels_like)}°C`;
        pressure.textContent = `${pres} hPa`;
        coordinates.textContent = `${lat.toFixed(2)}°, ${lon.toFixed(2)}°`;

        // Set weather icon
        const iconUrl = `https://openweathermap.org/img/wn/${icon}@4x.png`;
        weatherIcon.src = iconUrl;
        weatherIcon.alt = description;

        // Format timezone
        timezone.textContent = formatTimezone(tz);

        // Show weather card with animation
        showWeatherCard();

        console.log('Weather Data Displayed Successfully ✓');
    } catch (error) {
        showErrorMessage('Error displaying weather data');
        console.error('Display Error:', error);
    }
}

/**
 * Format timezone offset to readable format
 * @param {number} offset - Timezone offset in seconds
 * @returns {string} Formatted timezone
 */
function formatTimezone(offset) {
    const hours = Math.floor(offset / 3600);
    const minutes = Math.abs((offset % 3600) / 60);
    const sign = hours >= 0 ? '+' : '';
    return `UTC${sign}${hours}:${minutes.toString().padStart(2, '0')}`;
}

// ===========================
// UI STATE FUNCTIONS
// ===========================

/**
 * Show weather card
 */
function showWeatherCard() {
    weatherCard.classList.remove('hidden');
    weatherCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * Hide weather card
 */
function hideWeatherCard() {
    weatherCard.classList.add('hidden');
}

/**
 * Show error message
 * @param {string} message - Error message
 */
function showErrorMessage(message) {
    errorMsg.textContent = `⚠️ ${message}`;
    errorMsg.classList.add('show');

    // Auto-hide error after 5 seconds
    setTimeout(() => {
        hideErrorMessage();
    }, 5000);
}

/**
 * Hide error message
 */
function hideErrorMessage() {
    errorMsg.classList.remove('show');
}

/**
 * Show loading spinner
 */
function showLoadingSpinner() {
    loadingSpinner.classList.remove('hidden');
}

/**
 * Hide loading spinner
 */
function hideLoadingSpinner() {
    loadingSpinner.classList.add('hidden');
}

// ===========================
// RECENT SEARCHES MANAGEMENT
// ===========================

/**
 * Add city to recent searches
 * @param {string} cityName - City name to add
 */
function addToRecentSearches(cityName) {
    // Remove duplicate if exists
    state.recentSearches = state.recentSearches.filter(
        (city) => city.toLowerCase() !== cityName.toLowerCase()
    );

    // Add to beginning
    state.recentSearches.unshift(cityName);

    // Keep only last 10 searches
    state.recentSearches = state.recentSearches.slice(0, 10);

    // Save to localStorage
    localStorage.setItem('recentSearches', JSON.stringify(state.recentSearches));

    // Update UI
    updateRecentSearchesUI();
}

/**
 * Update recent searches UI
 */
function updateRecentSearchesUI() {
    if (state.recentSearches.length === 0) {
        recentSearchesContainer.classList.add('hidden');
        return;
    }

    recentSearchesContainer.classList.remove('hidden');
    recentList.innerHTML = '';

    state.recentSearches.forEach((city) => {
        const item = document.createElement('button');
        item.className = 'recent-item';
        item.textContent = city;
        item.addEventListener('click', () => {
            cityInput.value = city;
            handleSearchWeather();
        });
        recentList.appendChild(item);
    });
}

// ===========================
// DARK MODE / THEME TOGGLE
// ===========================

/**
 * Toggle dark mode
 */
function toggleDarkMode() {
    state.isDarkMode = !state.isDarkMode;
    localStorage.setItem('darkMode', state.isDarkMode);

    if (state.isDarkMode) {
        enableDarkMode();
    } else {
        disableDarkMode();
    }
}

/**
 * Enable dark mode
 */
function enableDarkMode() {
    document.body.classList.add('dark-mode');
    themeBtn.textContent = '☀️ Light Mode';
    console.log('Dark Mode Enabled ✓');
}

/**
 * Disable dark mode (light mode)
 */
function disableDarkMode() {
    document.body.classList.remove('dark-mode');
    themeBtn.textContent = '🌙 Dark Mode';
    console.log('Light Mode Enabled ✓');
}

// ===========================
// UTILITY FUNCTIONS
// ===========================

/**
 * Clear all stored data (for development/testing)
 */
function clearAllData() {
    localStorage.removeItem('recentSearches');
    localStorage.removeItem('darkMode');
    state.recentSearches = [];
    state.isDarkMode = false;
    updateRecentSearchesUI();
    console.log('All data cleared ✓');
}

// ===========================
// ERROR TRACKING & LOGGING
// ===========================

/**
 * Log important events for debugging
 */
window.addEventListener('error', (event) => {
    console.error('Global Error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled Promise Rejection:', event.reason);
});

// ===========================
// ACCESSIBILITY ENHANCEMENTS
// ===========================

/**
 * Improve keyboard navigation
 */
document.addEventListener('keydown', (event) => {
    // ESC to close weather card
    if (event.key === 'Escape') {
        hideWeatherCard();
    }
});

// ===========================
// PERFORMANCE OPTIMIZATION
// ===========================

/**
 * Debounce function for input events
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Optional: Implement debounced search
 * Uncomment below to use with auto-complete feature
 */
// const debouncedSearch = debounce(handleSearchWeather, 500);
// cityInput.addEventListener('input', debouncedSearch);

// ===========================
// EXPORT FOR TESTING
// ===========================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        fetchWeatherData,
        fetchWeatherByCoordinates,
        displayWeatherData,
        addToRecentSearches,
        toggleDarkMode,
        clearAllData,
    };
}

console.log('Weather App Script Loaded Successfully ✓');

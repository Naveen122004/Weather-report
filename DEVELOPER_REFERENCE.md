# 🔧 Developer Quick Reference

## Function Quick Guide

### Core API Functions

#### `fetchWeatherData(city)`
Fetches weather for a city name
```javascript
const data = await fetchWeatherData('London');
console.log(data.main.temp); // Current temperature
```

#### `fetchWeatherByCoordinates(lat, lon)`
Fetches weather using latitude and longitude
```javascript
const data = await fetchWeatherByCoordinates(51.5074, -0.1278);
```

---

### Display Functions

#### `displayWeatherData(weatherData)`
Updates UI with weather information
```javascript
displayWeatherData(apiResponse);
```

#### `showWeatherCard()` / `hideWeatherCard()`
Show or hide the weather card
```javascript
showWeatherCard();
hideWeatherCard();
```

---

### Error & Loading

#### `showErrorMessage(message)`
Display error notification
```javascript
showErrorMessage('City not found');
```

#### `showLoadingSpinner()` / `hideLoadingSpinner()`
Control loading state
```javascript
showLoadingSpinner();
// ... do work ...
hideLoadingSpinner();
```

---

### Recent Searches

#### `addToRecentSearches(cityName)`
Add city to recent searches history
```javascript
addToRecentSearches('Paris');
```

#### `updateRecentSearchesUI()`
Refresh recent searches display
```javascript
updateRecentSearchesUI();
```

---

### Theme Functions

#### `toggleDarkMode()`
Toggle between light and dark theme
```javascript
toggleDarkMode();
```

#### `enableDarkMode()` / `disableDarkMode()`
Directly set theme
```javascript
enableDarkMode();
disableDarkMode();
```

---

## DOM Element References

```javascript
// Input & Buttons
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const geoBtn = document.getElementById('geoBtn');
const themeBtn = document.getElementById('themeBtn');

// Display Areas
const weatherCard = document.getElementById('weatherCard');
const errorMsg = document.getElementById('errorMsg');
const loadingSpinner = document.getElementById('loadingSpinner');

// Weather Data Elements
const location = document.getElementById('location');
const temperature = document.getElementById('temperature');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('windSpeed');
// ... and more
```

---

## CSS Classes for Styling

```css
/* Main Container */
.container { }
.header { }
.controls-section { }

/* Weather Display */
.weather-card { }
.weather-main { }
.weather-details { }
.detail-item { }

/* Buttons */
.btn { }
.btn-primary { }
.btn-secondary { }
.btn-theme { }

/* States */
.hidden { display: none; }
.show { display: block; }

/* Theme */
body.dark-mode { }
```

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Enter` | Search weather (if input focused) |
| `Escape` | Close weather card |
| `Tab` | Navigate between buttons |

---

## LocalStorage Keys

```javascript
// Each stored with JSON.stringify()
localStorage.getItem('recentSearches'); // Array of cities
localStorage.getItem('darkMode');      // Boolean

// Clear all
localStorage.clear();
```

---

## Event Listeners Used

```javascript
// Search
searchBtn.addEventListener('click', handleSearchWeather);
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSearchWeather();
});

// Geolocation
geoBtn.addEventListener('click', handleGeolocation);

// Theme
themeBtn.addEventListener('click', toggleDarkMode);

// Close
closeBtn.addEventListener('click', hideWeatherCard);

// Global
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') hideWeatherCard();
});
```

---

## Common API Response Format

```javascript
{
    name: "London",
    sys: { country: "GB" },
    main: {
        temp: 15.2,
        feels_like: 14.8,
        humidity: 65,
        pressure: 1013
    },
    weather: [{
        main: "Cloudy",
        description: "overcast clouds",
        icon: "04d"
    }],
    wind: { speed: 4.5 },
    coord: { lat: 51.5074, lon: -0.1278 },
    timezone: 0
}
```

---

## Useful JavaScript Tips

### Get Weather for Multiple Cities
```javascript
const cities = ['London', 'Paris', 'Tokyo'];
const weatherData = await Promise.all(
    cities.map(city => fetchWeatherData(city))
);
```

### Convert Kelvin to Celsius
```javascript
const celsius = kelvin - 273.15;
```

### Format Temperature
```javascript
const formatted = Math.round(temp); // Round to whole number
```

### Check If Item in Recent Searches
```javascript
const exists = state.recentSearches.some(
    city => city.toLowerCase() === searchTerm.toLowerCase()
);
```

---

## CSS Tips for Customization

### Change Primary Color
```css
:root {
    --primary-color: #your-color;
}
```

### Adjust Animation Speed
```css
element {
    transition: all 0.5s ease; /* Change 0.3s to any value */
}
```

### Modify Gradient
```css
body {
    background: linear-gradient(135deg, #color1 0%, #color2 100%);
}
```

### Add Custom Font
```css
@import url('https://fonts.googleapis.com/css2?family=Your+Font');

body {
    font-family: 'Your Font', sans-serif;
}
```

---

## Debugging Commands (Console)

```javascript
// View current state
console.log(state);

// Clear recent searches
clearAllData();

// Check localStorage
console.log(localStorage);

// Test API call
fetchWeatherData('London').then(console.log);

// Get all error messages
document.querySelectorAll('.error-message');

// Manually trigger dark mode
toggleDarkMode();
```

---

## API Endpoints

### Current Weather
```
https://api.openweathermap.org/data/2.5/weather?q={city}&appid={key}&units=metric
```

### 5-Day Forecast
```
https://api.openweathermap.org/data/2.5/forecast?q={city}&appid={key}&units=metric
```

### By Coordinates
```
https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={key}&units=metric
```

---

## Performance Tips

1. **Debounce Input**: Use debounce for frequent events
2. **Cache Results**: Store API responses in state
3. **Lazy Load**: Load images only when visible
4. **Minimize Reflows**: Batch DOM updates
5. **Use CSS Transitions**: Instead of JavaScript animations

---

## Testing Checklist

- [ ] Search functionality works
- [ ] Error messages display correctly
- [ ] Loading spinner shows during fetch
- [ ] Weather card displays with animation
- [ ] Recent searches save and load
- [ ] Dark mode toggles and persists
- [ ] Geolocation works with permission
- [ ] Mobile layout responsive
- [ ] Keyboard navigation works
- [ ] No console errors

---

## Common Issues & Fixes

**API not returning data**
```javascript
// Check response status
if (!response.ok) {
    console.error('HTTP Error:', response.status);
}
```

**LocalStorage not saving**
```javascript
// Verify localStorage is enabled
if (typeof Storage !== 'undefined') {
    localStorage.setItem('key', 'value');
}
```

**Styling not applying**
```javascript
// Force recompute
document.body.offsetHeight; // Trigger reflow
```

---

## Useful Plugins/Tools

- **DevTools ExtensionS**: React DevTools, Redux DevTools
- **Code Formatters**: Prettier, ESLint
- **Testing**: Jest, Cypress
- **Bundlers**: Webpack, Esbuild
- **Task Runners**: Gulp, Grunt

---

## Documentation Links

- [MDN Web Docs](https://developer.mozilla.org/)
- [OpenWeatherMap API](https://openweathermap.org/api)
- [Geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API)
- [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [LocalStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [CSS Animations](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations)

---

**Last Updated**: February 18, 2026

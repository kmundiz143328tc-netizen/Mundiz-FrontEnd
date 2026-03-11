import axios from 'axios';

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

const weatherClient = axios.create({ baseURL: BASE_URL });

/**
 * Get current weather by city name
 */
export const getCurrentWeather = async (city) => {
    const res = await weatherClient.get('/weather', {
        params: { q: city, appid: API_KEY, units: 'metric' },
    });
    return res.data;
};

/**
 * Get current weather by coordinates (geolocation)
 */
export const getWeatherByCoords = async (lat, lon) => {
    const res = await weatherClient.get('/weather', {
        params: { lat, lon, appid: API_KEY, units: 'metric' },
    });
    return res.data;
};

/**
 * Get 5-day forecast (3-hour intervals)
 */
export const getForecast = async (city) => {
    const res = await weatherClient.get('/forecast', {
        params: { q: city, appid: API_KEY, units: 'metric' },
    });
    // Group forecast by day
    const daily = {};
    res.data.list.forEach((item) => {
        const day = item.dt_txt.split(' ')[0];
        if (!daily[day]) daily[day] = [];
        daily[day].push(item);
    });
    return Object.entries(daily).slice(0, 5).map(([date, items]) => {
        const temps = items.map((i) => i.main.temp);
        return {
            date,
            temp_min: Math.min(...temps).toFixed(1),
            temp_max: Math.max(...temps).toFixed(1),
            description: items[0].weather[0].description,
            icon: items[0].weather[0].icon,
            humidity: items[0].main.humidity,
            wind_speed: items[0].wind.speed,
        };
    });
};

/**
 * Get weather icon URL from icon code
 */
export const getIconUrl = (icon) =>
    `https://openweathermap.org/img/wn/${icon}@2x.png`;
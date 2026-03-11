import { useState, useEffect } from 'react';
import { getCurrentWeather, getForecast, getWeatherByCoords, getIconUrl } from '../../services/weatherApi';
import ForecastDisplay from './ForecastDisplay';

const WeatherWidget = () => {
    const [weather, setWeather] = useState(null);
    const [forecast, setForecast] = useState([]);
    const [city, setCity] = useState('Davao City');
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchWeather = async (cityName) => {
        setLoading(true);
        setError('');
        try {
            const [w, f] = await Promise.all([
                getCurrentWeather(cityName),
                getForecast(cityName),
            ]);
            setWeather(w);
            setForecast(f);
        } catch (err) {
            if (err.response?.status === 404) {
                setError(`City "${cityName}" not found. Try another city.`);
            } else if (err.response?.status === 401) {
                setError('Invalid API key. Please check your VITE_WEATHER_API_KEY in .env');
            } else {
                setError('Failed to fetch weather. Check your API key and internet connection.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGeoLocation = () => {
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser.');
            return;
        }
        setLoading(true);
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                try {
                    const w = await getWeatherByCoords(pos.coords.latitude, pos.coords.longitude);
                    setCity(w.name);
                    const f = await getForecast(w.name);
                    setWeather(w);
                    setForecast(f);
                } catch {
                    setError('Could not get weather for your location.');
                } finally {
                    setLoading(false);
                }
            },
            () => {
                setError('Location access denied.');
                setLoading(false);
            }
        );
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (input.trim()) {
            setCity(input.trim());
            fetchWeather(input.trim());
            setInput('');
        }
    };

    useEffect(() => {
        fetchWeather(city);
    }, []);

    const getWeatherBg = (main) => {
        const map = {
            Clear: 'from-yellow-400 to-orange-400',
            Clouds: 'from-gray-400 to-blue-400',
            Rain: 'from-blue-500 to-blue-700',
            Drizzle: 'from-blue-400 to-cyan-500',
            Thunderstorm: 'from-gray-700 to-gray-900',
            Snow: 'from-blue-100 to-white',
            Mist: 'from-gray-300 to-gray-500',
            Fog: 'from-gray-300 to-gray-500',
        };
        return map[main] || 'from-blue-500 to-blue-700';
    };

    return (
        <div className="space-y-6">
            {/* Search Bar */}
            <div className="bg-white rounded-xl shadow-md p-4">
                <form onSubmit={handleSearch} className="flex gap-3">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Search city (e.g. Manila, Cebu City)..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition"
                    >
                        🔍 Search
                    </button>
                    <button
                        type="button"
                        onClick={handleGeoLocation}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium transition"
                        title="Use my location"
                    >
                        📍 My Location
                    </button>
                </form>
            </div>

            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {error}
                </div>
            )}

            {loading && (
                <div className="bg-white rounded-xl shadow-md p-12 flex items-center justify-center">
                    <div className="text-center text-gray-500">
                        <div className="animate-spin text-4xl mb-2">🌀</div>
                        <p>Fetching weather...</p>
                    </div>
                </div>
            )}

            {weather && !loading && (
                <div className={`bg-gradient-to-br ${getWeatherBg(weather.weather[0].main)} rounded-xl shadow-md p-6 text-white`}>
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-2xl font-bold">{weather.name}, {weather.sys.country}</h2>
                            <p className="text-white/80 capitalize">{weather.weather[0].description}</p>
                        </div>
                        <img
                            src={getIconUrl(weather.weather[0].icon)}
                            alt={weather.weather[0].description}
                            className="w-16 h-16"
                        />
                    </div>

                    <div className="flex items-end gap-2 mb-6">
                        <span className="text-6xl font-light">{Math.round(weather.main.temp)}°</span>
                        <span className="text-2xl mb-2">C</span>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="bg-white/20 rounded-lg p-3 text-center">
                            <p className="text-white/70">Feels Like</p>
                            <p className="text-xl font-semibold">{Math.round(weather.main.feels_like)}°C</p>
                        </div>
                        <div className="bg-white/20 rounded-lg p-3 text-center">
                            <p className="text-white/70">Humidity</p>
                            <p className="text-xl font-semibold">{weather.main.humidity}%</p>
                        </div>
                        <div className="bg-white/20 rounded-lg p-3 text-center">
                            <p className="text-white/70">Wind</p>
                            <p className="text-xl font-semibold">{weather.wind.speed} m/s</p>
                        </div>
                    </div>
                </div>
            )}

            {forecast.length > 0 && !loading && (
                <ForecastDisplay forecast={forecast} />
            )}
        </div>
    );
};

export default WeatherWidget;
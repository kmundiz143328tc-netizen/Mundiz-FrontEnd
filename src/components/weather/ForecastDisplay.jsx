import { getIconUrl } from '../../services/weatherApi';

const ForecastDisplay = ({ forecast }) => {
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    };

    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">📅 5-Day Forecast</h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {forecast.map((day, index) => (
                    <div
                        key={index}
                        className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-center hover:shadow-md transition"
                    >
                        <p className="text-xs font-medium text-gray-600 mb-1">{formatDate(day.date)}</p>
                        <img
                            src={getIconUrl(day.icon)}
                            alt={day.description}
                            className="w-10 h-10 mx-auto"
                        />
                        <p className="text-xs text-gray-500 capitalize mb-2">{day.description}</p>
                        <div className="flex justify-center gap-1 text-sm">
                            <span className="text-blue-700 font-semibold">{day.temp_min}°</span>
                            <span className="text-gray-400">/</span>
                            <span className="text-red-500 font-semibold">{day.temp_max}°</span>
                        </div>
                        <div className="mt-2 text-xs text-gray-400 space-y-0.5">
                            <p>💧 {day.humidity}%</p>
                            <p>💨 {day.wind_speed} m/s</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ForecastDisplay;
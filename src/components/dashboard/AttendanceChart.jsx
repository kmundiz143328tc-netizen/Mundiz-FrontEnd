import { useState, useEffect } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
    Legend, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import api from '../../services/api';

const AttendanceChart = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        api.get('/dashboard/attendance-trends')
            .then(res => {
                // Show every 5th data point to avoid overcrowding
                const sampled = res.data.filter((_, i) => i % 5 === 0);
                setData(sampled);
            })
            .catch(() => setError('Failed to load attendance data'))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="h-64 flex items-center justify-center">
            <div className="animate-pulse text-gray-400">Loading chart...</div>
        </div>
    );

    if (error) return (
        <div className="h-64 flex items-center justify-center text-red-500 text-sm">{error}</div>
    );

    return (
        <>
            <div className="mb-4 flex gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                    <span className="inline-block w-4 h-0.5 bg-blue-500"></span> Attendance Rate (%)
                </span>
            </div>
            <ResponsiveContainer width="100%" height={350}>
                <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                        dataKey="date"
                        tick={{ fontSize: 11 }}
                        angle={-45}
                        textAnchor="end"
                        interval={4}
                    />
                    <YAxis domain={[60, 100]} tick={{ fontSize: 11 }} unit="%" />
                    <Tooltip
                        contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                        formatter={(value, name) => [
                            name === 'attendance_rate' ? `${value}%` : value,
                            name === 'attendance_rate' ? 'Attendance Rate' : name,
                        ]}
                    />
                    <Legend verticalAlign="top" />
                    <ReferenceLine y={80} stroke="#f59e0b" strokeDasharray="5 5" label={{ value: '80% target', position: 'right', fontSize: 11 }} />
                    <Line
                        type="monotone"
                        dataKey="attendance_rate"
                        name="Attendance Rate"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 5 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </>
    );
};

export default AttendanceChart;
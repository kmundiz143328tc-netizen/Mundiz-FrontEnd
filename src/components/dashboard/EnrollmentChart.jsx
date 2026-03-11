import { useState, useEffect } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import api from '../../services/api';

const EnrollmentChart = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        api.get('/dashboard/enrollment-trends')
            .then(res => setData(res.data))
            .catch(() => setError('Failed to load enrollment data'))
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
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                    dataKey="month"
                    tick={{ fontSize: 11 }}
                    angle={-45}
                    textAnchor="end"
                    interval={0}
                />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                    formatter={(value) => [`${value} students`, 'Enrolled']}
                />
                <Legend verticalAlign="top" />
                <Bar dataKey="students" name="Students Enrolled" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default EnrollmentChart;
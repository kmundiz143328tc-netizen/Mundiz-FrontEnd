import { useState, useEffect } from 'react';
import {
    PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import api from '../../services/api';

const COLORS = [
    '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
    '#06b6d4', '#f97316', '#84cc16', '#ec4899', '#14b8a6',
    '#a855f7', '#6366f1', '#fb923c', '#22d3ee', '#4ade80',
    '#fbbf24', '#f43f5e', '#0ea5e9', '#d946ef', '#34d399',
];

const RADIAN = Math.PI / 180;
const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    if (percent < 0.04) return null;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
        <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight="bold">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

const CourseDistributionChart = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        api.get('/dashboard/course-distribution')
            .then(res => setData(res.data))
            .catch(() => setError('Failed to load course data'))
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
        <ResponsiveContainer width="100%" height={320}>
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="45%"
                    outerRadius={110}
                    labelLine={false}
                    label={renderCustomLabel}
                    dataKey="value"
                    nameKey="name"
                >
                    {data.map((_, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip
                    contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                    formatter={(value, name) => [`${value} students`, name]}
                />
                <Legend
                    formatter={(value, entry) => (
                        <span style={{ fontSize: '11px', color: '#374151' }}>
                            {entry.payload.label || value}
                        </span>
                    )}
                />
            </PieChart>
        </ResponsiveContainer>
    );
};

export default CourseDistributionChart;
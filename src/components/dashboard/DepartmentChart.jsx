import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import api from '../../services/api';

const DepartmentChart = ({ darkMode }) => {
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard/department-stats')
      .then(res => setData(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className={`h-64 flex items-center justify-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-400'}`}>Loading...</div>;

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: -15, bottom: 60 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#f0f0f0'} />
        <XAxis dataKey="department" tick={{ fontSize: 9, fill: darkMode ? '#9ca3af' : '#6b7280' }} angle={-35} textAnchor="end" interval={0} />
        <YAxis tick={{ fontSize: 10, fill: darkMode ? '#9ca3af' : '#6b7280' }} />
        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', backgroundColor: darkMode ? '#1f2937' : '#fff', color: darkMode ? '#f9fafb' : '#111827', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', fontSize: '12px' }} />
        <Legend verticalAlign="top" wrapperStyle={{ fontSize: '11px' }} />
        <Bar dataKey="total"     name="Total"     fill="#3b82f6" radius={[4,4,0,0]} maxBarSize={30} />
        <Bar dataKey="active"    name="Active"    fill="#10b981" radius={[4,4,0,0]} maxBarSize={30} />
        <Bar dataKey="graduated" name="Graduated" fill="#8b5cf6" radius={[4,4,0,0]} maxBarSize={30} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default DepartmentChart;
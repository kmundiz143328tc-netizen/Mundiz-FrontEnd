import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import api from '../../services/api';

const CustomTooltip = ({ active, payload, label, darkMode }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className={`px-4 py-3 rounded-xl shadow-xl text-sm border
      ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-800'}`}>
      <p className="font-bold mb-1">📅 {label}</p>
      <p className="text-blue-400 font-semibold">👩‍🎓 {payload[0].value} new students</p>
    </div>
  );
};

const COLORS = [
  '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7',
  '#ec4899', '#f43f5e', '#f97316', '#eab308',
  '#22c55e', '#14b8a6', '#06b6d4', '#0ea5e9',
];

const EnrollmentChart = ({ darkMode }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard/enrollment-trends')
      .then(r => {
        // Filter out bad seeder dates (before year 2020)
        const filtered = r.data.filter(d => {
          const year = parseInt(d.month?.split(' ')[1]);
          return year >= 2020;
        });
        setData(filtered.length ? filtered : r.data);
      })
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, []);

  const axisColor = darkMode ? '#9ca3af' : '#6b7280';
  const gridColor = darkMode ? '#374151' : '#f3f4f6';

  if (loading) return (
    <div className="flex items-center justify-center h-48">
      <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!data.length) return (
    <div className={`flex items-center justify-center h-48 text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
      No enrollment data yet
    </div>
  );

  return (
    <div>
      <p className={`text-xs mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        📊 Each bar = new students enrolled that month
      </p>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 18, right: 10, left: -10, bottom: 5 }} barCategoryGap="35%">
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 10, fill: axisColor }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 10, fill: axisColor }} tickLine={false} axisLine={false} />
          <Tooltip content={<CustomTooltip darkMode={darkMode} />}
            cursor={{ fill: darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)' }} />
          <Bar dataKey="students" radius={[8, 8, 0, 0]} maxBarSize={52}>
            {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            <LabelList dataKey="students" position="top"
              style={{ fontSize: 10, fill: axisColor, fontWeight: 700 }} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="flex items-center gap-2 mt-2 flex-wrap">
        {data.slice(0, 4).map((d, i) => (
          <div key={i} className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm" style={{ background: COLORS[i % COLORS.length] }} />
            <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{d.month}: {d.students}</span>
          </div>
        ))}
        {data.length > 4 && <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>+{data.length - 4} more</span>}
      </div>
    </div>
  );
};

export default EnrollmentChart;
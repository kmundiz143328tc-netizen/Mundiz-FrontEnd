import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Area, AreaChart } from 'recharts';
import api from '../../services/api';

const CustomTooltip = ({ active, payload, label, darkMode }) => {
  if (!active || !payload?.length) return null;
  const rate = payload[0]?.value;
  const color = rate >= 90 ? '#22c55e' : rate >= 75 ? '#eab308' : '#ef4444';
  return (
    <div className={`px-4 py-3 rounded-xl shadow-xl text-sm border
      ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-800'}`}>
      <p className="font-bold mb-1">📅 {label}</p>
      <p style={{ color }} className="font-semibold">
        {rate >= 90 ? '✅' : rate >= 75 ? '⚠️' : '❌'} {rate}% attendance
      </p>
      {payload[1] && <p className="text-blue-400 text-xs mt-0.5">👥 {payload[1].value} present</p>}
    </div>
  );
};

const AttendanceChart = ({ darkMode }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [avg, setAvg] = useState(0);

  useEffect(() => {
    api.get('/dashboard/attendance-trends')
      .then(r => {
        const formatted = r.data.slice(-30).map(d => ({
          date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          rate: parseFloat(d.attendance_rate) || 0,
          present: d.students_present || 0,
          absent: d.students_absent || 0,
        }));
        setData(formatted);
        const a = formatted.reduce((s, d) => s + d.rate, 0) / (formatted.length || 1);
        setAvg(Math.round(a * 10) / 10);
      })
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, []);

  const axisColor = darkMode ? '#9ca3af' : '#6b7280';
  const gridColor = darkMode ? '#374151' : '#f3f4f6';

  const avgColor = avg >= 90 ? '#22c55e' : avg >= 75 ? '#eab308' : '#ef4444';
  const lineColor = '#3b82f6';

  if (loading) return (
    <div className="flex items-center justify-center h-48">
      <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!data.length) return (
    <div className={`flex items-center justify-center h-48 text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
      No attendance data yet
    </div>
  );

  return (
    <div>
      {/* Summary pills */}
      <div className="flex flex-wrap gap-2 mb-3">
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold
          ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
          style={{ color: avgColor }}>
          📊 Avg: {avg}%
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400`}>
          ✅ Good: ≥90%
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400`}>
          ⚠️ Warning: 75–89%
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400`}>
          ❌ Low: &lt;75%
        </div>
      </div>

      <p className={`text-xs mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        📈 Last 30 class days — dashed line shows your average
      </p>

      <ResponsiveContainer width="100%" height={230}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 5 }}>
          <defs>
            <linearGradient id="attendGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={lineColor} stopOpacity={0.25} />
              <stop offset="95%" stopColor={lineColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
          <XAxis dataKey="date" tick={{ fontSize: 9, fill: axisColor }} tickLine={false} axisLine={false}
            interval={Math.floor(data.length / 5)} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: axisColor }} tickLine={false} axisLine={false}
            tickFormatter={v => `${v}%`} />
          <Tooltip content={<CustomTooltip darkMode={darkMode} />} />
          <ReferenceLine y={avg} stroke={avgColor} strokeDasharray="5 3" strokeWidth={1.5}
            label={{ value: `Avg ${avg}%`, position: 'right', fontSize: 10, fill: avgColor }} />
          <ReferenceLine y={75} stroke="#ef4444" strokeDasharray="3 3" strokeWidth={1} opacity={0.5} />
          <Area type="monotone" dataKey="rate" stroke={lineColor} strokeWidth={2.5}
            fill="url(#attendGrad)" dot={false} activeDot={{ r: 5, fill: lineColor }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AttendanceChart;
import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import api from '../../services/api';

const COLORS = [
  '#3b82f6', '#6366f1', '#8b5cf6', '#ec4899',
  '#f43f5e', '#f97316', '#eab308', '#22c55e',
  '#14b8a6', '#06b6d4', '#0ea5e9', '#a855f7',
];

const CustomTooltip = ({ active, payload, darkMode }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  const total = d.payload.total;
  const pct = total ? ((d.value / total) * 100).toFixed(1) : 0;
  return (
    <div className={`px-4 py-3 rounded-xl shadow-xl text-sm border
      ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-800'}`}>
      <p className="font-bold mb-1">{d.payload.label || d.name}</p>
      <p style={{ color: d.payload.fill }} className="font-semibold">👩‍🎓 {d.value} students</p>
      <p className={`text-xs mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{pct}% of total</p>
    </div>
  );
};

const CustomLegend = ({ data, darkMode }) => (
  <div className="flex flex-col gap-1.5 mt-2 max-h-28 overflow-y-auto pr-1">
    {data.map((d, i) => (
      <div key={i} className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
        <span className={`text-xs truncate ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {d.name} <span className="font-semibold">({d.value})</span>
        </span>
      </div>
    ))}
  </div>
);

const CourseDistributionChart = ({ darkMode }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard/course-distribution')
      .then(r => {
        const total = r.data.reduce((s, d) => s + d.value, 0);
        setData(r.data.map(d => ({ ...d, total })));
      })
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-48">
      <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!data.length) return (
    <div className={`flex items-center justify-center h-48 text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
      No course data yet
    </div>
  );

  const pieData = data.map((d, i) => ({ ...d, fill: COLORS[i % COLORS.length] }));
  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div>
      <p className={`text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        🥧 Each slice = students enrolled in that course
      </p>
      <div className="flex flex-col sm:flex-row gap-2 items-center">
        <div className="w-full sm:w-48 shrink-0">
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={75}
                paddingAngle={3} dataKey="value" strokeWidth={0}>
                {pieData.map((d, i) => <Cell key={i} fill={d.fill} />)}
              </Pie>
              <Tooltip content={<CustomTooltip darkMode={darkMode} />} />
            </PieChart>
          </ResponsiveContainer>
          {/* Center label */}
          <p className={`text-center -mt-2 text-xs font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {total} total
          </p>
        </div>
        <CustomLegend data={pieData} darkMode={darkMode} />
      </div>
    </div>
  );
};

export default CourseDistributionChart;
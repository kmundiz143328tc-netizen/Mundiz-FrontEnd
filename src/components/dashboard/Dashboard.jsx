import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import api from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';
import EnrollmentChart from './EnrollmentChart';
import CourseDistributionChart from './CourseDistributionChart';
import AttendanceChart from './AttendanceChart';
import DepartmentChart from './DepartmentChart';
import WeatherWidget from '../weather/WeatherWidget';

// Animated stat card
const StatCard = ({ title, value, icon, colorClass, subtitle, darkMode, onClick }) => {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!value && value !== 0) return;
    const target = parseFloat(value);
    if (isNaN(target)) return;
    let start = 0;
    const step = target / 60;
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setDisplay(target); clearInterval(timer); }
      else setDisplay(parseFloat(start.toFixed(1)));
    }, 16);
    return () => clearInterval(timer);
  }, [value]);

  const isPercent = typeof value === 'string' && value.includes('%');
  const shown = isPercent ? `${display}%` : Math.round(display).toLocaleString();

  return (
    <div onClick={onClick}
      className={`rounded-2xl p-5 border-l-4 ${colorClass} shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md
        ${darkMode ? 'bg-gray-800' : 'bg-white'} ${onClick ? 'cursor-pointer' : ''}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{title}</p>
          <p className={`text-3xl font-bold mt-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>{shown ?? '—'}</p>
          {subtitle && <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{subtitle}</p>}
        </div>
        <span className="text-3xl">{icon}</span>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [anns,    setAnns]    = useState([]);
  const [tab,     setTab]     = useState('overview');

  useEffect(() => {
    Promise.all([
      api.get('/dashboard/stats'),
      api.get('/announcements'),
    ]).then(([sRes, aRes]) => {
      setStats(sRes.data);
      setAnns(aRes.data.slice(0, 3));
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <LoadingSpinner message="Loading dashboard..." />
    </div>
  );

  const tabs = [
    { id: 'overview',    icon: '📊', label: 'Overview' },
    { id: 'departments', icon: '🏫', label: 'Departments' },
    { id: 'attendance',  icon: '📅', label: 'Attendance' },
    { id: 'weather',     icon: '🌤', label: 'Weather' },
  ];

  const priorityColor = { urgent: 'border-l-red-500', high: 'border-l-orange-400', normal: 'border-l-blue-400', low: 'border-l-gray-300' };

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Welcome back, {user?.name?.split(' ')[0]} 👋
          </h2>
          <p className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Here's what's happening in your school today.
          </p>
        </div>
        {/* Quick export button */}
        <button
          onClick={() => navigate('/students')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition">
          🎓 View All Students
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Total Students"  value={stats?.total_students}  icon="🎓" colorClass="border-l-blue-500"   subtitle={`${stats?.active_students} active`} darkMode={darkMode} onClick={() => navigate('/students')} />
        <StatCard title="Active Students" value={stats?.active_students} icon="✅" colorClass="border-l-green-500"  darkMode={darkMode} onClick={() => navigate('/students')} />
        <StatCard title="Courses Offered" value={stats?.total_courses}   icon="📚" colorClass="border-l-purple-500" darkMode={darkMode} onClick={() => navigate('/courses')} />
        <StatCard title="Avg. Attendance" value={stats?.avg_attendance ? `${stats.avg_attendance}%` : null} icon="📅" colorClass="border-l-yellow-500" subtitle={`${stats?.total_school_days} school days`} darkMode={darkMode} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Charts + tabs - left 2/3 */}
        <div className="xl:col-span-2 space-y-5">
          {/* Tabs */}
          <div className={`flex gap-1 p-1 rounded-xl w-fit ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg transition-all duration-200
                  ${tab === t.id ? 'bg-blue-600 text-white shadow' : darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-800'}`}>
                <span>{t.icon}</span>
                <span className="hidden sm:inline">{t.label}</span>
              </button>
            ))}
          </div>

          {tab === 'overview' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className={`rounded-2xl shadow-sm p-5 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <h3 className={`text-sm font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>📈 Monthly Enrollment</h3>
                <EnrollmentChart darkMode={darkMode} />
              </div>
              <div className={`rounded-2xl shadow-sm p-5 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <h3 className={`text-sm font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>🥧 Course Distribution</h3>
                <CourseDistributionChart darkMode={darkMode} />
              </div>
            </div>
          )}

          {tab === 'departments' && (
            <div className={`rounded-2xl shadow-sm p-5 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h3 className={`text-sm font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>🏫 Students by Department</h3>
              <DepartmentChart darkMode={darkMode} />
            </div>
          )}

          {tab === 'attendance' && (
            <div className={`rounded-2xl shadow-sm p-5 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h3 className={`text-sm font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>📉 Attendance Patterns</h3>
              <AttendanceChart darkMode={darkMode} />
            </div>
          )}

          {tab === 'weather' && <WeatherWidget darkMode={darkMode} />}
        </div>

        {/* Right - Announcements */}
        <div className="space-y-4">
          <div className={`rounded-2xl shadow-sm p-5 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>📢 Latest Announcements</h3>
              <button onClick={() => navigate('/announcements')}
                className="text-xs text-blue-500 hover:text-blue-600 font-medium">View all →</button>
            </div>
            {anns.length === 0 ? (
              <div className={`text-center py-6 text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                No announcements yet
                <div className="mt-2">
                  <button onClick={() => navigate('/announcements')}
                    className="text-xs text-blue-500 hover:underline">+ Post one</button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {anns.map(ann => (
                  <div key={ann.id}
                    className={`p-3 rounded-xl border-l-4 ${priorityColor[ann.priority] || 'border-l-blue-400'}
                      ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                    {ann.is_pinned && <span className="text-xs text-yellow-500 font-medium">📌 Pinned</span>}
                    <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{ann.title}</p>
                    <p className={`text-xs mt-1 line-clamp-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{ann.content}</p>
                    <p className={`text-xs mt-1.5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      {new Date(ann.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick links */}
          <div className={`rounded-2xl shadow-sm p-5 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className={`text-sm font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>⚡ Quick Actions</h3>
            <div className="space-y-2">
              {[
                { label: 'Add New Student',    icon: '➕', path: '/students' },
                { label: 'View Calendar',      icon: '📅', path: '/calendar' },
                { label: 'Post Announcement',  icon: '📢', path: '/announcements' },
                { label: 'Activity Log',       icon: '📋', path: '/activity-log' },
              ].map(q => (
                <button key={q.path} onClick={() => navigate(q.path)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition
                    ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-50'}`}>
                  <span>{q.icon}</span> {q.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
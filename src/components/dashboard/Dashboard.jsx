import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import Navbar from '../common/Navbar';
import LoadingSpinner from '../common/LoadingSpinner';
import EnrollmentChart from './EnrollmentChart';
import CourseDistributionChart from './CourseDistributionChart';
import AttendanceChart from './AttendanceChart';
import WeatherWidget from '../weather/WeatherWidget';

const StatCard = ({ title, value, icon, color, subtitle }) => (
    <div className={`bg-white rounded-xl shadow-md p-6 border-l-4 ${color}`}>
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{value?.toLocaleString() ?? '—'}</p>
                {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
            </div>
            <div className="text-4xl">{icon}</div>
        </div>
    </div>
);

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [error, setError] = useState('');

    useEffect(() => {
        api.get('/dashboard/stats')
            .then(res => setStats(res.data))
            .catch(() => setError('Failed to load dashboard stats.'))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <div className="flex-1 flex items-center justify-center">
                <LoadingSpinner message="Loading dashboard..." />
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Welcome back, {user?.name} 👋
                    </h1>
                    <p className="text-gray-500 mt-1">Here's what's happening in your school today.</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                        {error}
                    </div>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        title="Total Students"
                        value={stats?.total_students}
                        icon="🎓"
                        color="border-blue-500"
                        subtitle={`${stats?.active_students} active`}
                    />
                    <StatCard
                        title="Active Students"
                        value={stats?.active_students}
                        icon="✅"
                        color="border-green-500"
                    />
                    <StatCard
                        title="Courses Offered"
                        value={stats?.total_courses}
                        icon="📚"
                        color="border-purple-500"
                    />
                    <StatCard
                        title="Avg. Attendance"
                        value={stats?.avg_attendance ? `${stats.avg_attendance}%` : null}
                        icon="📅"
                        color="border-yellow-500"
                        subtitle={`${stats?.total_school_days} school days`}
                    />
                </div>

                {/* Navigation Tabs */}
                <div className="flex gap-2 mb-6 border-b border-gray-200">
                    {[
                        { id: 'overview', label: '📊 Overview' },
                        { id: 'attendance', label: '📅 Attendance' },
                        { id: 'weather', label: '🌤 Weather' },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition ${activeTab === tab.id
                                ? 'bg-blue-600 text-white border-b-2 border-blue-600'
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">📈 Monthly Enrollment Trends</h2>
                            <EnrollmentChart />
                        </div>
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">🥧 Student Distribution by Course</h2>
                            <CourseDistributionChart />
                        </div>
                    </div>
                )}

                {activeTab === 'attendance' && (
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">📉 Attendance Patterns Over School Days</h2>
                        <AttendanceChart />
                    </div>
                )}

                {activeTab === 'weather' && (
                    <WeatherWidget />
                )}
            </main>
        </div>
    );
};

export default Dashboard;
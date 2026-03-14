import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useLocation, useNavigate } from 'react-router-dom';
import NotificationBell from './NotificationBell';

const pageTitles = {
  '/dashboard':     'Dashboard',
  '/students':      'Student Management',
  '/courses':       'Courses',
  '/calendar':      'School Calendar',
  '/announcements': 'Announcement Board',
  '/activity-log':  'Activity Log',
  '/profile':       'My Profile',
};

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const title = pageTitles[location.pathname] || 'Dashboard';

  return (
    <header className={`flex items-center justify-between px-4 md:px-6 py-4 border-b shadow-sm transition-colors
      ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>

      {/* Left */}
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick}
          className={`lg:hidden p-2 rounded-lg transition
            ${darkMode ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'}`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{title}</h1>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Dark Mode Toggle */}
        <button onClick={toggleDarkMode}
          className={`relative w-12 h-6 rounded-full transition-colors duration-300
            ${darkMode ? 'bg-blue-600' : 'bg-gray-300'}`}
          title="Toggle dark mode">
          <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-300 flex items-center justify-center text-xs
            ${darkMode ? 'translate-x-6' : 'translate-x-0'}`}>
            {darkMode ? '🌙' : '☀️'}
          </span>
        </button>

        {/* Notification Bell */}
        <NotificationBell darkMode={darkMode} />

        {/* User avatar — click to go to profile */}
        <button onClick={() => navigate('/profile')}
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl transition hover:opacity-80">
          <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">
            {(user?.name || 'A').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)}
          </div>
          <div className="text-left">
            <p className={`text-xs font-medium leading-none ${darkMode ? 'text-white' : 'text-gray-800'}`}>{user?.name}</p>
            <p className={`text-xs leading-none mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Admin</p>
          </div>
        </button>

        {/* Logout */}
        <button onClick={logout}
          className="flex items-center gap-1.5 px-3 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
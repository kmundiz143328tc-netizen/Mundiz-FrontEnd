import { NavLink } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

const navItems = [
  { path: '/dashboard', icon: '📊', label: 'Dashboard' },
  { path: '/students', icon: '🎓', label: 'Students' },
  { path: '/courses', icon: '📚', label: 'Courses' },
  { path: '/calendar', icon: '📅', label: 'Calendar' },
  { path: '/announcements', icon: '📢', label: 'Announcements' },
  { path: '/activity-log', icon: '📋', label: 'Activity Log' },
  { path: '/profile', icon: '👤', label: 'My Profile' },
];

const Sidebar = ({ open, onClose }) => {
  const { darkMode } = useTheme();
  return (
    <>
      <aside className={`hidden lg:flex flex-col w-64 min-h-screen shadow-lg transition-colors
        ${darkMode ? 'bg-gray-800 border-r border-gray-700' : 'bg-white border-r border-gray-200'}`}>
        <SidebarContent darkMode={darkMode} />
      </aside>
      <aside className={`fixed top-0 left-0 z-30 flex flex-col w-64 min-h-screen shadow-xl
        transform transition-transform duration-300 lg:hidden
        ${open ? 'translate-x-0' : '-translate-x-full'}
        ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex justify-end p-4">
          <button onClick={onClose} className={`p-2 rounded-lg ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500'}`}>✕</button>
        </div>
        <SidebarContent darkMode={darkMode} onClose={onClose} />
      </aside>
    </>
  );
};

const SidebarContent = ({ darkMode, onClose }) => (
  <div className="flex flex-col h-full overflow-y-auto">
    {/* Logo */}
    <div className={`flex items-center gap-3 px-6 py-5 border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
      <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow">
        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6L23 9zm0 2.18L19.5 9 12 12.82 4.5 9 12 5.18z" />
        </svg>
      </div>
      <div>
        <p className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>Mundiz-School</p>
        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Management System</p>
      </div>
    </div>

    {/* Nav */}
    <nav className="flex-1 px-3 py-4 space-y-0.5">
      {navItems.map(item => (
        <NavLink key={item.path} to={item.path} onClick={onClose}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
            ${isActive
              ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
              : darkMode
                ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}>
          <span className="text-base">{item.icon}</span>
          {item.label}
        </NavLink>
      ))}
    </nav>

    <div className={`px-4 py-4 border-t text-xs ${darkMode ? 'border-gray-700 text-gray-500' : 'border-gray-100 text-gray-400'}`}>
      IT15/L Final Project © 2025
    </div>
  </div>
);

export default Sidebar;
import { useState, useEffect, useRef } from 'react';
import api from '../../services/api';

const typeConfig = {
  holiday:      { icon: '🎉', color: 'text-red-500',    bg: 'bg-red-50 dark:bg-red-900/20' },
  event:        { icon: '📌', color: 'text-green-500',  bg: 'bg-green-50 dark:bg-green-900/20' },
  suspension:   { icon: '⚠️', color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
  announcement: { icon: '📢', color: 'text-blue-500',   bg: 'bg-blue-50 dark:bg-blue-900/20' },
};

const priorityColor = {
  urgent: 'bg-red-500',
  high:   'bg-orange-400',
  normal: 'bg-blue-400',
  low:    'bg-gray-400',
};

const NotificationBell = ({ darkMode }) => {
  const [open, setOpen]           = useState(false);
  const [notifications, setNotifs] = useState([]);
  const [unread, setUnread]        = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    api.get('/notifications')
      .then(res => {
        setNotifs(res.data);
        setUnread(res.data.length);
      })
      .catch(() => {});
  }, []);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleOpen = () => {
    setOpen(o => !o);
    setUnread(0);
  };

  return (
    <div className="relative" ref={ref}>
      {/* Bell Button */}
      <button
        onClick={handleOpen}
        className={`relative p-2 rounded-lg transition
          ${darkMode ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'}`}
        title="Notifications"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-9.33-4.976A6 6 0 006 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className={`absolute right-0 top-12 w-80 rounded-2xl shadow-xl border z-50 overflow-hidden
          ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>

          {/* Header */}
          <div className={`px-4 py-3 border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
            <p className={`font-semibold text-sm ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              🔔 Notifications
            </p>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Upcoming events & announcements
            </p>
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className={`px-4 py-8 text-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                No notifications right now 🎉
              </div>
            ) : (
              notifications.map(n => {
                const cfg = typeConfig[n.type] || typeConfig.announcement;
                return (
                  <div key={n.id}
                    className={`flex items-start gap-3 px-4 py-3 border-b transition
                      ${cfg.bg}
                      ${darkMode ? 'border-gray-700' : 'border-gray-50'}`}>
                    <span className="text-xl mt-0.5">{cfg.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={`text-sm font-medium truncate ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                          {n.title}
                        </p>
                        {n.priority && n.priority !== 'normal' && (
                          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${priorityColor[n.priority] || 'bg-gray-400'}`} />
                        )}
                      </div>
                      <p className={`text-xs mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {n.message}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className={`px-4 py-2.5 text-center border-t ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              Showing events within next 7 days
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
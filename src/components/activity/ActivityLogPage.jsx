import { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import api from '../../services/api';

const ACTION_CONFIG = {
  created: { bg: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', icon: '➕' },
  updated: { bg: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',   icon: '✏️' },
  deleted: { bg: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',       icon: '🗑️' },
};

const ActivityLogPage = () => {
  const { darkMode } = useTheme();
  const [logs, setLogs]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage]       = useState(1);
  const [meta, setMeta]       = useState(null);
  const [module, setModule]   = useState('');
  const [clearing, setClearing] = useState(false);

  const modules = ['Student', 'Course', 'Grade', 'Announcement', 'Calendar', 'Profile'];

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = { page, per_page: 20 };
      if (module) params.module = module;
      const res = await api.get('/activity-logs', { params });
      setLogs(res.data.data);
      setMeta(res.data);
    } catch { setLogs([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchLogs(); }, [page, module]);
  useEffect(() => { setPage(1); }, [module]);

  const handleClear = async () => {
    if (!confirm('Clear all activity logs? This cannot be undone.')) return;
    setClearing(true);
    try {
      await api.delete('/activity-logs/clear');
      fetchLogs();
    } catch { alert('Failed to clear logs.'); }
    finally { setClearing(false); }
  };

  const bg     = darkMode ? 'bg-gray-800' : 'bg-white';
  const text   = darkMode ? 'text-white'  : 'text-gray-900';
  const sub    = darkMode ? 'text-gray-400' : 'text-gray-500';
  const border = darkMode ? 'border-gray-700' : 'border-gray-200';

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className={`text-xl font-bold ${text}`}>Activity Log</h2>
          <p className={`text-sm ${sub}`}>Track all admin actions in the system</p>
        </div>
        <button onClick={handleClear} disabled={clearing}
          className="flex items-center gap-2 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-xl transition disabled:opacity-60">
          🗑️ {clearing ? 'Clearing...' : 'Clear All Logs'}
        </button>
      </div>

      {/* Filter */}
      <div className={`flex gap-1 p-1 rounded-xl w-fit flex-wrap ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
        {['', ...modules].map(m => (
          <button key={m} onClick={() => setModule(m)}
            className={`px-3 py-2 text-xs font-medium rounded-lg transition
              ${module === m ? 'bg-blue-600 text-white shadow' : darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-800'}`}>
            {m || 'All'}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className={`${bg} rounded-2xl shadow-sm overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className={`border-b ${border} ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                {['Time', 'User', 'Action', 'Module', 'Description'].map(h => (
                  <th key={h} className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide ${sub}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className={`divide-y ${border}`}>
              {loading ? (
                <tr><td colSpan={5} className={`px-4 py-10 text-center ${sub}`}>
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    Loading logs...
                  </div>
                </td></tr>
              ) : logs.length === 0 ? (
                <tr><td colSpan={5} className={`px-4 py-10 text-center ${sub}`}>No activity logs found</td></tr>
              ) : (
                logs.map(log => {
                  const acfg = ACTION_CONFIG[log.action] || ACTION_CONFIG.updated;
                  return (
                    <tr key={log.id} className={`transition ${darkMode ? 'hover:bg-gray-700/40' : 'hover:bg-gray-50'}`}>
                      <td className={`px-4 py-3 text-xs whitespace-nowrap ${sub}`}>
                        {new Date(log.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className={`px-4 py-3 text-xs ${sub}`}>{log.user?.name || 'System'}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${acfg.bg}`}>
                          {acfg.icon} {log.action}
                        </span>
                      </td>
                      <td className={`px-4 py-3 text-xs font-medium ${text}`}>{log.module}</td>
                      <td className={`px-4 py-3 text-xs ${sub} max-w-xs truncate`}>{log.description}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {meta && (
          <div className={`flex items-center justify-between px-4 py-3 border-t ${border}`}>
            <p className={`text-xs ${sub}`}>Showing {meta.from}–{meta.to} of {meta.total} logs</p>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className={`px-3 py-1.5 text-xs rounded-lg border transition disabled:opacity-40
                  ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}>
                ← Prev
              </button>
              <span className={`px-3 py-1.5 text-xs ${sub}`}>Page {meta.current_page} / {meta.last_page}</span>
              <button onClick={() => setPage(p => p + 1)} disabled={page >= meta.last_page}
                className={`px-3 py-1.5 text-xs rounded-lg border transition disabled:opacity-40
                  ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}>
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityLogPage;
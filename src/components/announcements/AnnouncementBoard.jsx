import { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import api from '../../services/api';

const PRIORITY_CONFIG = {
  urgent: { label: 'Urgent',  bg: 'bg-red-100 text-red-700',      bar: 'bg-red-500',    icon: '🚨' },
  high:   { label: 'High',    bg: 'bg-orange-100 text-orange-700', bar: 'bg-orange-400', icon: '❗' },
  normal: { label: 'Normal',  bg: 'bg-blue-100 text-blue-700',     bar: 'bg-blue-400',   icon: '📢' },
  low:    { label: 'Low',     bg: 'bg-gray-100 text-gray-600',     bar: 'bg-gray-400',   icon: '📌' },
};

const CATEGORY_CONFIG = {
  general:   { label: 'General',   icon: '📋' },
  academic:  { label: 'Academic',  icon: '📚' },
  event:     { label: 'Event',     icon: '🎉' },
  emergency: { label: 'Emergency', icon: '🚨' },
};

// ── Modal ────────────────────────────────────────────────────────────────────
const AnnouncementModal = ({ ann, darkMode, onClose, onSaved }) => {
  const isEdit = !!ann;
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title:      ann?.title      || '',
    content:    ann?.content    || '',
    priority:   ann?.priority   || 'normal',
    category:   ann?.category   || 'general',
    is_pinned:  ann?.is_pinned  || false,
    expires_at: ann?.expires_at ? ann.expires_at.split('T')[0] : '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { setErrors({ title: 'Title is required' }); return; }
    if (!form.content.trim()) { setErrors({ content: 'Content is required' }); return; }
    setLoading(true);
    try {
      if (isEdit) await api.put(`/announcements/${ann.id}`, form);
      else        await api.post('/announcements', form);
      onSaved();
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors) setErrors(data.errors);
    } finally {
      setLoading(false);
    }
  };

  const bg     = darkMode ? 'bg-gray-800' : 'bg-white';
  const text   = darkMode ? 'text-white' : 'text-gray-900';
  const sub    = darkMode ? 'text-gray-400' : 'text-gray-500';
  const border = darkMode ? 'border-gray-700' : 'border-gray-200';
  const input  = `w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition
    ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
      <div className={`${bg} rounded-2xl shadow-2xl w-full max-w-lg my-4`}>
        <div className={`flex items-center justify-between px-6 py-4 border-b ${border}`}>
          <h2 className={`text-lg font-bold ${text}`}>{isEdit ? '✏️ Edit Announcement' : '📢 New Announcement'}</h2>
          <button onClick={onClose} className={`p-2 rounded-lg transition ${darkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-400 hover:bg-gray-100'}`}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label className={`block text-xs font-medium mb-1.5 ${sub}`}>Title *</label>
            <input name="title" value={form.title} onChange={handleChange} placeholder="Announcement title..."
              className={`${input} ${errors.title ? 'border-red-400' : ''}`} />
            {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
          </div>

          {/* Content */}
          <div>
            <label className={`block text-xs font-medium mb-1.5 ${sub}`}>Content *</label>
            <textarea name="content" value={form.content} onChange={handleChange} rows={4}
              placeholder="Write your announcement here..."
              className={`${input} resize-none ${errors.content ? 'border-red-400' : ''}`} />
            {errors.content && <p className="mt-1 text-xs text-red-500">{errors.content}</p>}
          </div>

          {/* Priority + Category */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`block text-xs font-medium mb-1.5 ${sub}`}>Priority</label>
              <select name="priority" value={form.priority} onChange={handleChange} className={input}>
                {Object.entries(PRIORITY_CONFIG).map(([k, v]) => (
                  <option key={k} value={k}>{v.icon} {v.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={`block text-xs font-medium mb-1.5 ${sub}`}>Category</label>
              <select name="category" value={form.category} onChange={handleChange} className={input}>
                {Object.entries(CATEGORY_CONFIG).map(([k, v]) => (
                  <option key={k} value={k}>{v.icon} {v.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Expires + Pin */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`block text-xs font-medium mb-1.5 ${sub}`}>Expires At (optional)</label>
              <input type="date" name="expires_at" value={form.expires_at} onChange={handleChange} className={input} />
            </div>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="is_pinned" checked={form.is_pinned} onChange={handleChange}
                  className="w-4 h-4 rounded accent-blue-600" />
                <span className={`text-sm ${text}`}>📌 Pin to top</span>
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className={`flex-1 py-2.5 rounded-xl border text-sm font-medium transition
                ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}>
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-medium rounded-xl transition">
              {loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Post Announcement'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ── Main Page ────────────────────────────────────────────────────────────────
const AnnouncementBoard = () => {
  const { darkMode } = useTheme();
  const [announcements, setAnn] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [modal, setModal]       = useState(false);
  const [editAnn, setEdit]      = useState(null);
  const [deleteTarget, setDel]  = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [filter, setFilter]     = useState('');

  const fetchAnn = async () => {
    setLoading(true);
    try {
      const params = filter ? { category: filter } : {};
      const res = await api.get('/announcements', { params });
      setAnn(res.data);
    } catch { setAnn([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAnn(); }, [filter]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/announcements/${deleteTarget.id}`);
      setDel(null);
      fetchAnn();
    } catch { alert('Failed to delete.'); }
    finally { setDeleting(false); }
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
          <h2 className={`text-xl font-bold ${text}`}>Announcement Board</h2>
          <p className={`text-sm ${sub}`}>Post and manage school announcements</p>
        </div>
        <button onClick={() => { setEdit(null); setModal(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition shadow-md shadow-blue-200">
          + New Announcement
        </button>
      </div>

      {/* Filter tabs */}
      <div className={`flex gap-1 p-1 rounded-xl w-fit ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
        {[['', 'All'], ...Object.entries(CATEGORY_CONFIG).map(([k, v]) => [k, v.icon + ' ' + v.label])].map(([val, label]) => (
          <button key={val} onClick={() => setFilter(val)}
            className={`px-4 py-2 text-xs font-medium rounded-lg transition
              ${filter === val ? 'bg-blue-600 text-white shadow' : darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-800'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Cards */}
      {loading ? (
        <div className={`text-center py-12 ${sub}`}>Loading announcements...</div>
      ) : announcements.length === 0 ? (
        <div className={`text-center py-12 ${sub}`}>No announcements yet. Create one!</div>
      ) : (
        <div className="space-y-3">
          {announcements.map(ann => {
            const pcfg = PRIORITY_CONFIG[ann.priority] || PRIORITY_CONFIG.normal;
            const ccfg = CATEGORY_CONFIG[ann.category] || CATEGORY_CONFIG.general;
            return (
              <div key={ann.id} className={`${bg} rounded-2xl shadow-sm border-l-4 ${pcfg.bar.replace('bg-', 'border-l-')} p-5`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      {ann.is_pinned && <span className="text-xs font-medium text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded-full">📌 Pinned</span>}
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${pcfg.bg}`}>{pcfg.icon} {pcfg.label}</span>
                      <span className={`text-xs ${sub}`}>{ccfg.icon} {ccfg.label}</span>
                    </div>
                    <h3 className={`text-base font-semibold ${text}`}>{ann.title}</h3>
                    <p className={`text-sm mt-1 whitespace-pre-line ${sub}`}>{ann.content}</p>
                    <div className="flex flex-wrap gap-4 mt-3">
                      <span className={`text-xs ${sub}`}>👤 {ann.author?.name || 'Admin'}</span>
                      <span className={`text-xs ${sub}`}>🕐 {new Date(ann.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      {ann.expires_at && <span className={`text-xs ${sub}`}>⏳ Expires: {new Date(ann.expires_at).toLocaleDateString()}</span>}
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => { setEdit(ann); setModal(true); }}
                      className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition dark:hover:bg-blue-900/30" title="Edit">✏️</button>
                    <button onClick={() => setDel(ann)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition dark:hover:bg-red-900/30" title="Delete">🗑️</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modal && (
        <AnnouncementModal ann={editAnn} darkMode={darkMode}
          onClose={() => { setModal(false); setEdit(null); }}
          onSaved={() => { setModal(false); setEdit(null); fetchAnn(); }} />
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className={`${bg} rounded-2xl shadow-xl p-6 w-full max-w-sm text-center`}>
            <div className="text-4xl mb-3">🗑️</div>
            <h3 className={`text-lg font-bold mb-1 ${text}`}>Delete Announcement?</h3>
            <p className={`text-sm mb-6 ${sub}`}>"{deleteTarget.title}" will be permanently removed.</p>
            <div className="flex gap-3">
              <button onClick={() => setDel(null)}
                className={`flex-1 py-2.5 rounded-xl border text-sm font-medium transition
                  ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}>
                Cancel
              </button>
              <button onClick={handleDelete} disabled={deleting}
                className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-xl transition disabled:opacity-60">
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnnouncementBoard;
import { useState, useEffect, useCallback } from 'react';
import { useTheme } from '../../context/ThemeContext';
import api from '../../services/api';

const MONTHS   = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS     = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

const TYPE_CONFIG = {
  class:      { label: 'Class Day',   dot: 'bg-blue-500',   badge: 'bg-blue-100 text-blue-700',    icon: '📘' },
  holiday:    { label: 'Holiday',     dot: 'bg-red-500',    badge: 'bg-red-100 text-red-700',      icon: '🎉' },
  event:      { label: 'Event',       dot: 'bg-green-500',  badge: 'bg-green-100 text-green-700',  icon: '📌' },
  suspension: { label: 'Suspension',  dot: 'bg-yellow-500', badge: 'bg-yellow-100 text-yellow-700',icon: '⚠️' },
};

// ─── Event Modal (Add / Edit) ──────────────────────────────────────────────────
const EventModal = ({ event, defaultDate, darkMode, onClose, onSaved }) => {
  const isEdit = !!event;
  const [loading, setLoading] = useState(false);
  const [errors,  setErrors]  = useState({});
  const [form, setForm] = useState({
    date:        event?.date        || defaultDate || '',
    day_type:    event?.day_type    || 'event',
    title:       event?.title       || '',
    description: event?.description || '',
    school_year: event?.school_year || '2024-2025',
    semester:    event?.semester    || '1st',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.date)     errs.date     = 'Date is required';
    if (!form.title)    errs.title    = 'Title is required';
    if (!form.day_type) errs.day_type = 'Type is required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      if (isEdit) {
        await api.put(`/school-days/${event.id}`, form);
      } else {
        await api.post('/school-days', form);
      }
      onSaved();
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors) setErrors(data.errors);
      else alert(data?.message || 'Failed to save. That date may already exist.');
    } finally {
      setLoading(false);
    }
  };

  const bg     = darkMode ? 'bg-gray-800' : 'bg-white';
  const text   = darkMode ? 'text-white'  : 'text-gray-900';
  const sub    = darkMode ? 'text-gray-400' : 'text-gray-500';
  const border = darkMode ? 'border-gray-700' : 'border-gray-200';
  const input  = `w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition
    ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900'}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className={`${bg} rounded-2xl shadow-2xl w-full max-w-md`}>
        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${border}`}>
          <h2 className={`text-lg font-bold ${text}`}>
            {isEdit ? '✏️ Edit Event' : '➕ Add Calendar Event'}
          </h2>
          <button onClick={onClose}
            className={`p-2 rounded-lg transition ${darkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-400 hover:bg-gray-100'}`}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Date */}
          <div>
            <label className={`block text-xs font-medium mb-1.5 ${sub}`}>Date *</label>
            <input type="date" name="date" value={form.date} onChange={handleChange}
              className={`${input} ${errors.date ? 'border-red-400' : ''}`} />
            {errors.date && <p className="mt-1 text-xs text-red-500">{errors.date}</p>}
          </div>

          {/* Type */}
          <div>
            <label className={`block text-xs font-medium mb-1.5 ${sub}`}>Event Type *</label>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(TYPE_CONFIG).map(([type, cfg]) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, day_type: type }))}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition
                    ${form.day_type === type
                      ? 'bg-blue-600 text-white border-blue-600 shadow'
                      : darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                    }`}
                >
                  <span>{cfg.icon}</span> {cfg.label}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className={`block text-xs font-medium mb-1.5 ${sub}`}>Title *</label>
            <input type="text" name="title" value={form.title} onChange={handleChange}
              placeholder="e.g. Intramural Sports"
              className={`${input} ${errors.title ? 'border-red-400' : ''}`} />
            {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label className={`block text-xs font-medium mb-1.5 ${sub}`}>Description (optional)</label>
            <textarea name="description" value={form.description} onChange={handleChange}
              rows={3} placeholder="Add details about this event..."
              className={`${input} resize-none`} />
          </div>

          {/* Semester */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`block text-xs font-medium mb-1.5 ${sub}`}>School Year</label>
              <select name="school_year" value={form.school_year} onChange={handleChange} className={input}>
                <option>2024-2025</option>
                <option>2025-2026</option>
              </select>
            </div>
            <div>
              <label className={`block text-xs font-medium mb-1.5 ${sub}`}>Semester</label>
              <select name="semester" value={form.semester} onChange={handleChange} className={input}>
                <option>1st</option>
                <option>2nd</option>
              </select>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className={`flex-1 py-2.5 rounded-xl border text-sm font-medium transition
                ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}>
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-medium rounded-xl transition shadow-md shadow-blue-200">
              {loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Main CalendarView ─────────────────────────────────────────────────────────
const CalendarView = () => {
  const { darkMode } = useTheme();
  const [events,    setEvents]    = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [current,   setCurrent]   = useState(new Date());
  const [selected,  setSelected]  = useState(null);   // selected day number
  const [modal,     setModal]     = useState(false);   // add/edit modal open
  const [editEvent, setEditEvent] = useState(null);    // event being edited
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting,  setDeleting]  = useState(false);

  const today = new Date();
  const year  = current.getFullYear();
  const month = current.getMonth();
  const firstDay    = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthStr    = `${year}-${String(month + 1).padStart(2, '0')}`;

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/school-days?month=${monthStr}`);
      setEvents(res.data);
    } catch {
      // fallback: try dashboard/calendar
      try {
        const res = await api.get('/dashboard/calendar');
        setEvents(res.data);
      } catch { setEvents([]); }
    } finally {
      setLoading(false);
    }
  }, [monthStr]);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  const getEventForDay = (day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.find(e => e.date?.startsWith(dateStr));
  };

  const selectedDateStr = selected
    ? `${year}-${String(month + 1).padStart(2, '0')}-${String(selected).padStart(2, '0')}`
    : null;

  const selectedEvent = selected ? getEventForDay(selected) : null;

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/school-days/${deleteTarget.id}`);
      setDeleteTarget(null);
      setSelected(null);
      fetchEvents();
    } catch {
      alert('Failed to delete event.');
    } finally {
      setDeleting(false);
    }
  };

  // Upcoming non-class events
  const upcoming = events
    .filter(e => e.day_type !== 'class' && new Date(e.date) >= today)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 6);

  const bg     = darkMode ? 'bg-gray-800' : 'bg-white';
  const text   = darkMode ? 'text-white'  : 'text-gray-900';
  const sub    = darkMode ? 'text-gray-400' : 'text-gray-500';
  const border = darkMode ? 'border-gray-700' : 'border-gray-200';

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className={`text-xl font-bold ${text}`}>School Calendar</h2>
          <p className={`text-sm ${sub}`}>Manage academic events, holidays, and school days</p>
        </div>
        <button
          onClick={() => { setEditEvent(null); setModal(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition shadow-md shadow-blue-200"
        >
          + Add Event
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* ── Calendar Panel ── */}
        <div className={`${bg} rounded-2xl shadow-sm p-5 xl:col-span-2`}>
          {/* Month nav */}
          <div className="flex items-center justify-between mb-5">
            <button onClick={() => { setCurrent(new Date(year, month - 1)); setSelected(null); }}
              className={`p-2.5 rounded-xl transition ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}>
              ←
            </button>
            <h3 className={`text-lg font-bold ${text}`}>{MONTHS[month]} {year}</h3>
            <button onClick={() => { setCurrent(new Date(year, month + 1)); setSelected(null); }}
              className={`p-2.5 rounded-xl transition ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}>
              →
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 mb-2">
            {DAYS.map(d => (
              <div key={d} className={`text-center text-xs font-semibold py-1 ${sub}`}>{d}</div>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day   = i + 1;
              const event = getEventForDay(day);
              const isToday    = today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
              const isSelected = selected === day;
              const cfg        = event ? TYPE_CONFIG[event.day_type] : null;

              return (
                <button
                  key={day}
                  onClick={() => setSelected(isSelected ? null : day)}
                  className={`relative flex flex-col items-center justify-center rounded-xl text-sm transition
                    aspect-square
                    ${isToday
                      ? 'bg-blue-600 text-white font-bold shadow-md'
                      : isSelected
                        ? darkMode ? 'bg-gray-600 text-white' : 'bg-blue-50 text-blue-700 ring-2 ring-blue-400'
                        : darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                >
                  <span>{day}</span>
                  {cfg && (
                    <span className={`absolute bottom-1 w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                  )}
                </button>
              );
            })}
          </div>

          {/* Selected day info */}
          {selected && (
            <div className={`mt-4 p-4 rounded-xl border ${border}`}>
              <div className="flex items-center justify-between">
                <p className={`text-sm font-semibold ${text}`}>
                  {MONTHS[month]} {selected}, {year}
                </p>
                <div className="flex gap-2">
                  {selectedEvent ? (
                    <>
                      <button
                        onClick={() => { setEditEvent(selectedEvent); setModal(true); }}
                        className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-medium rounded-lg transition dark:bg-blue-900/30 dark:text-blue-400"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => setDeleteTarget(selectedEvent)}
                        className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-medium rounded-lg transition dark:bg-red-900/30 dark:text-red-400"
                      >
                        🗑️ Delete
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => { setEditEvent(null); setModal(true); }}
                      className="px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-600 text-xs font-medium rounded-lg transition dark:bg-green-900/30 dark:text-green-400"
                    >
                      + Add Event
                    </button>
                  )}
                </div>
              </div>

              {selectedEvent ? (
                <div className="mt-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-lg`}>{TYPE_CONFIG[selectedEvent.day_type]?.icon}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${TYPE_CONFIG[selectedEvent.day_type]?.badge}`}>
                      {TYPE_CONFIG[selectedEvent.day_type]?.label}
                    </span>
                  </div>
                  <p className={`text-sm font-medium mt-1 ${text}`}>{selectedEvent.title}</p>
                  {selectedEvent.description && (
                    <p className={`text-xs mt-0.5 ${sub}`}>{selectedEvent.description}</p>
                  )}
                  {selectedEvent.day_type === 'class' && (
                    <div className={`flex gap-4 mt-2 text-xs ${sub}`}>
                      <span>✅ Present: <strong>{selectedEvent.students_present}</strong></span>
                      <span>❌ Absent: <strong>{selectedEvent.students_absent}</strong></span>
                      <span>📊 Rate: <strong>{selectedEvent.attendance_rate}%</strong></span>
                    </div>
                  )}
                </div>
              ) : (
                <p className={`text-xs mt-1 ${sub}`}>No event on this day. Click "+ Add Event" to create one.</p>
              )}
            </div>
          )}

          {/* Legend */}
          <div className={`flex flex-wrap gap-4 mt-4 pt-4 border-t ${border}`}>
            {Object.entries(TYPE_CONFIG).map(([type, cfg]) => (
              <div key={type} className="flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${cfg.dot}`} />
                <span className={`text-xs ${sub}`}>{cfg.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Upcoming Events Panel ── */}
        <div className={`${bg} rounded-2xl shadow-sm p-5`}>
          <h3 className={`text-base font-semibold mb-4 ${text}`}>📌 Upcoming Events</h3>

          {loading ? (
            <div className={`text-sm ${sub} text-center py-8`}>
              <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              Loading...
            </div>
          ) : upcoming.length === 0 ? (
            <div className={`text-sm ${sub} text-center py-8`}>
              No upcoming events this month
            </div>
          ) : (
            <div className="space-y-3">
              {upcoming.map(evt => {
                const cfg = TYPE_CONFIG[evt.day_type];
                return (
                  <div
                    key={evt.id}
                    className={`p-3 rounded-xl border cursor-pointer transition
                      ${border} ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}
                    onClick={() => {
                      const d = new Date(evt.date + 'T00:00:00');
                      if (d.getMonth() === month && d.getFullYear() === year) {
                        setSelected(d.getDate());
                      }
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${cfg?.badge}`}>
                        {cfg?.icon} {cfg?.label}
                      </span>
                      <div className="flex gap-1">
                        <button
                          onClick={e => { e.stopPropagation(); setEditEvent(evt); setModal(true); }}
                          className={`p-1 rounded-lg text-xs transition ${darkMode ? 'hover:bg-gray-600 text-gray-400' : 'hover:bg-gray-200 text-gray-400'}`}
                          title="Edit"
                        >✏️</button>
                        <button
                          onClick={e => { e.stopPropagation(); setDeleteTarget(evt); }}
                          className={`p-1 rounded-lg text-xs transition ${darkMode ? 'hover:bg-gray-600 text-gray-400' : 'hover:bg-gray-200 text-gray-400'}`}
                          title="Delete"
                        >🗑️</button>
                      </div>
                    </div>
                    <p className={`text-sm font-medium mt-1.5 ${text}`}>{evt.title}</p>
                    <p className={`text-xs mt-0.5 ${sub}`}>
                      {new Date(evt.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </p>
                    {evt.description && <p className={`text-xs mt-1 ${sub} line-clamp-2`}>{evt.description}</p>}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Add/Edit Modal ── */}
      {modal && (
        <EventModal
          event={editEvent}
          defaultDate={selectedDateStr}
          darkMode={darkMode}
          onClose={() => { setModal(false); setEditEvent(null); }}
          onSaved={() => { setModal(false); setEditEvent(null); fetchEvents(); }}
        />
      )}

      {/* ── Delete Confirm ── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className={`${bg} rounded-2xl shadow-xl p-6 w-full max-w-sm text-center`}>
            <div className="text-4xl mb-3">🗑️</div>
            <h3 className={`text-lg font-bold mb-1 ${text}`}>Delete Event?</h3>
            <p className={`text-sm mb-1 font-medium ${text}`}>{deleteTarget.title}</p>
            <p className={`text-xs mb-6 ${sub}`}>
              {new Date(deleteTarget.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              <br />This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)}
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

export default CalendarView;
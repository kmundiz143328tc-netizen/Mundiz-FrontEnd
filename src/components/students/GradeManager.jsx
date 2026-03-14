import { useState, useEffect, useCallback } from 'react';
import { useTheme } from '../../context/ThemeContext';
import api from '../../services/api';

// ── Grade Modal ───────────────────────────────────────────────────────────────
const GradeModal = ({ grade, studentId, courses, darkMode, onClose, onSaved }) => {
  const isEdit = !!grade;
  const [loading, setLoading] = useState(false);
  const [errors,  setErrors]  = useState({});
  const [form, setForm] = useState({
    student_id:  studentId,
    course_id:   grade?.course_id   || '',
    subject:     grade?.subject     || '',
    midterm:     grade?.midterm     ?? '',
    finals:      grade?.finals      ?? '',
    school_year: grade?.school_year || '2024-2025',
    semester:    grade?.semester    || '1st',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  // Auto-fill subject from course
  const handleCourseChange = (e) => {
    const { value } = e.target;
    const course = courses.find(c => String(c.id) === value);
    setForm(prev => ({
      ...prev,
      course_id: value,
      subject: course ? course.course_name : prev.subject,
    }));
  };

  // Preview GWA
  const previewGwa = () => {
    const m = parseFloat(form.midterm);
    const f = parseFloat(form.finals);
    if (!isNaN(m) && !isNaN(f)) return ((m + f) / 2).toFixed(2);
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.course_id) errs.course_id = 'Required';
    if (!form.subject)   errs.subject   = 'Required';
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      if (isEdit) await api.put(`/grades/${grade.id}`, form);
      else        await api.post('/grades', form);
      onSaved();
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors) setErrors(data.errors);
      else alert(data?.message || 'Failed to save grade.');
    } finally {
      setLoading(false);
    }
  };

  const bg     = darkMode ? 'bg-gray-800' : 'bg-white';
  const text   = darkMode ? 'text-white'  : 'text-gray-900';
  const sub    = darkMode ? 'text-gray-400' : 'text-gray-500';
  const border = darkMode ? 'border-gray-700' : 'border-gray-200';
  const input  = `w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition
    ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`;

  const gwa     = previewGwa();
  const passing = gwa ? parseFloat(gwa) >= 75 : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className={`${bg} rounded-2xl shadow-2xl w-full max-w-md`}>
        <div className={`flex items-center justify-between px-6 py-4 border-b ${border}`}>
          <h2 className={`text-lg font-bold ${text}`}>{isEdit ? '✏️ Edit Grade' : '➕ Add Grade'}</h2>
          <button onClick={onClose} className={`p-2 rounded-lg transition ${darkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-400 hover:bg-gray-100'}`}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Course */}
          <div>
            <label className={`block text-xs font-medium mb-1.5 ${sub}`}>Course *</label>
            <select name="course_id" value={form.course_id} onChange={handleCourseChange}
              className={`${input} ${errors.course_id ? 'border-red-400' : ''}`}>
              <option value="">Select course...</option>
              {courses.map(c => <option key={c.id} value={c.id}>{c.course_name}</option>)}
            </select>
            {errors.course_id && <p className="mt-1 text-xs text-red-500">{errors.course_id}</p>}
          </div>

          {/* Subject */}
          <div>
            <label className={`block text-xs font-medium mb-1.5 ${sub}`}>Subject / Unit Name *</label>
            <input name="subject" value={form.subject} onChange={handleChange}
              placeholder="e.g. Integrative Programming"
              className={`${input} ${errors.subject ? 'border-red-400' : ''}`} />
            {errors.subject && <p className="mt-1 text-xs text-red-500">{errors.subject}</p>}
          </div>

          {/* Grades */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`block text-xs font-medium mb-1.5 ${sub}`}>Midterm Grade</label>
              <input type="number" name="midterm" value={form.midterm} onChange={handleChange}
                min="0" max="100" step="0.01" placeholder="0-100" className={input} />
            </div>
            <div>
              <label className={`block text-xs font-medium mb-1.5 ${sub}`}>Final Grade</label>
              <input type="number" name="finals" value={form.finals} onChange={handleChange}
                min="0" max="100" step="0.01" placeholder="0-100" className={input} />
            </div>
          </div>

          {/* GWA Preview */}
          {gwa && (
            <div className={`p-3 rounded-xl ${passing ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
              <p className={`text-sm font-semibold ${passing ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                {passing ? '✅' : '❌'} GWA: {gwa} — {passing ? 'Passed' : 'Failed'}
              </p>
            </div>
          )}

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

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className={`flex-1 py-2.5 rounded-xl border text-sm font-medium transition
                ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}>
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition disabled:opacity-60">
              {loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Grade'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ── Main GradeManager (embedded in StudentList) ───────────────────────────────
const GradeManager = ({ student, darkMode, onClose }) => {
  const [grades,   setGrades]  = useState([]);
  const [summary,  setSummary] = useState(null);
  const [courses,  setCourses] = useState([]);
  const [loading,  setLoading] = useState(true);
  const [modal,    setModal]   = useState(false);
  const [editGrade, setEdit]   = useState(null);
  const [deleteId,  setDel]    = useState(null);
  const [deleting,  setDeling] = useState(false);

  const bg     = darkMode ? 'bg-gray-900' : 'bg-gray-50';
  const card   = darkMode ? 'bg-gray-800' : 'bg-white';
  const text   = darkMode ? 'text-white'  : 'text-gray-900';
  const sub    = darkMode ? 'text-gray-400' : 'text-gray-500';
  const border = darkMode ? 'border-gray-700' : 'border-gray-200';

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [gRes, sRes, cRes] = await Promise.all([
        api.get('/grades', { params: { student_id: student.id } }),
        api.get('/grades/summary', { params: { student_id: student.id } }),
        api.get('/courses'),
      ]);
      setGrades(gRes.data);
      setSummary(sRes.data);
      setCourses(cRes.data);
    } catch { setGrades([]); }
    finally { setLoading(false); }
  }, [student.id]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleDelete = async () => {
    setDeling(true);
    try {
      await api.delete(`/grades/${deleteId}`);
      setDel(null);
      fetchData();
    } catch { alert('Failed to delete.'); }
    finally { setDeling(false); }
  };

  const remarkColor = (r) => r === 'Passed'
    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
    : r === 'Failed'
    ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
    : 'bg-gray-100 text-gray-500';

  return (
    <div className={`fixed inset-0 z-50 ${bg} overflow-y-auto`}>
      <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <button onClick={onClose} className={`text-sm ${sub} hover:${text} flex items-center gap-1 mb-2`}>← Back to Students</button>
            <h2 className={`text-xl font-bold ${text}`}>
              📊 {student.first_name} {student.last_name} — Grade Report
            </h2>
            <p className={`text-sm ${sub}`}>{student.student_id} · {student.department}</p>
          </div>
          <button onClick={() => { setEdit(null); setModal(true); }}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition shadow-md shadow-blue-200">
            + Add Grade
          </button>
        </div>

        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Total Subjects', value: summary.total_subjects, icon: '📚', color: 'border-l-blue-500' },
              { label: 'Passed',         value: summary.passed,         icon: '✅', color: 'border-l-green-500' },
              { label: 'Failed',         value: summary.failed,         icon: '❌', color: 'border-l-red-500' },
              { label: 'Overall GWA',    value: summary.overall_gwa ?? '—', icon: '🎯', color: 'border-l-purple-500' },
            ].map(s => (
              <div key={s.label} className={`${card} rounded-2xl p-4 border-l-4 ${s.color} shadow-sm`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-2xl font-bold ${text}`}>{s.value}</p>
                    <p className={`text-xs ${sub}`}>{s.label}</p>
                  </div>
                  <span className="text-2xl">{s.icon}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Standing badge */}
        {summary?.standing && (
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium
            ${summary.standing === 'Good Standing' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
            {summary.standing === 'Good Standing' ? '🏆' : '⚠️'} {summary.standing}
          </div>
        )}

        {/* Grades Table */}
        <div className={`${card} rounded-2xl shadow-sm overflow-hidden`}>
          <div className={`px-5 py-4 border-b ${border}`}>
            <h3 className={`font-semibold text-sm ${text}`}>Subject Grades</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={`border-b ${border} ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                  {['Subject', 'Course', 'Midterm', 'Finals', 'GWA', 'Remarks', 'Semester', 'Actions'].map(h => (
                    <th key={h} className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide ${sub}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className={`divide-y ${border}`}>
                {loading ? (
                  <tr><td colSpan={8} className={`px-4 py-10 text-center ${sub}`}>Loading grades...</td></tr>
                ) : grades.length === 0 ? (
                  <tr><td colSpan={8} className={`px-4 py-10 text-center ${sub}`}>
                    No grades yet. Click "+ Add Grade" to add one.
                  </td></tr>
                ) : (
                  grades.map(g => (
                    <tr key={g.id} className={`transition ${darkMode ? 'hover:bg-gray-700/40' : 'hover:bg-gray-50'}`}>
                      <td className={`px-4 py-3 font-medium text-sm ${text}`}>{g.subject}</td>
                      <td className={`px-4 py-3 text-xs ${sub}`}>{g.course?.course_code || '—'}</td>
                      <td className={`px-4 py-3 text-sm ${text}`}>{g.midterm ?? '—'}</td>
                      <td className={`px-4 py-3 text-sm ${text}`}>{g.finals ?? '—'}</td>
                      <td className={`px-4 py-3 font-bold text-sm ${text}`}>{g.gwa ?? '—'}</td>
                      <td className="px-4 py-3">
                        {g.remarks ? (
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${remarkColor(g.remarks)}`}>
                            {g.remarks}
                          </span>
                        ) : '—'}
                      </td>
                      <td className={`px-4 py-3 text-xs ${sub}`}>{g.semester} · {g.school_year}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button onClick={() => { setEdit(g); setModal(true); }}
                            className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs rounded-lg transition dark:bg-blue-900/30 dark:text-blue-400">
                            Edit
                          </button>
                          <button onClick={() => setDel(g.id)}
                            className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs rounded-lg transition dark:bg-red-900/30 dark:text-red-400">
                            Del
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Grade Modal */}
      {modal && (
        <GradeModal
          grade={editGrade}
          studentId={student.id}
          courses={courses}
          darkMode={darkMode}
          onClose={() => { setModal(false); setEdit(null); }}
          onSaved={() => { setModal(false); setEdit(null); fetchData(); }}
        />
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
          <div className={`${card} rounded-2xl shadow-xl p-6 w-full max-w-sm text-center`}>
            <div className="text-4xl mb-3">🗑️</div>
            <h3 className={`text-lg font-bold mb-2 ${text}`}>Delete this grade?</h3>
            <p className={`text-sm mb-6 ${sub}`}>This cannot be undone.</p>
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

export default GradeManager;
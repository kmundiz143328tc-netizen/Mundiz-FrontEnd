import { useState, useEffect, useCallback } from 'react';
import { useTheme } from '../../context/ThemeContext';
import api from '../../services/api';
import StudentModal from './StudentModal';
import GradeManager from './GradeManager';

const StudentList = () => {
  const { darkMode } = useTheme();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editStudent, setEdit] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [gradeStudent, setGradeStudent] = useState(null); // ← opens grade manager

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, per_page: 10 };
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      const res = await api.get('/students', { params });
      // Handle both paginated and non-paginated responses
      if (res.data.data) {
        setStudents(res.data.data);
        setMeta(res.data);
      } else {
        setStudents(res.data);
        setMeta(null);
      }
    } catch { setStudents([]); }
    finally { setLoading(false); }
  }, [page, search, statusFilter]);

  useEffect(() => { fetchStudents(); }, [fetchStudents]);
  useEffect(() => { setPage(1); }, [search, statusFilter]);

  const handleDelete = async (id) => {
    setDeleting(true);
    try {
      await api.delete(`/students/${id}`);
      setDeleteId(null);
      fetchStudents();
    } catch { alert('Failed to delete student.'); }
    finally { setDeleting(false); }
  };

  const statusBadge = (status) => ({
    Active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    Inactive: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
    Graduated: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    Dropped: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
  }[status] || 'bg-gray-100 text-gray-600');

  const card = `rounded-2xl shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`;
  const text = darkMode ? 'text-white' : 'text-gray-900';
  const sub = darkMode ? 'text-gray-400' : 'text-gray-500';
  const border = darkMode ? 'border-gray-700' : 'border-gray-200';
  const inputCls = `w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition
    ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900'}`;

  // If grade manager is open, show it fullscreen
  if (gradeStudent) {
    return <GradeManager student={gradeStudent} darkMode={darkMode} onClose={() => setGradeStudent(null)} />;
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className={`text-xl font-bold ${text}`}>Students</h2>
          <p className={`text-sm ${sub}`}>Manage all enrolled students</p>
        </div>
        <button onClick={() => { setEdit(null); setModalOpen(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition shadow-md shadow-blue-200">
          + Add Student
        </button>
      </div>

      {/* Filters */}
      <div className={`${card} p-4 flex flex-col sm:flex-row gap-3`}>
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="🔍 Search name or student ID..."
          className={`${inputCls} flex-1`} />
        <select value={statusFilter} onChange={e => setStatus(e.target.value)}
          className={`${inputCls} sm:w-40`}>
          <option value="">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
          <option value="Graduated">Graduated</option>
          <option value="Dropped">Dropped</option>
        </select>
      </div>

      {/* Table — desktop / Cards — mobile */}
      <div className={`${card} overflow-hidden`}>

        {/* ── DESKTOP TABLE (md and up) ── */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className={`border-b ${border} ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                {['Student ID', 'Name', 'Department', 'Year', 'Status', 'Actions'].map(h => (
                  <th key={h} className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide ${sub}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className={`divide-y ${border}`}>
              {loading ? (
                <tr><td colSpan={6} className={`px-4 py-12 text-center ${sub}`}>
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    Loading students...
                  </div>
                </td></tr>
              ) : students.length === 0 ? (
                <tr><td colSpan={6} className={`px-4 py-12 text-center ${sub}`}>No students found</td></tr>
              ) : (
                students.map(s => (
                  <tr key={s.id} className={`transition ${darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'}`}>
                    <td className={`px-4 py-3 font-mono text-xs ${sub}`}>{s.student_id}</td>
                    <td className="px-4 py-3">
                      <div className={`font-medium ${text}`}>{s.first_name} {s.last_name}</div>
                      <div className={`text-xs ${sub}`}>{s.email}</div>
                    </td>
                    <td className={`px-4 py-3 text-xs ${sub}`}>{s.department}</td>
                    <td className={`px-4 py-3 text-xs ${sub}`}>Year {s.year_level}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusBadge(s.status)}`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <button onClick={() => setGradeStudent(s)}
                          className="px-2.5 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-600 text-xs font-medium rounded-lg transition dark:bg-purple-900/30 dark:text-purple-400">
                          📊 Grades
                        </button>
                        <button onClick={() => { setEdit(s); setModalOpen(true); }}
                          className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-medium rounded-lg transition dark:bg-blue-900/30 dark:text-blue-400">
                          Edit
                        </button>
                        <button onClick={() => setDeleteId(s.id)}
                          className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-medium rounded-lg transition dark:bg-red-900/30 dark:text-red-400">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ── MOBILE CARDS (below md) ── */}
        <div className="md:hidden">
          {loading ? (
            <div className={`py-12 text-center ${sub}`}>
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                Loading students...
              </div>
            </div>
          ) : students.length === 0 ? (
            <div className={`py-12 text-center ${sub}`}>No students found</div>
          ) : (
            <div className={`divide-y ${border}`}>
              {students.map(s => (
                <div key={s.id} className={`p-4 transition ${darkMode ? 'hover:bg-gray-700/30' : 'hover:bg-gray-50'}`}>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <p className={`font-semibold text-sm ${text}`}>{s.first_name} {s.last_name}</p>
                      <p className={`font-mono text-xs ${sub}`}>{s.student_id}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium shrink-0 ${statusBadge(s.status)}`}>
                      {s.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mb-3">
                    <p className={`text-xs ${sub}`}>🏫 {s.department}</p>
                    <p className={`text-xs ${sub}`}>📚 Year {s.year_level}</p>
                    <p className={`text-xs ${sub} truncate max-w-full`}>✉️ {s.email}</p>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <button onClick={() => setGradeStudent(s)}
                      className="px-3 py-1.5 bg-purple-50 text-purple-600 text-xs font-medium rounded-lg transition dark:bg-purple-900/30 dark:text-purple-400">
                      📊 Grades
                    </button>
                    <button onClick={() => { setEdit(s); setModalOpen(true); }}
                      className="px-3 py-1.5 bg-blue-50 text-blue-600 text-xs font-medium rounded-lg transition dark:bg-blue-900/30 dark:text-blue-400">
                      ✏️ Edit
                    </button>
                    <button onClick={() => setDeleteId(s.id)}
                      className="px-3 py-1.5 bg-red-50 text-red-600 text-xs font-medium rounded-lg transition dark:bg-red-900/30 dark:text-red-400">
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {meta && (
          <div className={`flex items-center justify-between px-4 py-3 border-t ${border}`}>
            <p className={`text-xs ${sub}`}>
              Showing {meta.from}–{meta.to} of {meta.total} students
            </p>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className={`px-3 py-1.5 text-xs rounded-lg border transition disabled:opacity-40
                  ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}>
                ← Prev
              </button>
              <span className={`px-3 py-1.5 text-xs ${sub}`}>
                Page {meta.current_page} / {meta.last_page}
              </span>
              <button onClick={() => setPage(p => p + 1)} disabled={page >= meta.last_page}
                className={`px-3 py-1.5 text-xs rounded-lg border transition disabled:opacity-40
                  ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}>
                Next →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {modalOpen && (
        <StudentModal student={editStudent} darkMode={darkMode}
          onClose={() => { setModalOpen(false); setEdit(null); }}
          onSaved={() => { setModalOpen(false); setEdit(null); fetchStudents(); }} />
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className={`rounded-2xl shadow-xl p-6 w-full max-w-sm text-center ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="text-4xl mb-3">🗑️</div>
            <h3 className={`text-lg font-bold mb-2 ${text}`}>Delete Student?</h3>
            <p className={`text-sm mb-6 ${sub}`}>This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)}
                className={`flex-1 py-2.5 rounded-xl border text-sm font-medium transition
                  ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}>
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteId)} disabled={deleting}
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

export default StudentList;
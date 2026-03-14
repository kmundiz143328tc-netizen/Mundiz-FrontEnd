import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import api from '../../services/api';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [course,   setCourse]   = useState(null);
  const [students, setStudents] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cRes, sRes] = await Promise.all([
          api.get(`/courses/${id}`),
          api.get('/students', { params: { course_id: id, per_page: 500 } }),
        ]);
        setCourse(cRes.data);
        setStudents(sRes.data.data || sRes.data);
      } catch { navigate('/students'); }
      finally { setLoading(false); }
    };
    fetchData();
  }, [id]);

  const filtered = students.filter(s =>
    `${s.first_name} ${s.last_name} ${s.student_id}`.toLowerCase().includes(search.toLowerCase())
  );

  const statusCount = (status) => students.filter(s => s.status === status).length;

  const bg     = darkMode ? 'bg-gray-800' : 'bg-white';
  const text   = darkMode ? 'text-white'  : 'text-gray-900';
  const sub    = darkMode ? 'text-gray-400' : 'text-gray-500';
  const border = darkMode ? 'border-gray-700' : 'border-gray-200';

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-5">
      {/* Back */}
      <button onClick={() => navigate(-1)}
        className={`flex items-center gap-2 text-sm ${sub} hover:${text} transition`}>
        ← Back
      </button>

      {/* Course Info */}
      <div className={`${bg} rounded-2xl shadow-sm p-6`}>
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white text-sm font-bold">
                {course?.course_code?.slice(0, 2)}
              </div>
              <div>
                <h2 className={`text-xl font-bold ${text}`}>{course?.course_name}</h2>
                <p className={`text-sm ${sub}`}>{course?.course_code} · {course?.department}</p>
              </div>
            </div>
            {course?.description && <p className={`text-sm mt-2 ${sub}`}>{course.description}</p>}
          </div>
          <div className="flex gap-3 flex-wrap">
            <div className={`text-center px-4 py-3 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
              <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-blue-700'}`}>{students.length}</p>
              <p className={`text-xs ${sub}`}>Total</p>
            </div>
            <div className={`text-center px-4 py-3 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-green-50'}`}>
              <p className={`text-2xl font-bold ${darkMode ? 'text-green-400' : 'text-green-700'}`}>{statusCount('Active')}</p>
              <p className={`text-xs ${sub}`}>Active</p>
            </div>
            <div className={`text-center px-4 py-3 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-purple-50'}`}>
              <p className={`text-2xl font-bold ${darkMode ? 'text-purple-400' : 'text-purple-700'}`}>{statusCount('Graduated')}</p>
              <p className={`text-xs ${sub}`}>Graduated</p>
            </div>
          </div>
        </div>
      </div>

      {/* Students */}
      <div className={`${bg} rounded-2xl shadow-sm overflow-hidden`}>
        <div className="p-4 border-b" style={{ borderColor: darkMode ? '#374151' : '#e5e7eb' }}>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="🔍 Search students..."
            className={`w-full sm:w-72 px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500
              ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300'}`} />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className={`border-b ${border} ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                {['Student ID', 'Name', 'Year Level', 'Status', 'Enrolled'].map(h => (
                  <th key={h} className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide ${sub}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className={`divide-y ${border}`}>
              {filtered.length === 0 ? (
                <tr><td colSpan={5} className={`px-4 py-8 text-center ${sub}`}>No students found</td></tr>
              ) : filtered.map(s => (
                <tr key={s.id} className={`transition ${darkMode ? 'hover:bg-gray-700/40' : 'hover:bg-gray-50'}`}>
                  <td className={`px-4 py-3 font-mono text-xs ${sub}`}>{s.student_id}</td>
                  <td className="px-4 py-3">
                    <p className={`font-medium ${text}`}>{s.first_name} {s.last_name}</p>
                    <p className={`text-xs ${sub}`}>{s.email}</p>
                  </td>
                  <td className={`px-4 py-3 text-xs ${sub}`}>Year {s.year_level}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium
                      ${s.status === 'Active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                        s.status === 'Graduated' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                        'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'}`}>
                      {s.status}
                    </span>
                  </td>
                  <td className={`px-4 py-3 text-xs ${sub}`}>
                    {s.enrollment_date ? new Date(s.enrollment_date).toLocaleDateString() : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
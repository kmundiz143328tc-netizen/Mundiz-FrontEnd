import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import api from '../../services/api';

const DEPT_COLORS = [
  'from-blue-500 to-indigo-600',
  'from-green-500 to-teal-600',
  'from-purple-500 to-pink-600',
  'from-orange-500 to-red-500',
  'from-cyan-500 to-blue-600',
  'from-yellow-500 to-orange-500',
];

const CourseList = () => {
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const [courses,  setCourses]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState('');
  const [deptFilter, setDept]   = useState('');

  useEffect(() => {
    api.get('/courses')
      .then(res => setCourses(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const departments = [...new Set(courses.map(c => c.department))].sort();

  const filtered = courses.filter(c => {
    const matchSearch = `${c.course_name} ${c.course_code} ${c.department}`.toLowerCase().includes(search.toLowerCase());
    const matchDept   = !deptFilter || c.department === deptFilter;
    return matchSearch && matchDept;
  });

  const bg   = darkMode ? 'bg-gray-800' : 'bg-white';
  const text = darkMode ? 'text-white'  : 'text-gray-900';
  const sub  = darkMode ? 'text-gray-400' : 'text-gray-500';

  return (
    <div className="space-y-5">
      <div>
        <h2 className={`text-xl font-bold ${text}`}>Courses</h2>
        <p className={`text-sm ${sub}`}>All offered courses across departments</p>
      </div>

      {/* Filters */}
      <div className={`${bg} rounded-2xl shadow-sm p-4 flex flex-col sm:flex-row gap-3`}>
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="🔍 Search course name or code..."
          className={`flex-1 px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500
            ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300'}`} />
        <select value={deptFilter} onChange={e => setDept(e.target.value)}
          className={`sm:w-48 px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500
            ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}>
          <option value="">All Departments</option>
          {departments.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Courses',  value: courses.length,       icon: '📚' },
          { label: 'Departments',    value: departments.length,   icon: '🏫' },
          { label: 'Showing',        value: filtered.length,      icon: '👁️' },
        ].map(s => (
          <div key={s.label} className={`${bg} rounded-2xl p-4 shadow-sm`}>
            <div className="flex items-center gap-2">
              <span className="text-xl">{s.icon}</span>
              <div>
                <p className={`text-xl font-bold ${text}`}>{s.value}</p>
                <p className={`text-xs ${sub}`}>{s.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Course Cards */}
      {loading ? (
        <div className={`text-center py-12 ${sub}`}>Loading courses...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((course, i) => (
            <div key={course.id}
              onClick={() => navigate(`/courses/${course.id}`)}
              className={`${bg} rounded-2xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-all duration-200 hover:-translate-y-0.5`}>
              {/* Color header */}
              <div className={`h-2 bg-gradient-to-r ${DEPT_COLORS[i % DEPT_COLORS.length]}`} />
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 bg-gradient-to-br ${DEPT_COLORS[i % DEPT_COLORS.length]} rounded-xl flex items-center justify-center text-white text-xs font-bold shadow`}>
                    {course.course_code?.slice(0, 2)}
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium
                    ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                    {course.department}
                  </span>
                </div>
                <h3 className={`font-semibold text-sm ${text} line-clamp-2`}>{course.course_name}</h3>
                <p className={`text-xs mt-1 ${sub}`}>{course.course_code}</p>
                {course.description && (
                  <p className={`text-xs mt-2 ${sub} line-clamp-2`}>{course.description}</p>
                )}
                <div className={`mt-3 pt-3 border-t flex items-center justify-between
                  ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                  <span className={`text-xs ${sub}`}>
                    {course.units ? `${course.units} units` : ''}
                  </span>
                  <span className="text-xs text-blue-500 font-medium">View Students →</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseList;
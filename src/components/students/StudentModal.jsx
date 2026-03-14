import { useState, useEffect } from 'react';
import api from '../../services/api';

// ✅ Field is OUTSIDE StudentModal so it never gets re-created on re-render
const Field = ({ label, name, type = 'text', value, onChange, error, darkMode, children }) => {
  const input = `w-full px-3 py-2.5 rounded-xl border text-sm transition focus:outline-none focus:ring-2 focus:ring-blue-500
    ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900'}
    ${error ? 'border-red-400' : ''}`;

  const sub = darkMode ? 'text-gray-400' : 'text-gray-500';

  return (
    <div>
      <label className={`block text-xs font-medium mb-1.5 ${sub}`}>{label}</label>
      {children
        ? children
        : (
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            autoComplete="off"
            className={input}
          />
        )
      }
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

const StudentModal = ({ student, darkMode, onClose, onSaved }) => {
  const isEdit = !!student;
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors]   = useState({});

  const [form, setForm] = useState({
    student_id:      student?.student_id      || '',
    first_name:      student?.first_name      || '',
    last_name:       student?.last_name       || '',
    email:           student?.email           || '',
    gender:          student?.gender          || 'Male',
    department:      student?.department      || '',
    course_id:       student?.course_id       || '',
    year_level:      student?.year_level      || 1,
    enrollment_date: student?.enrollment_date || new Date().toISOString().split('T')[0],
    status:          student?.status          || 'Active',
    age:             student?.age             || 18,
    address:         student?.address         || '',
  });

  useEffect(() => {
    api.get('/courses').then(res => setCourses(res.data)).catch(() => {});
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Auto-fill department when course is selected
    if (name === 'course_id') {
      const course = courses.find(c => String(c.id) === String(value));
      setForm(prev => ({
        ...prev,
        course_id: value,
        department: course ? course.department : prev.department,
      }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.student_id)      errs.student_id      = 'Required';
    if (!form.first_name)      errs.first_name      = 'Required';
    if (!form.last_name)       errs.last_name       = 'Required';
    if (!form.email)           errs.email           = 'Required';
    if (!form.course_id)       errs.course_id       = 'Required';
    if (!form.enrollment_date) errs.enrollment_date = 'Required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      if (isEdit) {
        await api.put(`/students/${student.id}`, form);
      } else {
        await api.post('/students', form);
      }
      onSaved();
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors) setErrors(data.errors);
      else alert(data?.message || 'Failed to save student.');
    } finally {
      setLoading(false);
    }
  };

  const bg     = darkMode ? 'bg-gray-800' : 'bg-white';
  const text   = darkMode ? 'text-white' : 'text-gray-900';
  const border = darkMode ? 'border-gray-700' : 'border-gray-200';
  const input  = `w-full px-3 py-2.5 rounded-xl border text-sm transition focus:outline-none focus:ring-2 focus:ring-blue-500
    ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
      <div className={`${bg} rounded-2xl shadow-2xl w-full max-w-2xl my-4`}>

        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${border}`}>
          <h2 className={`text-lg font-bold ${text}`}>
            {isEdit ? '✏️ Edit Student' : '➕ Add New Student'}
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition ${darkMode ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-400 hover:bg-gray-100'}`}
          >✕</button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <Field label="Student ID *" name="student_id" value={form.student_id} onChange={handleChange} error={errors.student_id} darkMode={darkMode} />

            {/* Course dropdown */}
            <Field label="Course *" name="course_id" error={errors.course_id} darkMode={darkMode}>
              <select name="course_id" value={form.course_id} onChange={handleChange}
                className={`${input} ${errors.course_id ? 'border-red-400' : ''}`}>
                <option value="">Select course...</option>
                {courses.map(c => (
                  <option key={c.id} value={c.id}>{c.course_name}</option>
                ))}
              </select>
            </Field>

            <Field label="First Name *" name="first_name" value={form.first_name} onChange={handleChange} error={errors.first_name} darkMode={darkMode} />
            <Field label="Last Name *"  name="last_name"  value={form.last_name}  onChange={handleChange} error={errors.last_name}  darkMode={darkMode} />
            <Field label="Email *"      name="email"      value={form.email}      onChange={handleChange} error={errors.email}      darkMode={darkMode} type="email" />

            {/* Gender dropdown */}
            <Field label="Gender" name="gender" darkMode={darkMode}>
              <select name="gender" value={form.gender} onChange={handleChange} className={input}>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </Field>

            {/* Year Level dropdown */}
            <Field label="Year Level" name="year_level" darkMode={darkMode}>
              <select name="year_level" value={form.year_level} onChange={handleChange} className={input}>
                {[1, 2, 3, 4].map(y => <option key={y} value={y}>Year {y}</option>)}
              </select>
            </Field>

            <Field label="Age" name="age" type="number" value={form.age} onChange={handleChange} error={errors.age} darkMode={darkMode} />
            <Field label="Enrollment Date *" name="enrollment_date" type="date" value={form.enrollment_date} onChange={handleChange} error={errors.enrollment_date} darkMode={darkMode} />

            {/* Status dropdown */}
            <Field label="Status" name="status" darkMode={darkMode}>
              <select name="status" value={form.status} onChange={handleChange} className={input}>
                <option>Active</option>
                <option>Inactive</option>
                <option>Graduated</option>
                <option>Dropped</option>
              </select>
            </Field>

            {/* Address - full width */}
            <div className="sm:col-span-2">
              <Field label="Address" name="address" value={form.address} onChange={handleChange} error={errors.address} darkMode={darkMode} />
            </div>

          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 py-2.5 rounded-xl border text-sm font-medium transition
                ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition disabled:opacity-60 shadow-md shadow-blue-200"
            >
              {loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Student'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default StudentModal;
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import api from '../../services/api';

const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const { darkMode } = useTheme();

  const [form, setForm] = useState({
    name:             user?.name  || '',
    email:            user?.email || '',
    current_password: '',
    new_password:     '',
    new_password_confirmation: '',
  });
  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setSuccess('');

    // Client-side validation
    if (form.new_password && form.new_password !== form.new_password_confirmation) {
      setErrors({ new_password_confirmation: 'Passwords do not match' });
      setLoading(false);
      return;
    }

    try {
      const payload = { name: form.name, email: form.email };
      if (form.new_password) {
        payload.current_password = form.current_password;
        payload.new_password     = form.new_password;
        payload.new_password_confirmation = form.new_password_confirmation;
      }

      const res = await api.put('/profile', payload);
      if (setUser) setUser(res.data.user);
      setSuccess('✅ Profile updated successfully!');
      setForm(prev => ({ ...prev, current_password: '', new_password: '', new_password_confirmation: '' }));
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors) setErrors(data.errors);
      else setErrors({ general: data?.message || 'Update failed.' });
    } finally {
      setLoading(false);
    }
  };

  const bg     = darkMode ? 'bg-gray-800' : 'bg-white';
  const text   = darkMode ? 'text-white'  : 'text-gray-900';
  const sub    = darkMode ? 'text-gray-400' : 'text-gray-500';
  const border = darkMode ? 'border-gray-700' : 'border-gray-200';
  const input  = `w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition
    ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900'}`;

  const avatarLetters = (user?.name || 'A').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div>
        <h2 className={`text-xl font-bold ${text}`}>My Profile</h2>
        <p className={`text-sm ${sub}`}>Update your account information</p>
      </div>

      {/* Avatar Card */}
      <div className={`${bg} rounded-2xl shadow-sm p-6 flex items-center gap-5`}>
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg">
          {avatarLetters}
        </div>
        <div>
          <p className={`text-lg font-bold ${text}`}>{user?.name}</p>
          <p className={`text-sm ${sub}`}>{user?.email}</p>
          <span className="mt-1 inline-block px-2.5 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full dark:bg-blue-900/30 dark:text-blue-400">
            Administrator
          </span>
        </div>
      </div>

      {/* Form */}
      <div className={`${bg} rounded-2xl shadow-sm p-6`}>
        {errors.general && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
            {errors.general}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm dark:bg-green-900/20 dark:border-green-800 dark:text-green-400">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Basic Info */}
          <div>
            <h3 className={`text-sm font-semibold mb-3 ${text}`}>Basic Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={`block text-xs font-medium mb-1.5 ${sub}`}>Full Name</label>
                <input name="name" value={form.name} onChange={handleChange} className={input} />
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
              </div>
              <div>
                <label className={`block text-xs font-medium mb-1.5 ${sub}`}>Email Address</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} className={input} />
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
              </div>
            </div>
          </div>

          {/* Password */}
          <div className={`border-t pt-5 ${border}`}>
            <h3 className={`text-sm font-semibold mb-1 ${text}`}>Change Password</h3>
            <p className={`text-xs mb-3 ${sub}`}>Leave blank if you don't want to change your password.</p>
            <div className="space-y-3">
              <div>
                <label className={`block text-xs font-medium mb-1.5 ${sub}`}>Current Password</label>
                <input name="current_password" type="password" value={form.current_password}
                  onChange={handleChange} placeholder="Enter current password" className={input} />
                {errors.current_password && <p className="mt-1 text-xs text-red-500">{errors.current_password}</p>}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={`block text-xs font-medium mb-1.5 ${sub}`}>New Password</label>
                  <input name="new_password" type="password" value={form.new_password}
                    onChange={handleChange} placeholder="Min 6 characters" className={input} />
                  {errors.new_password && <p className="mt-1 text-xs text-red-500">{errors.new_password}</p>}
                </div>
                <div>
                  <label className={`block text-xs font-medium mb-1.5 ${sub}`}>Confirm New Password</label>
                  <input name="new_password_confirmation" type="password" value={form.new_password_confirmation}
                    onChange={handleChange} placeholder="Repeat new password" className={input} />
                  {errors.new_password_confirmation && <p className="mt-1 text-xs text-red-500">{errors.new_password_confirmation}</p>}
                </div>
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold rounded-xl transition shadow-md shadow-blue-200">
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
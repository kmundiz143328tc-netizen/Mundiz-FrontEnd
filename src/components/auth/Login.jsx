import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

// ── Floating background blobs ─────────────────────────────────────────────────
const Blob = ({ style }) => (
  <div style={style} className="absolute rounded-full blur-3xl pointer-events-none" />
);

// ── SVG School Illustration ───────────────────────────────────────────────────
const SchoolIllustration = ({ dark }) => (
  <svg viewBox="0 0 400 360" fill="none" xmlns="http://www.w3.org/2000/svg"
    className="w-full max-w-xs mx-auto drop-shadow-2xl select-none">
    {/* Sky circle */}
    <circle cx="200" cy="180" r="165" fill={dark ? '#1e3a5f' : '#dbeafe'} opacity="0.55" />

    {/* Clouds */}
    <g opacity="0.9">
      <ellipse cx="95" cy="88" rx="32" ry="19" fill="white" />
      <ellipse cx="118" cy="80" rx="24" ry="17" fill="white" />
      <ellipse cx="76" cy="84" rx="20" ry="14" fill="white" />
    </g>
    <g opacity="0.7">
      <ellipse cx="295" cy="70" rx="26" ry="15" fill="white" />
      <ellipse cx="314" cy="63" rx="18" ry="13" fill="white" />
      <ellipse cx="279" cy="67" rx="16" ry="11" fill="white" />
    </g>

    {/* Sun */}
    <circle cx="330" cy="105" r="24" fill={dark ? '#fbbf24' : '#fde68a'} />
    <circle cx="330" cy="105" r="17" fill={dark ? '#f59e0b' : '#fcd34d'} />
    {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
      const r = (deg * Math.PI) / 180;
      return <line key={i}
        x1={330 + 21 * Math.cos(r)} y1={105 + 21 * Math.sin(r)}
        x2={330 + 32 * Math.cos(r)} y2={105 + 32 * Math.sin(r)}
        stroke={dark ? '#fbbf24' : '#f59e0b'} strokeWidth="2.5" strokeLinecap="round" />;
    })}

    {/* Stars */}
    {[[55, 65], [350, 55], [45, 110], [360, 95], [180, 45]].map(([x, y], i) => (
      <circle key={i} cx={x} cy={y} r="3" fill={dark ? '#fbbf24' : '#fcd34d'}
        style={{ animation: `twinkle ${1.2 + i * 0.4}s ease-in-out infinite alternate` }} />
    ))}

    {/* Building body */}
    <rect x="85" y="155" width="230" height="160" rx="5"
      fill={dark ? '#1d4ed8' : '#3b82f6'} />
    {/* Roof */}
    <polygon points="65,158 200,75 335,158" fill={dark ? '#1e40af' : '#2563eb'} />
    <polygon points="80,158 200,85 320,158" fill={dark ? '#2563eb' : '#60a5fa'} />
    {/* Roof accent */}
    <rect x="85" y="155" width="230" height="14" rx="3"
      fill={dark ? '#1e40af' : '#1d4ed8'} />

    {/* Flag pole + flag */}
    <rect x="196" y="56" width="8" height="32" rx="2" fill={dark ? '#93c5fd' : '#1e40af'} />
    <polygon points="204,58 234,69 204,80" fill="#ef4444" />

    {/* Windows row */}
    {[108, 165, 223, 280].map((x, i) => (
      <g key={i}>
        <rect x={x} y="178" width="40" height="33" rx="4"
          fill={dark ? '#93c5fd' : '#bfdbfe'} />
        <rect x={x} y="178" width="40" height="5" rx="2"
          fill={dark ? '#60a5fa' : '#93c5fd'} />
        <line x1={x + 20} y1="178" x2={x + 20} y2="211"
          stroke={dark ? '#60a5fa' : '#93c5fd'} strokeWidth="1.5" />
        <line x1={x} y1="195" x2={x + 40} y2="195"
          stroke={dark ? '#60a5fa' : '#93c5fd'} strokeWidth="1.5" />
      </g>
    ))}

    {/* Door */}
    <rect x="168" y="248" width="64" height="67" rx="5"
      fill={dark ? '#1e3a5f' : '#1e40af'} />
    <rect x="168" y="248" width="64" height="9" rx="3"
      fill={dark ? '#60a5fa' : '#93c5fd'} />
    <line x1="200" y1="248" x2="200" y2="315"
      stroke={dark ? '#60a5fa' : '#93c5fd'} strokeWidth="2" />
    <circle cx="190" cy="287" r="3.5" fill={dark ? '#93c5fd' : '#bfdbfe'} />
    <circle cx="210" cy="287" r="3.5" fill={dark ? '#93c5fd' : '#bfdbfe'} />

    {/* Steps */}
    <rect x="153" y="313" width="94" height="9" rx="3"
      fill={dark ? '#1e40af' : '#2563eb'} />
    <rect x="142" y="320" width="116" height="9" rx="3"
      fill={dark ? '#1d4ed8' : '#3b82f6'} />

    {/* Left tree */}
    <rect x="52" y="265" width="14" height="55" rx="4" fill={dark ? '#92400e' : '#78350f'} />
    <ellipse cx="59" cy="250" rx="30" ry="33" fill={dark ? '#065f46' : '#16a34a'} />
    <ellipse cx="59" cy="238" rx="21" ry="24" fill={dark ? '#047857' : '#22c55e'} />

    {/* Right tree */}
    <rect x="334" y="265" width="14" height="55" rx="4" fill={dark ? '#92400e' : '#78350f'} />
    <ellipse cx="341" cy="250" rx="30" ry="33" fill={dark ? '#065f46' : '#16a34a'} />
    <ellipse cx="341" cy="238" rx="21" ry="24" fill={dark ? '#047857' : '#22c55e'} />

    {/* Pathway */}
    <rect x="185" y="329" width="30" height="20" rx="3" fill={dark ? '#374151' : '#d1d5db'} />

    {/* Ground */}
    <ellipse cx="200" cy="335" rx="155" ry="11"
      fill={dark ? '#14532d' : '#86efac'} opacity="0.7" />
  </svg>
);

// ── Main Login ────────────────────────────────────────────────────────────────
const Login = () => {
  const { login } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();

  const [role, setRole] = useState('Admin');
  const [email, setEmail] = useState('admin@school.edu.ph');
  const [password, setPassword] = useState('password123');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [ready, setReady] = useState(false);

  useEffect(() => { setTimeout(() => setReady(true), 80); }, []);

  useEffect(() => {
    if (role === 'Admin') {
      setEmail('admin@school.edu.ph');
      setPassword('password123');
    } else {
      setEmail('');
      setPassword('');
    }
    setError('');
  }, [role]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const dark = darkMode;

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-500
      ${dark ? 'bg-gray-950' : 'bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100'}`}
      style={{ fontFamily: "'Nunito', 'Segoe UI', sans-serif" }}>

      {/* ── Dark Mode Toggle (top-right corner) ── */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <span className={`text-xs font-bold ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
          {dark ? '🌙 Dark' : '☀️ Light'}
        </span>
        <button onClick={toggleDarkMode}
          title={dark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className={`relative w-12 h-6 rounded-full transition-colors duration-300
            ${dark ? 'bg-blue-600' : 'bg-gray-300'}`}>
          <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow
            transition-transform duration-300 flex items-center justify-center text-xs
            ${dark ? 'translate-x-6' : 'translate-x-0'}`}>
            {dark ? '🌙' : '☀️'}
          </span>
        </button>
      </div>

      {/* Background blobs */}
      <Blob style={{
        width: 500, height: 500, top: '-15%', left: '-10%',
        background: dark ? 'rgba(59,130,246,0.12)' : 'rgba(59,130,246,0.18)', animation: 'pulse 4s ease-in-out infinite'
      }} />
      <Blob style={{
        width: 350, height: 350, bottom: '-10%', right: '-8%',
        background: dark ? 'rgba(99,102,241,0.10)' : 'rgba(99,102,241,0.15)', animation: 'pulse 5s ease-in-out infinite 1s'
      }} />
      <Blob style={{
        width: 200, height: 200, top: '30%', right: '15%',
        background: dark ? 'rgba(139,92,246,0.08)' : 'rgba(139,92,246,0.12)', animation: 'pulse 6s ease-in-out infinite 2s'
      }} />

      {/* Card */}
      <div className={`relative w-full max-w-4xl rounded-3xl overflow-hidden transition-all duration-700
        ${ready ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
        ${dark ? 'bg-gray-900 shadow-[0_30px_80px_rgba(0,0,0,0.7)]' : 'bg-white shadow-[0_30px_80px_rgba(59,130,246,0.18)]'}`}>

        <div className="flex flex-col md:flex-row min-h-[580px]">

          {/* ── LEFT — Illustration ──────────────────────────────── */}
          <div className={`relative flex flex-col items-center justify-center p-8 md:w-[48%] overflow-hidden
            ${dark ? 'bg-gradient-to-br from-blue-900 to-indigo-950' : 'bg-gradient-to-br from-blue-500 to-blue-700'}`}>

            {/* Decorative rings */}
            <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full border border-white/10" />
            <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full border border-white/10" />
            <div className="absolute top-1/2 -right-10 w-40 h-40 rounded-full border border-white/10" />

            {/* Logo */}
            <div className={`flex items-center gap-3 mb-5 z-10 transition-all duration-700
              ${ready ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
              style={{ transitionDelay: '200ms' }}>
              <div className="w-11 h-11 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-2xl">🏫</span>
              </div>
              <div>
                <p className="text-white font-black text-xl tracking-tight leading-none">Mundiz-School</p>
                <p className="text-blue-200 text-xs font-medium">Management System</p>
              </div>
            </div>

            {/* Illustration */}
            <div className={`z-10 w-full transition-all duration-1000
              ${ready ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
              style={{ transitionDelay: '350ms' }}>
              <SchoolIllustration dark={dark} />
            </div>

            {/* Tagline */}
            <div className={`z-10 text-center mt-3 transition-all duration-700
              ${ready ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ transitionDelay: '500ms' }}>
              <p className="text-white font-extrabold text-lg">Welcome to Mundiz-SchoolMS</p>
              <p className="text-blue-200 text-sm mt-1 font-medium">Your complete school management solution</p>
            </div>

            {/* Progress dots */}
            <div className="flex gap-2 mt-5 z-10">
              <div className="w-7 h-2 rounded-full bg-white" />
              <div className="w-2 h-2 rounded-full bg-white/40" />
              <div className="w-2 h-2 rounded-full bg-white/40" />
            </div>
          </div>

          {/* ── RIGHT — Form ─────────────────────────────────────── */}
          <div className={`flex flex-col justify-center px-8 py-10 md:px-12 md:w-[52%]
            ${dark ? 'bg-gray-900' : 'bg-white'}`}>

            {/* Role Toggle */}
            <div className={`flex p-1.5 rounded-2xl mb-8 self-center
              ${dark ? 'bg-gray-800' : 'bg-gray-100'}`}>
              {['Student', 'Admin'].map(r => (
                <button key={r} type="button" onClick={() => setRole(r)}
                  className={`px-7 py-2.5 rounded-xl text-sm font-extrabold transition-all duration-300
                    ${role === r
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-[1.04]'
                      : dark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'
                    }`}>
                  {r === 'Student' ? '🎓 ' : '👩‍🏫 '}{r}
                </button>
              ))}
            </div>

            {/* Heading */}
            <div className={`mb-7 transition-all duration-500
              ${ready ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-5'}`}
              style={{ transitionDelay: '250ms' }}>
              <h1 className={`text-3xl font-black tracking-tight ${dark ? 'text-white' : 'text-gray-900'}`}>
                {role === 'Admin' ? 'Admin Sign In' : 'Student Portal'}
              </h1>
              <p className={`text-sm mt-2 font-medium ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                {role === 'Admin'
                  ? 'Access your school management dashboard'
                  : 'Enter your student credentials to continue'}
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className={`mb-5 px-4 py-3 rounded-2xl flex items-center gap-3 text-sm font-semibold
                border ${dark ? 'bg-red-900/20 border-red-700/50 text-red-400' : 'bg-red-50 border-red-200 text-red-600'}`}>
                <span className="text-base shrink-0">⚠️</span>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email field */}
              <div>
                <label className={`block text-xs font-extrabold mb-2 uppercase tracking-widest
                  ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base pointer-events-none select-none">✉️</span>
                  <input type="email" value={email} autoComplete="email"
                    onChange={e => { setEmail(e.target.value); setError(''); }}
                    placeholder="Enter your email"
                    className={`w-full pl-11 pr-4 py-3.5 rounded-2xl border-2 text-sm font-semibold transition-all duration-200
                      focus:outline-none focus:scale-[1.01]
                      ${dark
                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-blue-500 focus:bg-gray-750'
                        : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:bg-white'
                      }`} />
                </div>
              </div>

              {/* Password field */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className={`text-xs font-extrabold uppercase tracking-widest
                    ${dark ? 'text-gray-400' : 'text-gray-500'}`}>Password</label>
                  <button type="button"
                    className="text-xs text-blue-500 hover:text-blue-400 font-bold transition">
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base pointer-events-none select-none">🔒</span>
                  <input type={showPw ? 'text' : 'password'} value={password} autoComplete="current-password"
                    onChange={e => { setPassword(e.target.value); setError(''); }}
                    placeholder="Enter your password"
                    className={`w-full pl-11 pr-12 py-3.5 rounded-2xl border-2 text-sm font-semibold transition-all duration-200
                      focus:outline-none focus:scale-[1.01]
                      ${dark
                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-blue-500'
                        : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:bg-white'
                      }`} />
                  <button type="button" onClick={() => setShowPw(p => !p)}
                    className={`absolute right-4 top-1/2 -translate-y-1/2 text-base transition
                      ${dark ? 'text-gray-500 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'}`}>
                    {showPw ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button type="submit" disabled={loading}
                className={`w-full py-4 rounded-2xl font-black text-white text-base transition-all duration-300 mt-2
                  ${loading
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-1 active:scale-95'
                  }`}>
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Signing in...
                  </span>
                ) : `Log in as ${role} →`}
              </button>
            </form>

            {/* Footer */}
            <div className={`mt-7 pt-6 border-t text-center ${dark ? 'border-gray-800' : 'border-gray-100'}`}>
              <p className={`text-xs font-semibold ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
                {role === 'Admin'
                  ? '🔐 Secure admin access · Mundiz-SchoolMS v1.0'
                  : '📚 Student credentials provided by your school'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes twinkle {
          from { opacity: 0.3; transform: scale(0.7); }
          to   { opacity: 1;   transform: scale(1.3); }
        }
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
      `}</style>
    </div>
  );
};

export default Login;
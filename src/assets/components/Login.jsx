import { useState } from "react";
import api from "../../api/axios";

export default function Login() {
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [form, setForm] = useState({ email: "", password: "" });

    // ✅ EXACT SAME FUNCTIONALITY AS BEFORE
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await api.post("/login", {
                email: form.email,
                password: form.password,
            });

            const { access_token, user } = response.data;
            localStorage.setItem("token", access_token);
            localStorage.setItem("user", JSON.stringify(user));

            window.location.href = 'http://127.0.0.1:8000';
            return;

        } catch (err) {
            console.log('Error details:', err);
            setError(err.response?.data?.message || "Login failed. Try again.");
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = {
        width: "100%", border: "1.5px solid #e5e7eb", borderRadius: "10px",
        padding: "0.65rem 1rem", fontSize: "0.9rem", fontFamily: "inherit",
        outline: "none", boxSizing: "border-box", color: "#111827",
        background: "white", transition: "border-color 0.2s, box-shadow 0.2s",
    };
    const labelStyle = {
        display: "block", fontSize: "0.72rem", fontWeight: "700",
        textTransform: "uppercase", letterSpacing: "0.05em",
        color: "#6b7280", marginBottom: "0.4rem",
    };
    const handleFocus = e => {
        e.target.style.borderColor = "#7c3aed";
        e.target.style.boxShadow = "0 0 0 3px rgba(124,58,237,0.1)";
    };
    const handleBlur = e => {
        e.target.style.borderColor = "#e5e7eb";
        e.target.style.boxShadow = "none";
    };

    return (
        <>
            <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
            <style>{`
                * { box-sizing: border-box; margin: 0; padding: 0; }
                body { background: #f8f7ff !important; }
                .ap-page { min-height: 100vh; background: #f8f7ff; display: flex; align-items: center; justify-content: center; font-family: 'Plus Jakarta Sans', sans-serif; padding: 1.5rem; }
                .ap-card { background: white; border-radius: 20px; border: 1px solid #e5e7eb; box-shadow: 0 1px 3px rgba(124,58,237,0.08), 0 8px 24px rgba(124,58,237,0.08); padding: 2.25rem; width: 100%; animation: fadeUp 0.35s ease both; }
                @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
                .ap-btn { width: 100%; background: linear-gradient(135deg, #7c3aed, #06b6d4); border: none; border-radius: 10px; color: white; font-weight: 700; font-size: 0.9rem; padding: 0.75rem; cursor: pointer; font-family: inherit; box-shadow: 0 2px 8px rgba(124,58,237,0.25); transition: opacity 0.2s, transform 0.2s; display: flex; align-items: center; justify-content: center; gap: 0.5rem; margin-top: 0.75rem; }
                .ap-btn:hover:not(:disabled) { opacity: 0.92; transform: translateY(-1px); }
                .ap-btn:disabled { opacity: 0.6; cursor: not-allowed; }
                .ap-oauth { flex: 1; display: flex; align-items: center; justify-content: center; gap: 0.5rem; background: white; border: 1.5px solid #e5e7eb; border-radius: 10px; padding: 0.6rem; font-size: 0.85rem; font-weight: 600; color: #374151; cursor: pointer; font-family: inherit; transition: all 0.2s; }
                .ap-oauth:hover { border-color: #7c3aed; color: #7c3aed; background: #f8f7ff; }
                .ap-toggle { position: absolute; right: 0.75rem; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: #9ca3af; padding: 0; display: flex; transition: color 0.2s; }
                .ap-toggle:hover { color: #7c3aed; }
                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>

            <div className="ap-page">
                <div style={{ width: "100%", maxWidth: "420px" }}>

                    {/* Header */}
                    <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
                        <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "52px", height: "52px", background: "linear-gradient(135deg,#7c3aed,#06b6d4)", borderRadius: "14px", marginBottom: "1rem", boxShadow: "0 4px 16px rgba(124,58,237,0.25)" }}>
                            <svg width="26" height="26" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <div style={{ fontSize: "0.72rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.1em", background: "linear-gradient(135deg,#7c3aed,#06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: "0.35rem" }}>
                            Academic Portal
                        </div>
                        <h1 style={{ fontSize: "1.6rem", fontWeight: "800", color: "#111827", margin: "0 0 0.25rem", letterSpacing: "-0.5px" }}>Welcome back</h1>
                        <p style={{ color: "#6b7280", fontSize: "0.875rem" }}>Sign in to continue to your account</p>
                    </div>

                    {/* Card */}
                    <div className="ap-card">
                        <form onSubmit={handleSubmit}>

                            {/* Email */}
                            <div style={{ marginBottom: "1.1rem" }}>
                                <label style={labelStyle}>Email</label>
                                <input
                                    type="email" required placeholder="you@example.com"
                                    value={form.email}
                                    onChange={e => setForm({ ...form, email: e.target.value })}
                                    style={inputStyle} onFocus={handleFocus} onBlur={handleBlur}
                                />
                            </div>

                            {/* Password */}
                            <div style={{ marginBottom: "0.5rem" }}>
                                <label style={labelStyle}>Password</label>
                                <div style={{ position: "relative" }}>
                                    <input
                                        type={showPass ? "text" : "password"} required placeholder="••••••••"
                                        value={form.password}
                                        onChange={e => setForm({ ...form, password: e.target.value })}
                                        style={{ ...inputStyle, paddingRight: "2.75rem" }}
                                        onFocus={handleFocus} onBlur={handleBlur}
                                    />
                                    <button type="button" className="ap-toggle" onClick={() => setShowPass(!showPass)}>
                                        {showPass ? (
                                            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                            </svg>
                                        ) : (
                                            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                <div style={{ textAlign: "right", marginTop: "0.4rem" }}>
                                    <a href="#" style={{ fontSize: "0.78rem", color: "#7c3aed", textDecoration: "none", fontWeight: "600" }}>Forgot password?</a>
                                </div>
                            </div>

                            {/* Error — same logic as before */}
                            {error && (
                                <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "10px", padding: "0.65rem 1rem", color: "#991b1b", fontSize: "0.85rem", marginBottom: "1rem", textAlign: "center" }}>
                                    {error}
                                </div>
                            )}

                            {/* Submit */}
                            <button type="submit" className="ap-btn" disabled={loading}>
                                {loading ? (
                                    <>
                                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" style={{ animation: "spin 1s linear infinite" }}>
                                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.25" />
                                            <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" opacity="0.75" />
                                        </svg>
                                        Signing in...
                                    </>
                                ) : "Sign In"}
                            </button>
                        </form>

                        {/* Divider */}
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", margin: "1.5rem 0" }}>
                            <div style={{ flex: 1, height: "1px", background: "#e5e7eb" }} />
                            <span style={{ fontSize: "0.78rem", color: "#9ca3af" }}>or continue with</span>
                            <div style={{ flex: 1, height: "1px", background: "#e5e7eb" }} />
                        </div>

                        {/* OAuth */}
                        <div style={{ display: "flex", gap: "0.75rem" }}>
                            <button className="ap-oauth">
                                <svg width="16" height="16" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                Google
                            </button>
                            <button className="ap-oauth">
                                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                                </svg>
                                GitHub
                            </button>
                        </div>

                        <p style={{ textAlign: "center", fontSize: "0.8rem", color: "#9ca3af", marginTop: "1.5rem" }}>
                            Don't have an account?{" "}
                            <a href="/register" style={{ color: "#7c3aed", fontWeight: "700", textDecoration: "none" }}>Create one</a>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
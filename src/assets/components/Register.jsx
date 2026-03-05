import { useState } from "react";
import api from "../../api/axios";

export default function Register() {
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [form, setForm] = useState({ name: "", email: "", password: "", password_confirmation: "" });

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const response = await api.post("/register", form);
            const { access_token, user } = response.data;
            localStorage.setItem("token", access_token);
            localStorage.setItem("user", JSON.stringify(user));
            window.location.href = "http://127.0.0.1:8000/auth/callback";
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed. Try again.");
        } finally {
            setLoading(false);
        }
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
                .ap-btn { width: 100%; background: linear-gradient(135deg, #7c3aed, #06b6d4); border: none; border-radius: 10px; color: white; font-weight: 700; font-size: 0.9rem; padding: 0.75rem; cursor: pointer; font-family: inherit; box-shadow: 0 2px 8px rgba(124,58,237,0.25); transition: opacity 0.2s, transform 0.2s; display: flex; align-items: center; justify-content: center; gap: 0.5rem; }
                .ap-btn:hover:not(:disabled) { opacity: 0.92; transform: translateY(-1px); }
                .ap-btn:disabled { opacity: 0.6; cursor: not-allowed; }
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
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                            </svg>
                        </div>
                        <div style={{ fontSize: "0.72rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.1em", background: "linear-gradient(135deg,#7c3aed,#06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: "0.35rem" }}>Academic Portal</div>
                        <h1 style={{ fontSize: "1.6rem", fontWeight: "800", color: "#111827", margin: "0 0 0.25rem", letterSpacing: "-0.5px" }}>Create account</h1>
                        <p style={{ color: "#6b7280", fontSize: "0.875rem" }}>Sign up to get started today</p>
                    </div>

                    {/* Card */}
                    <div className="ap-card">
                        <form onSubmit={handleSubmit}>

                            {/* Name */}
                            <div style={{ marginBottom: "1.1rem" }}>
                                <label style={labelStyle}>Full Name</label>
                                <input type="text" required placeholder="Juan Dela Cruz" value={form.name}
                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                    style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
                            </div>

                            {/* Email */}
                            <div style={{ marginBottom: "1.1rem" }}>
                                <label style={labelStyle}>Email</label>
                                <input type="email" required placeholder="you@example.com" value={form.email}
                                    onChange={e => setForm({ ...form, email: e.target.value })}
                                    style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
                            </div>

                            {/* Password */}
                            <div style={{ marginBottom: "1.1rem" }}>
                                <label style={labelStyle}>Password</label>
                                <div style={{ position: "relative" }}>
                                    <input type={showPass ? "text" : "password"} required placeholder="Min. 8 characters" value={form.password}
                                        onChange={e => setForm({ ...form, password: e.target.value })}
                                        style={{ ...inputStyle, paddingRight: "2.75rem" }} onFocus={handleFocus} onBlur={handleBlur} />
                                    <button type="button" className="ap-toggle" onClick={() => setShowPass(!showPass)}>
                                        {showPass ? (
                                            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                                        ) : (
                                            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div style={{ marginBottom: "0.75rem" }}>
                                <label style={labelStyle}>Confirm Password</label>
                                <input type={showPass ? "text" : "password"} required placeholder="••••••••" value={form.password_confirmation}
                                    onChange={e => setForm({ ...form, password_confirmation: e.target.value })}
                                    style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
                            </div>

                            {error && (
                                <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "10px", padding: "0.65rem 1rem", color: "#991b1b", fontSize: "0.85rem", marginBottom: "1rem", textAlign: "center" }}>
                                    {error}
                                </div>
                            )}

                            <button type="submit" className="ap-btn" disabled={loading} style={{ marginTop: "0.75rem" }}>
                                {loading ? (
                                    <>
                                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" style={{ animation: "spin 1s linear infinite" }}>
                                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.25" />
                                            <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" opacity="0.75" />
                                        </svg>
                                        Creating account...
                                    </>
                                ) : "Create Account"}
                            </button>
                        </form>

                        <p style={{ textAlign: "center", fontSize: "0.8rem", color: "#9ca3af", marginTop: "1.5rem" }}>
                            Already have an account?{" "}
                            <a href="/" style={{ color: "#7c3aed", fontWeight: "700", textDecoration: "none" }}>Sign in</a>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
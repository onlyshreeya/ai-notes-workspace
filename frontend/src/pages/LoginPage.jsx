import "../styles/auth.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError("Please enter your email and password.");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/auth/login`, formData);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-blobs">
        <div className="auth-blob auth-blob-1" />
        <div className="auth-blob auth-blob-2" />
      </div>
      <div className="auth-split auth-split-login">
        <div className="auth-left">
          <Link to="/" className="auth-brand">
            <div className="auth-brand-mark">P</div>
            <span>Peblo <em>Workplace</em></span>
          </Link>
          <div className="auth-left-body">
            <div className="auth-eyebrow">✦ Welcome back</div>
            <h1>Your ideas<br /><span>are waiting.</span></h1>
            <p>Sign in to continue building your second brain. Everything is right where you left it.</p>
          </div>
        </div>
        <div className="auth-right">
          <div className="auth-card">
            <div className="auth-card-header">
              <h2>Sign In</h2>
              <p>Good to have you back</p>
            </div>
            <form onSubmit={handleLogin} className="auth-form">
              <div className="auth-field">
                <label>Email address</label>
                <input type="email" name="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} autoComplete="email" />
              </div>
              <div className="auth-field">
                <label>Password</label>
                <input type="password" name="password" placeholder="Your password" value={formData.password} onChange={handleChange} autoComplete="current-password" />
              </div>
              {error && <div className="auth-error">{error}</div>}
              <button type="submit" className="auth-btn" disabled={loading}>
                {loading ? <span className="auth-spinner" /> : "Sign In →"}
              </button>
            </form>
            <p className="auth-switch">No account yet? <Link to="/signup">Create one free</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
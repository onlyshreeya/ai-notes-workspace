import "../styles/auth.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

function SignupPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      setError("All fields are required.");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/auth/signup`, formData);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Please try again.");
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
      <div className="auth-split">
        <div className="auth-left">
          <Link to="/" className="auth-brand">
            <div className="auth-brand-mark">P</div>
            <span>Peblo <em>Workplace</em></span>
          </Link>
          <div className="auth-left-body">
            <div className="auth-eyebrow">✦ Join thousands of writers</div>
            <h1>Build your<br /><span>second brain.</span></h1>
            <p>Capture ideas, generate AI summaries, and organize your world — all in one beautifully designed workspace.</p>
            <div className="auth-perks">
              <div className="auth-perk"><span>✓</span> Smart notes with AI summaries</div>
              <div className="auth-perk"><span>✓</span> Tags, search and filtering</div>
              <div className="auth-perk"><span>✓</span> Public sharing with links</div>
            </div>
          </div>
        </div>
        <div className="auth-right">
          <div className="auth-card">
            <div className="auth-card-header">
              <h2>Create Account</h2>
              <p>Start writing smarter today</p>
            </div>
            <form onSubmit={handleSignup} className="auth-form">
              <div className="auth-field">
                <label>Full name</label>
                <input type="text" name="name" placeholder="Your name" value={formData.name} onChange={handleChange} autoComplete="name" />
              </div>
              <div className="auth-field">
                <label>Email address</label>
                <input type="email" name="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} autoComplete="email" />
              </div>
              <div className="auth-field">
                <label>Password</label>
                <input type="password" name="password" placeholder="Min. 6 characters" value={formData.password} onChange={handleChange} autoComplete="new-password" />
              </div>
              {error && <div className="auth-error">{error}</div>}
              <button type="submit" className="auth-btn" disabled={loading}>
                {loading ? <span className="auth-spinner" /> : "Create Account →"}
              </button>
            </form>
            <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";
import "./AuthForm.css";

export default function Login() {
  const [emailOrUsername, setEU] = useState("");
  const [password, setPW] = useState("");
  const [err, setErr] = useState("");
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr("");

    try {
      const data = await API.login({
        emailOrUsername,
        password,
      });

      localStorage.setItem("token", data.token);
      nav("/");
    } catch (e) {
      setErr(e.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        {/* Brand */}
        <div className="auth-brand">
          <div className="brand-icon">✨</div>
          <h1>AshuApp</h1>
          <p>Welcome back</p>
        </div>

        <form onSubmit={submit} className="auth-form">

          <h2>Login</h2>

          {err && (
            <div className="auth-error">
              ⚠️ {err}
            </div>
          )}

          <div className="input-group">
            <label>Email or Username</label>
            <input
              value={emailOrUsername}
              onChange={(e) => setEU(e.target.value)}
              placeholder="Enter your email or username"
              autoComplete="username"
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              value={password}
              onChange={(e) => setPW(e.target.value)}
              placeholder="Enter your password"
              type="password"
              autoComplete="current-password"
              required
            />
          </div>

          <button type="submit" className="auth-button">
            Login
          </button>

        </form>

        <div className="auth-divider">
          <span>OR</span>
        </div>

        <p className="auth-footer">
          Don't have an account?
          <Link to="/register"> Create account</Link>
        </p>

      </div>
    </div>
  );
}
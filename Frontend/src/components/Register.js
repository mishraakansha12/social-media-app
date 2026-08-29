import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";
import "./AuthForm.css";

export default function Register() {
  const [username, setU] = useState("");
  const [email, setE] = useState("");
  const [password, setP] = useState("");
  const [err, setErr] = useState("");
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr("");

    try {
      const data = await API.register({
        username,
        email,
        password,
      });

      localStorage.setItem("token", data.token);
      nav("/");
    } catch (e) {
      setErr(e.response?.data?.message || "Register failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        {/* Brand */}
        <div className="auth-brand">
          <div className="brand-icon">✨</div>

          <h1>AshuApp</h1>

          <p>Join the community</p>
        </div>

        <form onSubmit={submit} className="auth-form">

          <h2>Create account</h2>

          {err && (
            <div className="auth-error">
              ⚠️ {err}
            </div>
          )}

          <div className="input-group">
            <label>Username</label>

            <input
              value={username}
              onChange={(e) => setU(e.target.value)}
              placeholder="Choose a username"
              autoComplete="username"
              required
            />
          </div>

          <div className="input-group">
            <label>Email</label>

            <input
              value={email}
              onChange={(e) => setE(e.target.value)}
              placeholder="Enter your email"
              type="email"
              autoComplete="email"
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>

            <input
              value={password}
              onChange={(e) => setP(e.target.value)}
              placeholder="Create a password"
              type="password"
              autoComplete="new-password"
              required
            />
          </div>

          <button type="submit" className="auth-button">
            Create account
          </button>

        </form>

        <div className="auth-divider">
          <span>OR</span>
        </div>

        <p className="auth-footer">
          Already have an account?
          <Link to="/login"> Login</Link>
        </p>

      </div>
    </div>
  );
}
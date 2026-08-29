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
      setErr(
        e.response?.data?.message ||
        "Login failed"
      );
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-card">

        <div className="auth-logo">
          Akansha
        </div>

        <h2>Welcome Back 👋</h2>

        <p className="auth-subtitle">
          Login to continue to your account
        </p>

        {err && (
          <div className="auth-error">
            {err}
          </div>
        )}

        <form onSubmit={submit}>

          <div className="input-group">
            <label>Email or Username</label>

            <input
              type="text"
              value={emailOrUsername}
              onChange={(e) =>
                setEU(e.target.value)
              }
              placeholder="Enter email or username"
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPW(e.target.value)
              }
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            className="auth-button"
          >
            Login
          </button>

        </form>

        <div className="auth-divider">
          Don't have an account?
        </div>

        <Link
          to="/register"
          className="auth-link-button"
        >
          Create New Account
        </Link>

      </div>

    </div>
  );
}
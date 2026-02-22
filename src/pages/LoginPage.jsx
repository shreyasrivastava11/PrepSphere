import React from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const next = {};
    if (!form.email.trim()) next.email = 'Email is required.';
    if (!form.password.trim()) next.password = 'Password is required.';
    return next;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = validate();
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }
    setLoading(true);
    const res = await login(form);
    setLoading(false);
    if (!res.ok) {
      setErrors({ form: res.message });
      return;
    }
    navigate('/dashboard');
  };

  return (
    <section className="form-wrap">
      <form className="card form-card" onSubmit={onSubmit}>
        <h2>Login</h2>
        <p className="muted">Sign in to continue your mock interview practice.</p>

        <label>Email</label>
        <input
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="you@example.com"
        />
        {errors.email ? <small className="error">{errors.email}</small> : null}

        <label>Password</label>
        <div className="password-row">
          <input
            type={showPass ? 'text' : 'password'}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="Enter password"
          />
          <button type="button" className="btn btn-outline" onClick={() => setShowPass((v) => !v)}>
            {showPass ? 'Hide' : 'Show'}
          </button>
        </div>
        {errors.password ? <small className="error">{errors.password}</small> : null}
        {errors.form ? <small className="error">{errors.form}</small> : null}

        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? 'Signing in...' : 'Login'}
        </button>
        <p className="muted center">
          New user? <Link to="/register">Register here</Link>
        </p>
      </form>
    </section>
  );
}

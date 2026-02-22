import React from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Name is required.';
    if (!form.email.trim()) next.email = 'Email is required.';
    if (!form.password.trim()) next.password = 'Password is required.';
    if (form.password.length > 0 && form.password.length < 6) next.password = 'Password must be at least 6 characters.';
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
    const res = await register(form);
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
        <h2>Register</h2>
        <label>Full Name</label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Your full name"
        />
        {errors.name ? <small className="error">{errors.name}</small> : null}

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
            placeholder="Create password"
          />
          <button type="button" className="btn btn-outline" onClick={() => setShowPass((v) => !v)}>
            {showPass ? 'Hide' : 'Show'}
          </button>
        </div>
        {errors.password ? <small className="error">{errors.password}</small> : null}
        {errors.form ? <small className="error">{errors.form}</small> : null}

        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Account'}
        </button>
        <p className="muted center">
          Already registered? <Link to="/login">Login</Link>
        </p>
      </form>
    </section>
  );
}

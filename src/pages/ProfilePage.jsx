import React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../lib/api';

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [loadError, setLoadError] = useState('');
  const [saving, setSaving] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const [profile, attempts] = await Promise.all([apiRequest('/api/users/me'), apiRequest('/api/tests/history')]);
        if (!mounted) return;
        setName(profile.name || '');
        setEmail(profile.email || '');
        setHistory(attempts || []);
        setLoadError('');
      } catch (error) {
        if (mounted) setLoadError(error.message);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const bestTopic = useMemo(() => {
    const topicMap = {};
    history.forEach((item) => {
      const topic = (item.category || '').trim();
      if (!topic) return;
      if (!topicMap[topic]) topicMap[topic] = { total: 0, count: 0 };
      topicMap[topic].total += item.percentage || item.score || 0;
      topicMap[topic].count += 1;
    });
    const entries = Object.entries(topicMap).map(([topic, value]) => ({
      topic,
      avg: Math.round(value.total / value.count),
    }));
    if (!entries.length) return null;
    entries.sort((a, b) => b.avg - a.avg);
    return entries[0].topic;
  }, [history]);

  const initials = (name || user?.name || 'PS')
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0] || '')
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const saveProfile = async () => {
    if (!name.trim() || !email.trim()) {
      setMessage('Name and email are required.');
      setTimeout(() => setMessage(''), 2000);
      return;
    }

    setSaving(true);
    try {
      await apiRequest('/api/users/me', {
        method: 'PUT',
        body: JSON.stringify({ name: name.trim(), email: email.trim() }),
      });
      await refreshUser();
      setMessage('Profile updated successfully.');
      setTimeout(() => setMessage(''), 2000);
    } catch (error) {
      setMessage(error.message);
      setTimeout(() => setMessage(''), 2200);
    } finally {
      setSaving(false);
    }
  };

  const updatePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage('Please fill all password fields.');
      setTimeout(() => setMessage(''), 2000);
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match.');
      setTimeout(() => setMessage(''), 2000);
      return;
    }
    if (newPassword.length < 6) {
      setMessage('New password must be at least 6 characters.');
      setTimeout(() => setMessage(''), 2200);
      return;
    }

    try {
      await apiRequest('/api/users/me/password', {
        method: 'PUT',
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      });
      setMessage('Password updated successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setMessage(''), 2200);
    } catch (error) {
      setMessage(error.message);
      setTimeout(() => setMessage(''), 2200);
    }
  };

  return (
    <section className="profile-page">
      {loadError ? <p className="error">{loadError}</p> : null}
      <article className="card profile-hero">
        <div className="profile-avatar">{initials}</div>
        <div className="profile-meta">
          <h2>{name}</h2>
          <p className="muted">{email}</p>
          <div className="profile-badges">
            <span>{bestTopic ? bestTopic : 'Interview Candidate'}</span>
          </div>
        </div>
      </article>

      <div className="profile-grid">
        <article className="card profile-form">
          <h3>Account Details</h3>
          <p className="muted">Keep your profile information up to date.</p>
          <label>User Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} />

          <label>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} />

          <button className="btn btn-primary" onClick={saveProfile} disabled={saving}>
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </article>

        <article className="card profile-form">
          <h3>Security</h3>
          <p className="muted">Change your password regularly to keep account access secure.</p>
          <label>Current Password</label>
          <div className="password-input-wrap">
            <input
              type={showCurrentPassword ? 'text' : 'password'}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Current password"
            />
            <button className="btn btn-outline btn-sm" type="button" onClick={() => setShowCurrentPassword((prev) => !prev)}>
              {showCurrentPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          <label>New Password</label>
          <div className="password-input-wrap">
            <input
              type={showNewPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New password"
            />
            <button className="btn btn-outline btn-sm" type="button" onClick={() => setShowNewPassword((prev) => !prev)}>
              {showNewPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          <label>Confirm Password</label>
          <div className="password-input-wrap">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
            />
            <button className="btn btn-outline btn-sm" type="button" onClick={() => setShowConfirmPassword((prev) => !prev)}>
              {showConfirmPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          <button className="btn btn-outline" type="button" onClick={updatePassword}>
            Update Password
          </button>
        </article>
      </div>

      {message ? <small className="success">{message}</small> : null}
    </section>
  );
}

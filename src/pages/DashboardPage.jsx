import React from 'react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../lib/api';

export default function DashboardPage() {
  const { user } = useAuth();
  const [totalTests, setTotalTests] = useState(0);
  const [average, setAverage] = useState(0);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const data = await apiRequest('/api/tests/analytics');
        if (!mounted) return;
        setTotalTests(data.totalTests || 0);
        setAverage(data.averageScore || 0);
      } catch (error) {
        if (mounted) {
          setTotalTests(0);
          setAverage(0);
        }
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section>
      <h2>Welcome back, {user.name}</h2>
      <p className="muted">Track progress and continue your interview preparation.</p>

      <div className="cards-grid">
        <article className="card stat-card">
          <h3>Total Tests Attempted</h3>
          <p className="stat-value">{totalTests}</p>
        </article>
        <article className="card stat-card">
          <h3>Average Score</h3>
          <p className="stat-value">{average}%</p>
        </article>
      </div>

      <div className="cards-grid">
        <Link className="card action-card" to="/mock-test">
          <h3>Start Test</h3>
          <p>Begin a timed mock interview now.</p>
        </Link>
        <Link className="card action-card" to="/history">
          <h3>View History</h3>
          <p>See your previous attempts and scores.</p>
        </Link>
        <Link className="card action-card" to="/profile">
          <h3>View Profile</h3>
          <p>Manage account and profile details.</p>
        </Link>
      </div>
    </section>
  );
}

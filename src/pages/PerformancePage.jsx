import React, { useEffect, useMemo, useState } from 'react';
import { apiRequest } from '../lib/api';

export default function PerformancePage() {
  const [analytics, setAnalytics] = useState({
    totalTests: 0,
    averageScore: 0,
    bestScore: 0,
    weakCategory: 'N/A',
    trend: [],
  });
  const [history, setHistory] = useState([]);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const [analyticsRes, historyRes] = await Promise.all([apiRequest('/api/tests/analytics'), apiRequest('/api/tests/history')]);
        if (!mounted) return;
        setAnalytics(analyticsRes || {});
        setHistory(historyRes || []);
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

  const chartBars = useMemo(() => {
    const source = analytics.trend?.length
      ? analytics.trend.map((t, idx) => ({ label: `T${idx + 1}`, value: t.percentage || 0 }))
      : history.slice(0, 6).map((h, idx) => ({ label: `T${idx + 1}`, value: h.percentage || 0 }));
    return source;
  }, [analytics, history]);

  const totals = useMemo(() => {
    return history.reduce(
      (acc, item) => {
        acc.correct += item.correctAnswers || 0;
        acc.wrong += item.wrongAnswers || 0;
        return acc;
      },
      { correct: 0, wrong: 0 }
    );
  }, [history]);

  return (
    <section className="performance-page">
      <header className="section-head">
        <div>
          <h2>Performance Dashboard</h2>
          <p className="muted">Monitor your interview readiness with backend-evaluated test analytics.</p>
        </div>
      </header>

      {loadError ? <p className="error">{loadError}</p> : null}

      <div className="cards-grid performance-cards">
        <article className="card stat-card">
          <h3>Total Tests</h3>
          <p className="stat-value">{analytics.totalTests || 0}</p>
        </article>
        <article className="card stat-card">
          <h3>Best Score</h3>
          <p className="stat-value">{analytics.bestScore || 0}%</p>
        </article>
        <article className="card stat-card">
          <h3>Weak Category</h3>
          <p className="stat-value">{analytics.weakCategory || 'N/A'}</p>
        </article>
        <article className="card stat-card">
          <h3>Average Score</h3>
          <p className="stat-value">{analytics.averageScore || 0}%</p>
        </article>
        <article className="card stat-card">
          <h3>Total Correct</h3>
          <p className="stat-value">{totals.correct}</p>
        </article>
        <article className="card stat-card">
          <h3>Total Wrong</h3>
          <p className="stat-value">{totals.wrong}</p>
        </article>
      </div>

      <div className="performance-grid">
        <article className="card chart-card">
          <h3>Progress Chart</h3>
          <p className="muted">Recent test attempt percentages</p>
          {chartBars.length === 0 ? (
            <p className="chart-empty">No data yet. Complete a test to see progress.</p>
          ) : (
            <div className="mini-chart">
              {chartBars.map((bar) => (
                <div key={bar.label} className="bar-wrap">
                  <div className="bar" style={{ height: `${bar.value}%` }} title={`${bar.value}%`} />
                  <strong>{bar.value}%</strong>
                  <span>{bar.label}</span>
                </div>
              ))}
            </div>
          )}
        </article>

        <article className="card insights-card">
          <h3>Performance Insights</h3>
          <p className="muted">Auto-generated from backend test history.</p>
          <div className="insight-list">
            <p>
              <strong>Consistency:</strong> Keep your score above {Math.max(60, (analytics.averageScore || 0) - 10)}%.
            </p>
            <p>
              <strong>Focus Area:</strong> Spend extra practice time on {analytics.weakCategory || 'core topics'}.
            </p>
            <p>
              <strong>Target:</strong> Aim for {Math.max(80, analytics.bestScore || 0)}% for interview readiness.
            </p>
          </div>
        </article>
      </div>
    </section>
  );
}

import React from 'react';
import { useEffect, useState } from 'react';
import { apiRequest } from '../lib/api';

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const data = await apiRequest('/api/tests/history');
        if (!mounted) return;
        const normalized = (data || []).map((item) => ({
          exam: item.category,
          duration: null,
          score: item.score,
          correct: item.correctAnswers,
          wrong: item.wrongAnswers,
          percentage: item.percentage,
          date: item.submittedAt || item.startedAt,
        }));
        setHistory(normalized);
        setLoadError('');
      } catch (error) {
        if (mounted) {
          setHistory([]);
          setLoadError(error.message);
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
      <h2>Test History</h2>
      <p className="muted">Previous mock interview attempts</p>
      {loadError ? <p className="error">{loadError}</p> : null}
      {history.length === 0 ? (
        <article className="card">
          <p>No attempts yet. Start your first test from the dashboard.</p>
        </article>
      ) : (
        <div className="cards-grid">
          {history
            .slice()
            .reverse()
            .map((item, idx) => (
              <article className="card" key={`${item.date}-${idx}`}>
                <h3>Attempt {history.length - idx}</h3>
                <p>Exam: {item.exam || 'General'}</p>
                <p>Duration: {item.duration ? `${item.duration} min` : 'N/A'}</p>
                <p>Score: {item.score}</p>
                <p>Correct: {item.correct ?? 'N/A'}</p>
                <p>Wrong: {item.wrong ?? 'N/A'}</p>
                <p>Percentage: {item.percentage}%</p>
                <small className="muted">{new Date(item.date).toLocaleString()}</small>
              </article>
            ))}
        </div>
      )}
    </section>
  );
}

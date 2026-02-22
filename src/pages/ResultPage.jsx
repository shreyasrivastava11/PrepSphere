import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { apiRequest } from '../lib/api';

function messageFor(percentage) {
  if (percentage >= 85) return 'Excellent performance. You are interview-ready.';
  if (percentage >= 65) return 'Good progress. Focus on weak areas for better consistency.';
  return 'Keep practicing. Your fundamentals will improve with regular mocks.';
}

export default function ResultPage() {
  const { state } = useLocation();
  const [result, setResult] = useState(state || null);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let mounted = true;
    if (state) return undefined;

    const load = async () => {
      try {
        const data = await apiRequest('/api/tests/latest');
        if (!mounted) return;
        setResult({
          score: data.score,
          correct: data.correctAnswers,
          wrong: data.wrongAnswers,
          percentage: data.percentage,
          total: (data.correctAnswers || 0) + (data.wrongAnswers || 0),
          exam: 'Latest Mock',
          duration: null,
          review: (data.review || []).map((r) => ({
            index: r.order,
            question: r.question,
            selected: r.selectedOption,
            correctAnswer: r.correctOption,
            isCorrect: r.correct,
          })),
        });
      } catch (error) {
        if (mounted) setLoadError(error.message);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [state]);

  if (!result) {
    return (
      <section className="card">
        <p>{loadError || 'No result found. Start a mock test first.'}</p>
        <Link to="/mock-test" className="btn btn-primary">
          Go to Mock Test
        </Link>
      </section>
    );
  }

  return (
    <section>
      <h2>Test Result</h2>
      <div className="cards-grid">
        <article className="card stat-card">
          <h3>Exam Track</h3>
          <p className="stat-note">{result.exam || 'General'}</p>
        </article>
        <article className="card stat-card">
          <h3>Duration</h3>
          <p className="stat-note">{result.duration ? `${result.duration} min` : 'N/A'}</p>
        </article>
        <article className="card stat-card">
          <h3>Score</h3>
          <p className="stat-value">{result.score}%</p>
        </article>
        <article className="card stat-card">
          <h3>Correct Answers</h3>
          <p className="stat-value">{result.correct}</p>
        </article>
        <article className="card stat-card">
          <h3>Wrong Answers</h3>
          <p className="stat-value">{result.wrong}</p>
        </article>
        <article className="card stat-card">
          <h3>Percentage</h3>
          <p className="stat-value">{result.percentage}%</p>
        </article>
      </div>
      <article className="card result-note">
        <h3>Performance Message</h3>
        <p>{messageFor(result.percentage)}</p>
        <p className="muted">Correct Ratio: {`${result.correct}/${result.total || result.correct + result.wrong}`}</p>
      </article>

      {result.review?.length ? (
        <article className="card result-review">
          <h3>Answer Review</h3>
          <div className="review-list">
            {result.review.map((item) => (
              <div key={item.index} className={`review-item ${item.isCorrect ? 'ok' : 'bad'}`}>
                <p>
                  <strong>Q{item.index}.</strong> {item.question}
                </p>
                <p>
                  <strong>Your answer:</strong> {item.selected}
                </p>
                {!item.isCorrect ? (
                  <p>
                    <strong>Correct answer:</strong> {item.correctAnswer}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </article>
      ) : null}
      <div className="hero-actions">
        <Link to="/mock-test" className="btn btn-primary">
          Retake Test
        </Link>
        <Link to="/performance" className="btn btn-outline">
          View Performance Dashboard
        </Link>
      </div>
    </section>
  );
}

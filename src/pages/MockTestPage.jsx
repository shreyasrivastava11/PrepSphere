import React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../lib/api';

const TOPIC_OPTIONS = ['Java', 'JavaScript', 'HTML', 'CSS', 'SQL', 'React', 'Spring Boot', 'Node.js', 'Linux', 'System Design'];
const TOPIC_META = {
  Java: { subtitle: 'Core OOP, collections, and JVM concepts' },
  JavaScript: { subtitle: 'ES6+, async flows, and browser fundamentals' },
  HTML: { subtitle: 'Semantic structure and accessibility basics' },
  CSS: { subtitle: 'Layouts, responsive styling, and visual rules' },
  SQL: { subtitle: 'Queries, joins, filters, and aggregations' },
  React: { subtitle: 'Components, hooks, and rendering patterns' },
  'Spring Boot': { subtitle: 'Java backend APIs, security, and data layers' },
  'Node.js': { subtitle: 'Event-driven backend with async architecture' },
  Linux: { subtitle: 'Server operations, process, logs, and deployment basics' },
  'System Design': { subtitle: 'Scalability, reliability, and architecture trade-offs' },
};

const DURATION_OPTIONS = [2, 5, 10];

export default function MockTestPage() {
  const [selectedTopic, setSelectedTopic] = useState(TOPIC_OPTIONS[0]);
  const [selectedDuration, setSelectedDuration] = useState(5);
  const [isStarted, setIsStarted] = useState(false);
  const [testQuestions, setTestQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [setupError, setSetupError] = useState('');
  const [attemptId, setAttemptId] = useState(null);
  const [starting, setStarting] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const question = testQuestions[current];

  const startTest = async () => {
    setStarting(true);
    setSetupError('');

    try {
      const response = await apiRequest('/api/tests/start', {
        method: 'POST',
        body: JSON.stringify({
          category: selectedTopic,
          difficulty: null,
          questionCount: 15,
          durationMinutes: selectedDuration,
        }),
      });

      const mappedQuestions = response.questions.map((q) => ({
        id: q.id,
        category: q.category,
        difficulty: q.difficulty,
        question: q.text,
        options: [q.optionA, q.optionB, q.optionC, q.optionD],
        optionMap: { A: q.optionA, B: q.optionB, C: q.optionC, D: q.optionD },
      }));

      if (!mappedQuestions.length) {
        setSetupError(`No questions available for ${selectedTopic}. Please try another topic.`);
        return;
      }

      setAttemptId(response.attemptId);
      setTestQuestions(mappedQuestions);
      setCurrent(0);
      setAnswers({});
      const initialSeconds = Math.max(0, Math.floor((new Date(response.expiresAt).getTime() - Date.now()) / 1000));
      setTimeLeft(initialSeconds);
      setIsStarted(true);
    } catch (error) {
      setSetupError(`Unable to start mock test: ${error.message}`);
    } finally {
      setStarting(false);
    }
  };

  const submit = async () => {
    if (!testQuestions.length) return;
    if (!attemptId) {
      setSetupError('Attempt ID missing. Please restart test.');
      return;
    }

    setSubmitting(true);

    try {
      const letterForQuestion = (q) => {
        const selectedText = answers[q.id];
        if (!selectedText) return '';
        const entries = Object.entries(q.optionMap || {});
        const found = entries.find(([, value]) => value === selectedText);
        return found ? found[0] : '';
      };

      const payload = {
        answers: testQuestions.map((q) => ({
          questionId: q.id,
          selectedOption: letterForQuestion(q) || 'NA',
        })),
      };

      const response = await apiRequest(`/api/tests/${attemptId}/submit`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      const byQuestionId = Object.fromEntries(testQuestions.map((q) => [q.id, q]));
      const letterToText = (qid, letter) => {
        if (!letter || letter === 'Not Answered') return 'Not Answered';
        const map = byQuestionId[qid]?.optionMap || {};
        return map[letter] || letter;
      };

      const review = (response.review || []).map((item) => ({
        index: item.order,
        question: item.question,
        selected: letterToText(item.questionId, item.selectedOption),
        correctAnswer: letterToText(item.questionId, item.correctOption),
        isCorrect: item.correct,
      }));

      const result = {
        score: response.score,
        correct: response.correctAnswers,
        wrong: response.wrongAnswers,
        percentage: response.percentage,
        total: response.correctAnswers + response.wrongAnswers,
        exam: `${selectedTopic} Mock`,
        duration: selectedDuration,
        topic: selectedTopic,
        correctRatio: `${response.correctAnswers}/${response.correctAnswers + response.wrongAnswers}`,
        review,
        date: response.submittedAt || new Date().toISOString(),
      };

      navigate('/result', { state: result });
    } catch (error) {
      setSetupError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (!isStarted) return;
    if (timeLeft <= 0) {
      submit();
      return;
    }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [isStarted, timeLeft]);

  const progress = useMemo(() => {
    if (!testQuestions.length) return 0;
    const answeredCount = testQuestions.filter((q) => Boolean(answers[q.id])).length;
    return Math.round((answeredCount / testQuestions.length) * 100);
  }, [answers, testQuestions]);

  const answeredCount = testQuestions.filter((q) => Boolean(answers[q.id])).length;

  if (!isStarted) {
    return (
      <section className="mock-page">
        <header className="section-head">
          <h2>Mock Interview Test</h2>
          <p className="muted">Select your topic and preferred duration before starting the test.</p>
        </header>

        <div className="mock-setup">
          <article className="card setup-card">
            <h3>Choose Topic</h3>
            <p className="muted">Questions will be shown from your selected topic only.</p>
            <div className="exam-grid">
              {TOPIC_OPTIONS.map((topic) => (
                <button
                  key={topic}
                  className={`exam-option ${selectedTopic === topic ? 'active' : ''}`}
                  onClick={() => setSelectedTopic(topic)}
                >
                  <div>
                    <strong>{topic}</strong>
                    <span>{TOPIC_META[topic].subtitle}</span>
                  </div>
                  <small>15 questions</small>
                </button>
              ))}
            </div>
          </article>

          <article className="card setup-card">
            <h3>Choose Duration</h3>
            <p className="muted">Pick the time slot for this mock interview.</p>
            <div className="duration-row">
              {DURATION_OPTIONS.map((duration) => (
                <button
                  key={duration}
                  className={`duration-option ${selectedDuration === duration ? 'active' : ''}`}
                  onClick={() => setSelectedDuration(duration)}
                >
                  {duration} min
                </button>
              ))}
            </div>
            <div className="setup-summary">
              <p>
                <strong>Selected Topic:</strong> {selectedTopic}
              </p>
              <p>
                <strong>Selected Duration:</strong> {selectedDuration} minutes
              </p>
            </div>
            <button className="btn btn-primary" onClick={startTest} disabled={starting}>
              {starting ? 'Starting...' : 'Start Mock Test'}
            </button>
            {setupError ? <p className="error">{setupError}</p> : null}
          </article>
        </div>
      </section>
    );
  }

  if (!question) {
    return (
      <section className="mock-page">
        <article className="card">
          <p className="error">Question loading failed. Please restart the mock test.</p>
          <button className="btn btn-primary" onClick={() => setIsStarted(false)}>
            Back to Setup
          </button>
        </article>
      </section>
    );
  }

  return (
    <section className="mock-page">
      <div className="test-head">
        <div>
          <h2>{selectedTopic} Mock Test</h2>
          <p className="muted">
            Question {current + 1} of {testQuestions.length}
          </p>
        </div>
        <div className="timer">Time Left: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}</div>
      </div>

      <div className="progress-wrap">
        <div className="progress-label">
          Progress: {progress}% ({answeredCount}/{testQuestions.length} answered)
        </div>
        <div className="progress-bar">
          <span style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="test-layout">
        <article className="card test-card">
          <p className="question-chip">Interview Scenario {current + 1}</p>
          <h3>{question.question}</h3>
          <div className="options">
            {question.options.map((opt, index) => (
              <label key={opt} className={`option ${answers[question.id] === opt ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name={`q-${question.id}`}
                  checked={answers[question.id] === opt}
                  onChange={() => setAnswers({ ...answers, [question.id]: opt })}
                />
                <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                <span>{opt}</span>
              </label>
            ))}
          </div>
        </article>

        <aside className="card test-summary">
          <h3>Test Summary</h3>
          <div className="summary-grid">
            <p>
              <strong>Topic:</strong> {selectedTopic}
            </p>
            <p>
              <strong>Duration:</strong> {selectedDuration} min
            </p>
            <p>
              <strong>Answered:</strong> {answeredCount} / {testQuestions.length}
            </p>
          </div>
          <div className="question-palette">
            <h4>Question Palette</h4>
            <div className="palette-grid">
              {testQuestions.map((q, idx) => {
                const isCurrent = idx === current;
                const isAnswered = Boolean(answers[q.id]);
                return (
                  <button
                    key={q.id}
                    className={`palette-btn ${isCurrent ? 'current' : ''} ${isAnswered ? 'answered' : ''}`}
                    onClick={() => setCurrent(idx)}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>
      </div>

      <div className="test-actions">
        <button className="btn btn-outline" onClick={() => setCurrent((v) => Math.max(v - 1, 0))} disabled={current === 0}>
          Previous
        </button>
        {current < testQuestions.length - 1 ? (
          <button className="btn btn-primary" onClick={() => setCurrent((v) => Math.min(v + 1, testQuestions.length - 1))}>
            Next
          </button>
        ) : (
          <button className="btn btn-primary" onClick={submit}>
            {submitting ? 'Submitting...' : 'Submit Test'}
          </button>
        )}
      </div>
    </section>
  );
}

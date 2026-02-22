import React, { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { QUESTION_BANK } from '../data/questions';

function isAnswerCorrect(answer, keywords = []) {
  const normalized = answer.trim().toLowerCase();
  if (normalized.length < 40) return false;
  const hitCount = keywords.filter((keyword) => normalized.includes(keyword.toLowerCase())).length;
  return hitCount >= 2;
}

export default function QuestionSolvePage() {
  const { id } = useParams();
  const question = useMemo(() => QUESTION_BANK.find((q) => q.id === Number(id)), [id]);
  const [answerText, setAnswerText] = useState('');
  const [feedback, setFeedback] = useState('');
  const [hintIndex, setHintIndex] = useState(0);
  const [attemptCount, setAttemptCount] = useState(0);
  const [solvedRecord, setSolvedRecord] = useState(null);

  if (!question) {
    return (
      <section className="card">
        <p>Question not found.</p>
        <Link to="/questions" className="btn btn-outline">
          Back to Questions
        </Link>
      </section>
    );
  }

  const submitAnswer = () => {
    if (!answerText.trim()) {
      setFeedback('Please write an answer before submitting.');
      return;
    }

    const currentAttempts = attemptCount + 1;
    setAttemptCount(currentAttempts);

    const correct = isAnswerCorrect(answerText, question.keywords);

    if (!correct) {
      setFeedback(`Answer is not correct. Attempt ${currentAttempts}. Try again or use a hint.`);
      return;
    }

    const score = Math.max(40, 100 - (currentAttempts - 1) * 15);
    setSolvedRecord({
      questionId: question.id,
      score,
      attempts: currentAttempts,
    });
    setFeedback(`Correct. Solved in ${currentAttempts} attempt(s). Score recorded: ${score}%.`);
  };

  const revealHint = () => {
    setHintIndex((prev) => Math.min(prev + 1, question.hints.length));
  };

  return (
    <section className="practice-solve-page">
      <header className="section-head">
        <h2>{question.shortTitle}</h2>
        <p className="muted">{question.difficulty}</p>
      </header>

      <article className="card solve-card">
        <h3>{question.title}</h3>
        <p>{question.question}</p>

        <div className="hint-wrap">
          <button className="btn btn-outline" onClick={revealHint} disabled={hintIndex >= question.hints.length}>
            Show Hint
          </button>
          {hintIndex > 0 ? (
            <ul className="hint-list">
              {question.hints.slice(0, hintIndex).map((hint) => (
                <li key={hint}>{hint}</li>
              ))}
            </ul>
          ) : null}
        </div>

        <textarea
          className="answer-box"
          rows="9"
          placeholder="Write your answer here..."
          value={answerText}
          onChange={(e) => setAnswerText(e.target.value)}
        />

        <div className="hero-actions">
          <button className="btn btn-primary" onClick={submitAnswer}>
            Submit Answer
          </button>
          <Link to="/questions" className="btn btn-outline">
            Back to Questions
          </Link>
        </div>

        {feedback ? <p className={feedback.startsWith('Correct') ? 'success' : 'error'}>{feedback}</p> : null}
        {solvedRecord ? (
          <p className="muted">Solved in {solvedRecord.attempts} attempt(s), score {solvedRecord.score}%.</p>
        ) : null}
      </article>
    </section>
  );
}

import React from 'react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CATEGORIES, DIFFICULTIES, QUESTION_BANK } from '../data/questions';

const PAGE_SIZE = 12;

export default function QuestionsPage() {
  const [category, setCategory] = useState('All');
  const [difficulty, setDifficulty] = useState('All');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return QUESTION_BANK.filter((q) => {
      const byCategory = category === 'All' || q.category === category;
      const byDifficulty = difficulty === 'All' || q.difficulty === difficulty;
      const bySearch = q.shortTitle.toLowerCase().includes(query.toLowerCase()) || q.title.toLowerCase().includes(query.toLowerCase());
      return byCategory && byDifficulty && bySearch;
    });
  }, [category, difficulty, query]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const updatePage = (value) => setPage(Math.min(Math.max(value, 1), pageCount));

  return (
    <section>
      <h2>Question Listing</h2>
      <div className="filters-row card">
        <input
          type="text"
          placeholder="Search question title..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
        />
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setPage(1);
          }}
        >
          {CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <select
          value={difficulty}
          onChange={(e) => {
            setDifficulty(e.target.value);
            setPage(1);
          }}
        >
          {DIFFICULTIES.map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>
      </div>

      <div className="question-list">
        {pageData.map((q) => (
          <article key={q.id} className="card question-title-card">
            <div className="badges">
              <span className="badge">{q.category}</span>
              <span className="badge badge-soft">{q.difficulty}</span>
            </div>
            <Link className="question-title-btn" to={`/questions/${q.id}`}>
              {q.shortTitle}
            </Link>
          </article>
        ))}
        {pageData.length === 0 ? <article className="card">No matching questions found.</article> : null}
      </div>

      <div className="pagination">
        <button className="btn btn-outline" onClick={() => updatePage(page - 1)} disabled={page === 1}>
          Previous
        </button>
        <span>
          Page {page} / {pageCount}
        </span>
        <button className="btn btn-outline" onClick={() => updatePage(page + 1)} disabled={page === pageCount}>
          Next
        </button>
      </div>
    </section>
  );
}

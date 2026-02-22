import React from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <section className="hero hero-home">
      <div className="hero-content">
        <p className="eyebrow">Mock Interview Practice Platform</p>
        <h1>PrepSphere helps you practice like a real interview cycle.</h1>
        <p className="lead">
          Build consistency with realistic mocks, track performance, and strengthen backend, system design, and developer
          fundamentals.
        </p>
        <div className="hero-actions">
          <Link to="/register" className="btn btn-primary">
            Get Started
          </Link>
          <Link to="/register" className="btn btn-outline">
            Register
          </Link>
        </div>
      </div>

      <div className="hero-visual card">
        <div className="globe-stage">
          <div className="globe-orbit orbit-a" />
          <div className="globe-orbit orbit-b" />
          <div className="globe-core">
            <div className="globe-shine" />
            <div className="globe-grid" />
          </div>
          <div className="globe-pulse pulse-a" />
          <div className="globe-pulse pulse-b" />
        </div>
        <div className="hero-stats">
          <article>
            <h4>1000+</h4>
            <span>Practice Problems</span>
          </article>
          <article>
            <h4>15/topic</h4>
            <span>Mock Questions</span>
          </article>
          <article>
            <h4>Live</h4>
            <span>Progress Insights</span>
          </article>
        </div>
      </div>
    </section>
  );
}

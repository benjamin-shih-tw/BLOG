'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function PortfolioFilter({ localProjects, githubProjects }) {
  const [activeTab, setActiveTab] = useState('blog');

  return (
    <div>
      <div className="tabs">
        <button 
          className={`tab-btn ${activeTab === 'blog' ? 'active' : ''}`}
          onClick={() => setActiveTab('blog')}
        >
          Blog / Notes
        </button>
        <button 
          className={`tab-btn ${activeTab === 'projects' ? 'active' : ''}`}
          onClick={() => setActiveTab('projects')}
        >
          GitHub Projects
        </button>
      </div>

      {activeTab === 'blog' && (
        <section className="projects-section">
          <div className="grid">
            {localProjects.map(({ slug, title, date, description }) => (
              <Link href={`/projects/${slug}`} key={slug} className="card">
                <div className="card-header">
                  <div className="icon-box blue">📝</div>
                  <div className="tag pink">{date}</div>
                </div>
                <h3>{title}</h3>
                <div className="description">{description}</div>
                <div className="tag-container">
                  <span className="tag">Read More</span>
                </div>
              </Link>
            ))}
            {localProjects.length === 0 && <p>No notes found. Add markdown files to src/data/projects!</p>}
          </div>
        </section>
      )}

      {activeTab === 'projects' && (
        <section className="projects-section">
          <div className="grid">
            {githubProjects.map((repo) => (
              <a href={repo.url} target="_blank" rel="noopener noreferrer" key={repo.id} className="card">
                <div className="card-header">
                  <div className="icon-box red">⚡</div>
                  <div className="tag yellow">⭐️ {repo.stars}</div>
                </div>
                <h3>{repo.title}</h3>
                <div className="description">{repo.description}</div>
                <div className="tag-container">
                  {repo.language && <span className="tag blue">{repo.language}</span>}
                  <span className="tag">Source</span>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

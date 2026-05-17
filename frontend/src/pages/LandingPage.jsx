import "../styles/landing.css";
import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <div className="landing-page">
      {/* NAVBAR */}
      <nav>
        <Link to="/" className="nav-logo">
          <div className="nav-logo-mark">P</div>

          <span className="nav-logo-text">
            Peblo <span>Workplace</span>
          </span>
        </Link>

        <ul className="nav-links">
          <li>
            <a href="#features">Features</a>
          </li>

          <li>
            <a href="#about">About</a>
          </li>

          <li>
            <a href="#how">How it works</a>
          </li>
        </ul>

        <div className="nav-actions">
          <Link to="/login" className="btn-ghost">
            Sign in
          </Link>

          <Link to="/signup" className="btn-primary">
            Get started →
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>

        <div className="hero-inner">
          <div className="hero-eyebrow">
            ✦ AI-Powered Notes Workspace
          </div>

          <h1 className="hero-title">
            Your ideas deserve
            <br />
            a <em>smarter</em> home
          </h1>

          <p className="hero-sub">
            Peblo Workplace brings together notes, AI summaries,
            tags, and collaboration — all in one beautifully
            designed workspace.
          </p>

          <div className="hero-cta">
            <Link to="/signup" className="btn-hero">
              Start writing free →
            </Link>

            <a href="#features" className="btn-hero-ghost">
              See features
            </a>
          </div>
        </div>

        {/* PREVIEW */}
        <div className="hero-preview">
          <div className="preview-frame">
            <div className="preview-bar">
              <div className="preview-dot"></div>
              <div className="preview-dot"></div>
              <div className="preview-dot"></div>

              <div className="preview-url">
                app.peblo.workplace/dashboard
              </div>
            </div>

            <div className="preview-body">
              {/* SIDEBAR */}
              <div className="preview-sidebar">
                <div className="sidebar-label">Workspace</div>

                <div className="sidebar-item active">
                  All Notes
                </div>

                <div className="sidebar-item">Starred</div>

                <div className="sidebar-item">Archived</div>

                <div className="sidebar-label">Tags</div>

                <div className="sidebar-item"># work</div>

                <div className="sidebar-item"># ideas</div>

                <div className="sidebar-item"># meeting</div>
              </div>

              {/* MAIN */}
              <div className="preview-main">
                <div className="note-card-mock">
                  <div className="mock-title"></div>

                  <div
                    className="mock-line"
                    style={{ width: "80%" }}
                  ></div>

                  <div
                    className="mock-line"
                    style={{ width: "65%" }}
                  ></div>

                  <div
                    style={{
                      display: "flex",
                      gap: "0.5rem",
                      marginTop: "0.5rem",
                    }}
                  >
                    <div className="mock-tag"></div>

                    <div
                      className="mock-tag"
                      style={{ width: "40px" }}
                    ></div>
                  </div>

                  <div className="mock-ai-badge">
                    AI Summary Ready
                  </div>
                </div>

                <div className="note-card-mock">
                  <div
                    className="mock-title"
                    style={{ width: "45%" }}
                  ></div>

                  <div
                    className="mock-line"
                    style={{ width: "90%" }}
                  ></div>

                  <div
                    className="mock-line"
                    style={{ width: "55%" }}
                  ></div>
                </div>

                <div className="note-card-mock">
                  <div
                    className="mock-title"
                    style={{ width: "70%" }}
                  ></div>

                  <div
                    className="mock-line"
                    style={{ width: "85%" }}
                  ></div>

                  <div className="mock-ai-badge">
                    Action Items Generated
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features">
        <div className="section-inner">
          <span className="section-tag">
            ✦ Everything you need
          </span>

          <h2 className="section-title">
            Built for how you
            <br />
            <em>actually</em> think
          </h2>

          <p className="section-sub">
            Six tightly integrated capabilities that work
            together beautifully.
          </p>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🔐</div>

              <div className="feature-name">
                Secure Authentication
              </div>

              <p className="feature-desc">
                JWT login and protected routes to keep your
                workspace secure.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📝</div>

              <div className="feature-name">
                Smart Notes Workspace
              </div>

              <p className="feature-desc">
                Create, edit and organize notes with ease.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">✨</div>

              <div className="feature-name">
                AI Summaries
              </div>

              <p className="feature-desc">
                Instantly generate summaries and action items
                from notes.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🔍</div>

              <div className="feature-name">
                Search & Filtering
              </div>

              <p className="feature-desc">
                Quickly find notes using tags and filters.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🔗</div>

              <div className="feature-name">
                Public Sharing
              </div>

              <p className="feature-desc">
                Share notes with public links instantly.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📊</div>

              <div className="feature-name">
                Productivity Insights
              </div>

              <p className="feature-desc">
                Track your writing and AI usage statistics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about">
        <div className="section-inner">
          <div className="about-grid">
            <div className="about-text">
              <span className="section-tag">
                ✦ About Peblo
              </span>

              <h2 className="section-title">
                A workspace that
                <br />
                thinks with you
              </h2>

              <p>
                Peblo Workplace is a lightweight AI-powered
                notes app built for modern productivity.
              </p>

              <p>
                Capture ideas, summarize meetings, organize
                tasks, and build your second brain.
              </p>
            </div>

            <div className="about-visual">
              <div className="about-card">
                <div className="about-stat-row">
                  <div className="about-stat">
                    <span className="about-stat-num">
                      128
                    </span>

                    <div className="about-stat-label">
                      Notes
                    </div>
                  </div>

                  <div className="about-stat">
                    <span className="about-stat-num">
                      47
                    </span>

                    <div className="about-stat-label">
                      AI Summaries
                    </div>
                  </div>

                  <div className="about-stat">
                    <span className="about-stat-num">
                      12
                    </span>

                    <div className="about-stat-label">
                      Tags
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW */}
      <section id="how">
        <div className="section-inner">
          <span className="section-tag">
            ✦ How it works
          </span>

          <h2 className="section-title">
            From thought
            <br />
            to organized insight
          </h2>

          <div className="how-steps">
            <div className="step">
              <div className="step-num">1</div>

              <h3>Sign up</h3>

              <p>Create your account in seconds.</p>
            </div>

            <div className="step">
              <div className="step-num">2</div>

              <h3>Write notes</h3>

              <p>Capture ideas instantly.</p>
            </div>

            <div className="step">
              <div className="step-num">3</div>

              <h3>Generate AI summary</h3>

              <p>Let Gemini organize your notes.</p>
            </div>

            <div className="step">
              <div className="step-num">4</div>

              <h3>Share & grow</h3>

              <p>Collaborate and stay productive.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-box">
          <h2>
            Start thinking
            <br />
            smarter today
          </h2>

          <p>
            Join Peblo Workplace and build your second
            brain.
          </p>

          <div className="cta-input-row">
            <input
              type="email"
              className="cta-input"
              placeholder="your@email.com"
            />

            <Link to="/signup" className="btn-primary">
              Get started →
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-left">
          Peblo Workplace · Built in India
        </div>

        <div className="footer-right">
          © 2026 Peblo
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;

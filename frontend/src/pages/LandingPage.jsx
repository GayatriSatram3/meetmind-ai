import {
  ArrowRight,
  Sparkles,
  Mic,
  Brain,
  CheckCircle2,
  Upload,
  ListTodo,
  FileText,
  UserRound,
  Search,
  LayoutDashboard,
  CalendarDays,
  Users,
  Clock3,
  ArrowUpRight
} from "lucide-react";

import "../styles/LandingPage.css";
import { useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">

      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">
          <div className="logo-icon">
            <Brain size={22} />
          </div>

          <span>MeetMind</span>
          <span className="logo-ai">AI</span>
        </div>

        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How it works</a>
          <a href="#about">About</a>
        </div>

        <div className="nav-actions">
          <button onClick={() => navigate("/login")}>
              Log in
          </button>

          <button onClick={() => navigate("/register")}>
    Get started
</button>
        </div>
      </nav>


      {/* Hero Section */}
      <section className="hero">

        <div className="hero-badge">
          <Sparkles size={16} />
          <span>AI-Powered Meeting Intelligence</span>
        </div>

        <h1>
          Turn conversations
          <br />
          into <span>clear action.</span>
        </h1>

        <p className="hero-description">
          MeetMind listens, understands, and transforms your meetings
          into summaries, decisions, and actionable tasks.
        </p>

        <div className="hero-buttons">
          <button onClick={() => navigate("/register")}>
    Start for free
</button>

          <button onClick={() => navigate("/login")}>
    Explore MeetMind
</button>
        </div>


        {/* AI Meeting Visual */}
        <div className="meeting-preview">

          <div className="preview-header">
            <div className="live-indicator">
              <span></span>
              AI Analysis Complete
            </div>

            <div className="meeting-title">
              Product Strategy Meeting
            </div>
          </div>


          <div className="preview-content">

            <div className="transcript-card">
              <div className="card-label">
                <Mic size={16} />
                Meeting Conversation
              </div>

              <div className="transcript-line">
                <span className="avatar avatar-one"></span>
                <p>We should finalize the new dashboard this week.</p>
              </div>

              <div className="transcript-line">
                <span className="avatar avatar-two"></span>
                <p>I'll handle the frontend implementation.</p>
              </div>

              <div className="transcript-line">
                <span className="avatar avatar-three"></span>
                <p>Great, let's review everything on Friday.</p>
              </div>
            </div>


            <div className="ai-card">

              <div className="card-label">
                <Brain size={16} />
                MeetMind AI
              </div>

              <div className="ai-result">
                <CheckCircle2 size={18} />
                <div>
                  <strong>Action Item</strong>
                  <p>Complete dashboard frontend</p>
                </div>
              </div>

              <div className="ai-result">
                <Sparkles size={18} />
                <div>
                  <strong>Decision</strong>
                  <p>Dashboard launch this week</p>
                </div>
              </div>

            </div>

          </div>

        </div>

      </section>

      {/* How It Works Section */}

<section className="how-it-works" id="how-it-works">

  <div className="section-header">

    <div className="section-tag">
      How it works
    </div>

    <h2>
      From meeting chaos
      <br />
      to <span>clarity.</span>
    </h2>

    <p>
      MeetMind transforms your meetings into structured,
      actionable knowledge in just a few steps.
    </p>

  </div>


  <div className="steps-container">

    {/* Step 1 */}

    <div className="step-card">

      <div className="step-number">
        01
      </div>

      <div className="step-icon">
        <Upload size={24} />
      </div>

      <h3>Upload your meeting</h3>

      <p>
        Upload an audio recording or meeting transcript.
        MeetMind securely processes your conversation.
      </p>

    </div>


    {/* Step 2 */}

    <div className="step-card featured-step">

      <div className="step-number">
        02
      </div>

      <div className="step-icon">
        <Brain size={24} />
      </div>

      <h3>AI understands everything</h3>

      <p>
        Our AI identifies important discussions,
        decisions, tasks, owners, and deadlines.
      </p>

    </div>


    {/* Step 3 */}

    <div className="step-card">

      <div className="step-number">
        03
      </div>

      <div className="step-icon">
        <ListTodo size={24} />
      </div>

      <h3>Take action</h3>

      <p>
        Get clear summaries and actionable tasks
        that your entire team can follow.
      </p>

    </div>

  </div>

</section>

{/* Features Section */}

<section className="features" id="features">

  <div className="features-header">

    <div className="section-tag light-tag">
      MeetMind Intelligence
    </div>

    <h2>
      One meeting.
      <br />
      <span>Everything extracted.</span>
    </h2>

    <p>
      MeetMind doesn't just record meetings.
      It understands conversations and turns them
      into organized information your team can use.
    </p>

  </div>


  <div className="features-grid">

    {/* AI Summary */}

    <div className="feature-card summary-card">

      <div className="feature-icon">
        <FileText size={24} />
      </div>

      <div className="feature-content">

        <span className="feature-label">
          AI SUMMARY
        </span>

        <h3>
          Understand hours
          in seconds.
        </h3>

        <p>
          Get a clean and structured summary of
          everything important from your meeting.
        </p>

      </div>

      <div className="summary-preview">

        <div className="summary-line long"></div>
        <div className="summary-line medium"></div>
        <div className="summary-line short"></div>

        <div className="summary-highlight">
          Key discussion points extracted
        </div>

      </div>

    </div>


    {/* Action Items */}

    <div className="feature-card action-card">

      <div className="feature-icon">
        <ListTodo size={22} />
      </div>

      <span className="feature-label">
        ACTION ITEMS
      </span>

      <h3>
        Nothing gets forgotten.
      </h3>

      <div className="mini-task">

        <CheckCircle2 size={17} />

        <span>
          Finish dashboard UI
        </span>

      </div>

    </div>


    {/* Decisions */}

    <div className="feature-card decision-card">

      <div className="feature-icon">
        <Brain size={22} />
      </div>

      <span className="feature-label">
        DECISIONS
      </span>

      <h3>
        Capture what
        matters.
      </h3>

      <p>
        AI identifies important decisions
        from natural conversations.
      </p>

    </div>


    {/* Task Owners */}

    <div className="feature-card owner-card">

      <div className="feature-icon">
        <UserRound size={22} />
      </div>

      <span className="feature-label">
        TASK OWNERS
      </span>

      <h3>
        Everyone knows
        their responsibility.
      </h3>

      <div className="owner-preview">

        <div className="owner-avatar">
          G
        </div>

        <div>

          <strong>
            Gayatri
          </strong>

          <p>
            Dashboard frontend
          </p>

        </div>

      </div>

    </div>


    {/* Smart Search */}

    <div className="feature-card search-card">

      <div className="feature-icon">
        <Search size={22} />
      </div>

      <div>

        <span className="feature-label">
          SMART SEARCH
        </span>

        <h3>
          Ask your meetings anything.
        </h3>

        <p>
          Search conversations, decisions,
          action items, and deadlines instantly.
        </p>

      </div>

      <div className="search-preview">

        <Search size={17} />

        <span>
          What did we decide about launch?
        </span>

      </div>

    </div>

  </div>

</section>

{/* Dashboard Preview Section */}

<section
  className="dashboard-showcase"
  id="about"
>

  <div className="dashboard-showcase-header">

    <div className="section-tag">
      Inside MeetMind
    </div>

    <h2>
      Your meetings finally
      <br />
      <span>have a memory.</span>
    </h2>

    <p>
      One intelligent workspace where every conversation,
      decision, task, and deadline stays connected.
    </p>

  </div>


  {/* Dashboard Mockup */}

  <div className="dashboard-mockup">

    {/* Sidebar */}

    <div className="mock-sidebar">

      <div className="mock-logo">
        <Brain size={20} />
        <span>MeetMind</span>
      </div>

      <div className="mock-nav">

        <div className="mock-nav-item active">
          <LayoutDashboard size={18} />
          Overview
        </div>

        <div className="mock-nav-item">
          <Mic size={18} />
          Meetings
        </div>

        <div className="mock-nav-item">
          <Sparkles size={18} />
          AI Insights
        </div>

        <div className="mock-nav-item">
          <ListTodo size={18} />
          Tasks
        </div>

        <div className="mock-nav-item">
          <Users size={18} />
          Team
        </div>

      </div>

      <div className="mock-user">

        <div className="mock-user-avatar">
          G
        </div>

        <div>
          <strong>Gayatri</strong>
          <span>Workspace Owner</span>
        </div>

      </div>

    </div>


    {/* Main Dashboard */}

    <div className="mock-main">

      <div className="mock-topbar">

        <div>
          <p className="mock-greeting">
            Monday, September 14
          </p>

          <h3>
            Good afternoon, Gayatri 👋
          </h3>
        </div>

        <div className="mock-search">
          <Search size={17} />
          Search your meetings...
        </div>

      </div>


      {/* Stats */}

      <div className="mock-stats">

        <div className="mock-stat-card">

          <div className="stat-icon meetings">
            <Mic size={19} />
          </div>

          <div>
            <span>Total Meetings</span>
            <strong>12</strong>
          </div>

        </div>


        <div className="mock-stat-card">

          <div className="stat-icon tasks">
            <ListTodo size={19} />
          </div>

          <div>
            <span>Open Tasks</span>
            <strong>08</strong>
          </div>

        </div>


        <div className="mock-stat-card">

          <div className="stat-icon insights">
            <Sparkles size={19} />
          </div>

          <div>
            <span>AI Insights</span>
            <strong>24</strong>
          </div>

        </div>

      </div>


      {/* Dashboard Bottom */}

      <div className="mock-bottom">

        {/* Recent Meeting */}

        <div className="recent-meetings">

          <div className="panel-header">

            <div>
              <h4>Recent meetings</h4>
              <p>Your latest conversations</p>
            </div>

            <ArrowUpRight size={18} />

          </div>


          <div className="meeting-row">

            <div className="meeting-icon">
              <Mic size={17} />
            </div>

            <div className="meeting-info">
              <strong>Product Strategy</strong>
              <span>Today · 45 min</span>
            </div>

            <div className="meeting-status">
              <CheckCircle2 size={15} />
              Analyzed
            </div>

          </div>


          <div className="meeting-row">

            <div className="meeting-icon purple">
              <Users size={17} />
            </div>

            <div className="meeting-info">
              <strong>Weekly Team Sync</strong>
              <span>Yesterday · 30 min</span>
            </div>

            <div className="meeting-status">
              <CheckCircle2 size={15} />
              Analyzed
            </div>

          </div>

        </div>


        {/* AI Insight */}

        <div className="mock-ai-insight">

          <div className="ai-insight-header">
            <Sparkles size={18} />
            AI Insight
          </div>

          <h4>
            Your team has 3 upcoming deadlines.
          </h4>

          <p>
            Most tasks are related to the dashboard
            and frontend implementation.
          </p>

          <button onClick={() => navigate("/analytics")}>
  View insights
  <ArrowRight size={16} />
</button>

        </div>

      </div>

    </div>

  </div>

</section>

{/* Final CTA Section */}

<section className="final-cta">

  <div className="cta-glow glow-one"></div>
  <div className="cta-glow glow-two"></div>

  <div className="final-cta-content">

    <div className="section-tag cta-tag">
      Ready to get started?
    </div>

    <h2>
      Stop losing important
      <br />
      things in meetings.
    </h2>

    <p>
      Let MeetMind turn every conversation into
      summaries, decisions, action items, and
      knowledge your team can actually use.
    </p>

    <div className="cta-buttons">

  <button
    className="cta-primary"
    onClick={() => navigate("/register")}
  >
    Start for free
    <ArrowRight size={18} />
  </button>

  <button
    className="cta-secondary"
    onClick={() => navigate("/login")}
  >
    Explore MeetMind
  </button>

</div>

  </div>

</section>

{/* Footer */}

<footer className="footer">

  <div className="footer-top">

    {/* Brand */}

    <div className="footer-brand">

      <div className="footer-logo">

        <div className="footer-logo-icon">
          <Brain size={20} />
        </div>

        <span>MeetMindAI</span>

      </div>

      <p>
        AI-powered meeting intelligence
        for teams that want to move faster.
      </p>

    </div>


    {/* Product */}

    <div className="footer-column">

      <h4>Product</h4>

      <span>Meetings</span>
      <span>AI Insights</span>
      <span>Action Items</span>
      <span>Smart Search</span>

    </div>


    {/* Company */}

    <div className="footer-column">

      <h4>Company</h4>

      <span>About</span>
      <span>Contact</span>
      <span>Privacy</span>

    </div>


    {/* CTA */}

    <div className="footer-join">

      <h4>
        Make every meeting
        more valuable.
      </h4>

      <button onClick={() => navigate("/register")}>
  Get started
  <ArrowRight size={16} />
</button>
    </div>

  </div>


  <div className="footer-bottom">

    <span>
      © 2026 MeetMindAI. All rights reserved.
    </span>

    <span>
      Built with AI + ❤️
    </span>

  </div>

</footer>

    </div>
  );
}

export default LandingPage;
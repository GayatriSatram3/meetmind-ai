import "../styles/DashboardPage.css";
import {
  Video,
  CheckSquare,
  BarChart3,
  GitBranch,
  Clock,
  ArrowUpRight,
  Calendar,
  Sparkles,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";
const userName =
  localStorage.getItem("userName") || "User";


function DashboardPage() {
    const [tasks, setTasks] = useState([]);
    const [meetings, setMeetings] = useState([]);
    useEffect(() => {
      fetchDashboardTasks();
      fetchDashboardMeetings();
    }, []);
    
const fetchDashboardTasks = async () => {
  try {
    const workspaceId =
      localStorage.getItem("workspaceId");

    if (!workspaceId) {
      return;
    }

    const response = await api.get(
      `/tasks/${workspaceId}`
    );

    setTasks(response.data.tasks || []);

  } catch (error) {
    console.error(
      "Failed to fetch dashboard tasks:",
      error.response?.data || error
    );
  }
};

const fetchDashboardMeetings = async () => {
  try {
    const workspaceId =
      localStorage.getItem("workspaceId");

    if (!workspaceId) {
      return;
    }

    const response = await api.get(
      `/meetings/workspace/${workspaceId}`
    );

    console.log(
      "Dashboard meetings:",
      response.data
    );

    setMeetings(
      response.data.meetings || []
    );

  } catch (error) {
    console.error(
      "Failed to fetch dashboard meetings:",
      error.response?.data || error
    );
  }
};

const pendingTasks = tasks.filter(
  (task) => task.status === "PENDING"
).length;

const completedTasks = tasks.filter(
  (task) => task.status === "COMPLETED"
).length;

const totalTasks = tasks.length;
const totalMeetings = meetings.length;

const totalDecisions = meetings.reduce((total, meeting) => {
  if (Array.isArray(meeting.aiDecisions)) {
    return total + meeting.aiDecisions.length;
  }

  return total;
}, 0);

const totalMeetingMinutes = meetings.reduce(
  (total, meeting) => {
    return total + (meeting.duration || 0);
  },
  0
);



const totalMeetingHours = (
  totalMeetingMinutes / 60
).toFixed(1);


// AI Insight calculations

const totalActionItems = totalTasks;

const totalAssignedTasks = tasks.filter(
  (task) => task.owner
).length;

const assignedPercentage =
  totalActionItems > 0
    ? Math.round(
        (totalAssignedTasks / totalActionItems) * 100
      )
    : 0;

const insightTitle =
  totalMeetings === 0
    ? "Start your first meeting to unlock AI insights."
    : totalTasks === 0
    ? "Your meetings are ready for deeper action tracking."
    : assignedPercentage >= 80
    ? `${assignedPercentage}% of your action items have clear ownership.`
    : "Some action items still need clear ownership.";



const insightDescription =
  totalMeetings === 0
    ? "Once meetings are added, MeetMind will surface patterns and recommendations here."
    : totalTasks === 0
    ? "Add a transcript and MeetMind will automatically extract action items, decisions and responsibilities."
    : assignedPercentage >= 80
    ? "Most action items currently have an assigned owner."
    : "Some action items do not have an assigned owner yet.";

    

    const navigate = useNavigate();
    return (
    <div className="dashboard">

      {/* Sidebar */}
      <aside className="sidebar">

        <div className="sidebar-logo">
          <div className="logo-icon">✦</div>
          <span>MeetMindAI</span>
        </div>

        <div className="workspace-box">
          <div className="workspace-avatar">M</div>

          <div>
            <p>Workspace</p>
            <h4>MeetMind Team</h4>
          </div>

          <span className="workspace-arrow">⌄</span>
        </div>

        <nav className="sidebar-menu">

          <p className="menu-title">WORKSPACE</p>

          <div className="menu-item active">
            <span>▦</span>
            Dashboard
          </div>

          <div
            className="menu-item"
            onClick={() => navigate("/meetings")}
          >
            <span>◫</span>
            Meetings
          </div>

          <div
            className="menu-item"
            onClick={() => navigate("/action-items")}
          >
            <span>✓</span>
            Action Items
          </div>

          <div
            className="menu-item"
            onClick={() => navigate("/decisions")}
          >
            <span>◇</span>
            Decisions
          </div>

          <div
            className="menu-item"
            onClick={() => navigate("/smart-search")}
          >
            <span>⌕</span>
            Smart Search
          </div>

          <div
  className="menu-item"
  onClick={() => navigate("/analytics")}
>
  <BarChart3 size={17} />
  Analytics
</div>

<div
  className="menu-item"
  onClick={() => navigate("/ask-ai")}
>
  <Sparkles size={17} />
  Ask AI
</div>

        </nav>

        <nav className="sidebar-menu secondary-menu">

          <p className="menu-title">MANAGE</p>

          <div
            className="menu-item"
            onClick={() => navigate("/members")}
          >
            <span>♙</span>
            Members
          </div>

          <div className="menu-item">
            <span>⚙</span>
            Settings
          </div>

        </nav>

        <div className="sidebar-bottom">

          <div className="ai-status">
            <div className="status-dot"></div>

            <div>
              <strong>MeetMind AI</strong>
              <p>All systems operational</p>
            </div>
          </div>

          <div className="user-profile">

            <div className="user-avatar">
              {userName.charAt(0).toUpperCase()}
            </div>

            <div>
              <strong>{userName}</strong>
              <p>Workspace member</p>
            </div>

            <span>•••</span>

          </div>

        </div>

      </aside>


      {/* Main Content */}

      <main className="main-content">

        <header className="dashboard-header">

          <div>
            <p className="welcome-text">
  {new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  })}
</p>

            <h1>
              Good morning, {userName} 👋
            </h1>

            <p className="header-description">
              Here's what's happening across your meetings.
            </p>
          </div>

          <div className="header-actions">

            <button
              className="search-button"
              onClick={() => navigate("/smart-search")}
            >
              ⌕
              <span>Search anything...</span>
              <kbd>⌘ K</kbd>
            </button>

            <button className="notification-button">
              ♧
              <span className="notification-dot"></span>
            </button>

            <button
              className="new-meeting-button"
              onClick={() => navigate("/new-meeting")}
            >
              + New Meeting
            </button>

          </div>

        </header>


        {/* Dashboard Content */}

        <section className="dashboard-body">

  {/* Stats */}

  <div className="stats-grid">

    <div
  className="stat-card"
  onClick={() => navigate("/meetings")}
>

      <div className="stat-icon meetings-icon">
        <Video size={20} />
      </div>

      <div className="stat-content">

        <p>Total meetings</p>

        <h2>{totalMeetings}</h2>

        <span className="neutral">
          Across your workspace
        </span>

      </div>

      <ArrowUpRight size={18} />

    </div>


    <div
  className="stat-card"
  onClick={() => navigate("/action-items")}
>

      <div className="stat-icon actions-icon">
        <CheckSquare size={20} />
      </div>

      <div className="stat-content">

       <h2>{totalTasks}</h2>
       <p>Action items</p>

        <span className="warning">
          {pendingTasks} need attention
        </span>

      </div>

      <ArrowUpRight size={18} />

    </div>


    <div
  className="stat-card"
  onClick={() => navigate("/decisions")}
>

      <div className="stat-icon decisions-icon">
        <GitBranch size={20} />
      </div>

      <div className="stat-content">

        <p>Decisions made</p>

        <h2>{totalDecisions}</h2>

        <span className="positive">
      Decisions across meetings
    </span>

      </div>

      <ArrowUpRight size={18} />

    </div>


    <div
  className="stat-card"
  onClick={() => navigate("/analytics")}
>

      <div className="stat-icon time-icon">
        <Clock size={20} />
      </div>

      <div className="stat-content">

        <p>Meeting time</p>

        <h2>{totalMeetingHours}h</h2>

        <span className="neutral">
          Across your meetings
        </span>
      </div>

      <ArrowUpRight size={18} />

    </div>

  </div>


  {/* Dashboard Grid */}

  <div className="dashboard-grid">


    {/* Recent Meetings */}

    <div className="recent-meetings-card">

  <div className="card-header">

    <div>

      <p className="section-label">
        RECENT ACTIVITY
      </p>

      <h2>
        Recent meetings
      </h2>

    </div>

    <button
      onClick={() => navigate("/meetings")}
    >
      View all
      <ArrowRight size={16} />
    </button>

  </div>


  <div className="meeting-list">

    {meetings
  .slice()
  .sort(
    (a, b) =>
      new Date(b.createdAt) -
      new Date(a.createdAt)
  )
  .slice(0, 5)
  .map((meeting) => {

        const actionCount =
          Array.isArray(meeting.aiActionItems)
            ? meeting.aiActionItems.length
            : 0;

        const decisionCount =
          Array.isArray(meeting.aiDecisions)
            ? meeting.aiDecisions.length
            : 0;

        return (
          <div
            className="meeting-row"
            key={meeting.id}
            onClick={() =>
              navigate(`/meetings/${meeting.id}`)
            }
          >

            <div className="meeting-date">
              <Calendar size={17} />
            </div>

            <div className="meeting-info">

              <h3>
                {meeting.title}
              </h3>

              <p>
                {new Date(
                  meeting.createdAt
                ).toLocaleDateString()}{" "}
                · Meeting
              </p>

            </div>

            <div className="meeting-tags">

              {actionCount > 0 && (
                <span className="tag-purple">
                  {actionCount}{" "}
                  {actionCount === 1
                    ? "action"
                    : "actions"}
                </span>
              )}

              {decisionCount > 0 && (
                <span className="tag-green">
                  {decisionCount}{" "}
                  {decisionCount === 1
                    ? "decision"
                    : "decisions"}
                </span>
              )}

            </div>

            <ArrowRight
              size={18}
              className="row-arrow"
            />

          </div>
        );
      })}

  </div>

</div>


    {/* Meeting Pulse */}

    <div className="meeting-pulse-card">

  <div className="pulse-header">

    <div className="pulse-icon">
      <Sparkles size={18} />
    </div>

    <span>
      MEETING PULSE
    </span>

  </div>


  <h2>
    Meeting activity at a glance.
  </h2>

  <p>
    {totalMeetings} meetings have generated{" "}
    {totalTasks} action items and{" "}
    {totalDecisions} decisions.
  </p>


  <div className="pulse-metrics">

    <div>
      <span>Total meetings</span>
      <strong>{totalMeetings}</strong>
    </div>

    <div>
      <span>Action items</span>
      <strong>{totalTasks}</strong>
    </div>

    <div>
      <span>Decisions</span>
      <strong>{totalDecisions}</strong>
    </div>

  </div>


  <button
    className="pulse-button"
    onClick={() => navigate("/ask-ai")}
  >
    Ask MeetMind AI
    <ArrowRight size={16} />
  </button>

</div>

  

  {/* AI Insight */}

  <div className="ai-insight-banner">

  <div className="ai-insight-icon">
    <TrendingUp size={22} />
  </div>

  <div>

    <span>
      AI INSIGHT
    </span>

    <h3>
      {insightTitle}
    </h3>

    <p>
      {insightDescription}
    </p>

  </div>

  <button
  onClick={() => navigate("/action-items")}
>
  Explore
  <ArrowRight size={16} />
</button>

  </div>

  </div>

</section>

      </main>

    </div>
  );
}

export default DashboardPage;
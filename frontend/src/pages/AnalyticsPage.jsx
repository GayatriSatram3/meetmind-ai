import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  BarChart3,
  Clock3,
  CheckSquare,
  TrendingUp,
  CalendarDays,
  ArrowRight,
  Loader2,
  Sparkles,
} from "lucide-react";


import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

import api from "../api/axios";
import "../styles/AnalyticsPage.css";

function AnalyticsPage() {
  const navigate = useNavigate();

  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [aiSummary, setAiSummary] = useState("");
  const [aiSummaryLoading, setAiSummaryLoading] = useState(true);
  const [aiSummaryError, setAiSummaryError] = useState("");

// FETCH ANALYTICS DATA
useEffect(() => {
    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            setError("");

            const workspaceId = localStorage.getItem("workspaceId");

            if (!workspaceId) {
                throw new Error("No workspace found");
            }

            const response = await api.get(
                `/analytics/${workspaceId}`
            );

            console.log("Analytics response:", response.data);

            setAnalytics(response.data);

        } catch (error) {
            console.error(
                "Analytics error:",
                error.response?.data || error
            );

            setError(
                error.response?.data?.message ||
                error.message ||
                "Failed to load analytics"
            );

        } finally {
            setLoading(false);
        }
    };

    fetchAnalytics();
}, []);


// AI SUMMARY

useEffect(() => {
  const fetchAISummary = async () => {
    try {
      setAiSummaryLoading(true);

      const workspaceId =
        localStorage.getItem("workspaceId");

      if (!workspaceId) {
        return;
      }

      const response = await api.get(
        `/analytics/${workspaceId}/ai-summary`
      );

      setAiSummary(
        response.data.summary || ""
      );

    } catch (error) {
      console.error(
        "AI summary error:",
        error.response?.data || error
      );

      setAiSummary("");

    } finally {
      setAiSummaryLoading(false);
    }
  };

  fetchAISummary();
}, []);


if (loading) {
  return (
    <div className="analytics-loading">
      <Loader2 className="spin" size={28} />
      <p>Loading analytics...</p>
    </div>
  );
}

if (error) {
  return (
    <div className="analytics-error">
      <BarChart3 size={32} />

      <h2>Couldn't load analytics</h2>

      <p>{error}</p>

      <button
        onClick={() => window.location.reload()}
      >
        Try Again
      </button>
    </div>
  );
}

  const overview = analytics?.overview;

  if (!overview) {
  return (
    <div className="analytics-loading">
      <Loader2 className="spin" size={28} />
      <p>Preparing analytics...</p>
    </div>
  );
}

  const taskChartData = [
  {
    name: "Completed",
    value: overview.completedTasks,
  },
  {
    name: "In Progress",
    value: overview.inProgressTasks,
  },
  {
    name: "Pending",
    value: overview.pendingTasks,
  },
];


const meetingActivity = {};

analytics.meetings.forEach((meeting) => {
  const date = new Date(
    meeting.createdAt
  ).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  if (!meetingActivity[date]) {
    meetingActivity[date] = 0;
  }

  meetingActivity[date]++;
});

const meetingActivityData = Object.entries(
  meetingActivity
)
  .map(([date, count]) => ({
    date,
    meetings: count,
  }))
  .slice(-14);

const workspaceInsights = [
  {
    icon: CheckSquare,
    title: "Task Progress",
    text:
      overview.completionRate === 0
        ? "No action items have been completed yet."
        : `${overview.completionRate}% of action items have been completed. ${overview.pendingTasks} tasks are still pending.`,
  },

  {
    icon: CalendarDays,
    title: "Meeting Activity",
    text:
      overview.totalMeetings === 1
        ? "Your workspace has recorded 1 meeting."
        : `Your workspace has recorded ${overview.totalMeetings} meetings across the available meeting history.`,
  },

  {
    icon: TrendingUp,
    title: "Team Productivity",
    text:
      overview.completedTasks > 0
        ? `${overview.completedTasks} tasks have been completed and ${overview.inProgressTasks} are currently in progress.`
        : "No tasks have been completed yet. Consider reviewing the pending action items.",
  },
];




  return (
    <div className="analytics-page">

      {/* Header */}

      <div className="analytics-header">
        <div>
          <div className="analytics-eyebrow">
            <BarChart3 size={16} />
            WORKSPACE ANALYTICS
          </div>

          <h1>Meeting Intelligence</h1>

          <p>
            Understand your meetings, action items,
            and team productivity.
          </p>
        </div>
      </div>


      {/* Overview Cards */}

      <div className="analytics-grid">

        <div className="analytics-card">
          <div className="analytics-card-icon">
            <CalendarDays size={20} />
          </div>

          <div>
            <span>Total Meetings</span>
            <strong>
              {overview.totalMeetings}
            </strong>
          </div>
        </div>


        <div className="analytics-card">
          <div className="analytics-card-icon">
            <Clock3 size={20} />
          </div>

          <div>
            <span>Meeting Hours</span>
            <strong>
              {overview.totalMeetingHours}h
            </strong>
          </div>
        </div>


        <div className="analytics-card">
          <div className="analytics-card-icon">
            <CheckSquare size={20} />
          </div>

          <div>
            <span>Total Action Items</span>
            <strong>
              {overview.totalTasks}
            </strong>
          </div>
        </div>


        <div className="analytics-card">
          <div className="analytics-card-icon">
            <TrendingUp size={20} />
          </div>

          <div>
            <span>Completion Rate</span>
            <strong>
              {overview.completionRate}%
            </strong>
          </div>
        </div>

      </div>


      {/* Task Overview */}

      <div className="analytics-section">

  <div className="section-heading">
    <div>
      <h2>Action Item Progress</h2>
      <p>
        Current status of tasks generated
        from your meetings.
      </p>
    </div>

    <button
  type="button"
  onClick={() => navigate("/action-items")}
>
      View action items
      <ArrowRight size={16} />
    </button>
  </div>


  {/* Progress Card */}

  <div className="task-progress-card">

    <div className="progress-overview">

      <div
        className="progress-circle"
        style={{
          "--progress": overview.completionRate,
        }}
      >
        <span>
          {overview.completionRate}%
        </span>

        <small>completed</small>
      </div>


      <div className="progress-stats">

        <div>
          <span className="status-dot completed"></span>
          <p>Completed</p>
          <strong>
            {overview.completedTasks}
          </strong>
        </div>

        <div>
          <span className="status-dot progress"></span>
          <p>In Progress</p>
          <strong>
            {overview.inProgressTasks}
          </strong>
        </div>

        <div>
          <span className="status-dot pending"></span>
          <p>Pending</p>
          <strong>
            {overview.pendingTasks}
          </strong>
        </div>

      </div>

    </div>


    <div className="progress-bar-wrapper">

      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{
            width: `${overview.completionRate}%`,
          }}
        />
      </div>

      <span>
        {overview.completedTasks} of{" "}
        {overview.totalTasks} action items
        completed
      </span>

    </div>

  </div>


  {/* IMPORTANT:
      task-progress-card ends ABOVE this line
  */}


  {/* Distribution Chart */}

  <div className="analytics-chart-card">

    <div className="chart-header">
      <div>
        <h2>Action Item Distribution</h2>

        <p>
          Breakdown of tasks across their
          current status.
        </p>
      </div>
    </div>


    <div className="task-chart">

      <ResponsiveContainer
        width="100%"
        height={280}
      >

        <PieChart>

          <Pie
            data={taskChartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={95}
            innerRadius={55}
            paddingAngle={3}
          >

            {taskChartData.map(
              (entry, index) => (
                <Cell
                  key={`cell-${index}`}
                />
              )
            )}

          </Pie>

          <Tooltip />

        </PieChart>

      </ResponsiveContainer>


      <div className="chart-legend">

        {taskChartData.map(
          (item) => (
            <div
              className="legend-item"
              key={item.name}
            >

              <span className="legend-dot" />

              <span>
                {item.name}
              </span>

              <strong>
                {item.value}
              </strong>

            </div>
          )
        )}

      </div>

    </div>

  </div>

</div>

      {/* Meeting Activity */}

<div className="analytics-section">

  <div className="section-heading">
    <div>
      <h2>Meeting Activity</h2>

      <p>
        Number of meetings held across
        your workspace.
      </p>
    </div>
  </div>


  <div className="analytics-chart-card">

    <div className="activity-chart">

      <ResponsiveContainer
        width="100%"
        height={300}
      >

        <LineChart
          data={meetingActivityData}
          margin={{
            top: 10,
            right: 20,
            left: 0,
            bottom: 10,
          }}
        >

          <CartesianGrid
            strokeDasharray="3 3"
          />

          <XAxis
            dataKey="date"
          />

          <YAxis
            allowDecimals={false}
          />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="meetings"
            stroke="#111"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />

        </LineChart>

      </ResponsiveContainer>

    </div>

  </div>

</div>    


{/* Workspace Insights */}

<div className="analytics-section">

  <div className="section-heading">
    <div>
      <h2>Workspace Insights</h2>

      <p>
        Key observations from your meeting and task data.
      </p>
    </div>
  </div>


  <div className="insights-grid">

    {workspaceInsights.map(
      (insight, index) => {

        const Icon = insight.icon;

        return (
          <div
            className="insight-card"
            key={index}
          >

            <div className="insight-icon">
              <Icon size={19} />
            </div>


            <div className="insight-content">

              <h3>
                {insight.title}
              </h3>

              <p>
                {insight.text}
              </p>

            </div>

          </div>
        );
      }
    )}

  </div>

</div>


{/* AI Workspace Summary */}

<div className="analytics-section">

  <div className="section-heading">
    <div>
      <h2>AI Workspace Summary</h2>

      <p>
        MeetMind AI's analysis of your
        current workspace activity.
      </p>
    </div>
  </div>


  <div className="ai-summary-card">

    <div className="ai-summary-icon">
      <Sparkles size={20} />
    </div>


    <div className="ai-summary-content">

      <div className="ai-summary-label">
        MEETMIND AI
      </div>


      {aiSummaryLoading ? (

        <div className="ai-summary-loading">

          <Loader2
            size={18}
            className="spin"
          />

          <span>
            Analyzing workspace activity...
          </span>

        </div>

      ) : aiSummary ? (

        <p>
          {aiSummary}
        </p>

      ) : (

        <p className="ai-summary-empty">
          AI insights are temporarily
          unavailable. Your analytics data
          is still available above.
        </p>

      )}

    </div>

  </div>

</div>


{/* Recent Meetings */}

<div className="analytics-section">

        <div className="section-heading">
          <div>
            <h2>Recent Meetings</h2>
            <p>
              Your latest meetings and their
              duration.
            </p>
          </div>

          <button
  type="button"
  onClick={() => navigate("/meetings")}
>
            View all meetings
            <ArrowRight size={16} />
          </button>
        </div>


      <div className="recent-meetings">

  {analytics.meetings.length === 0 ? (

    <div className="analytics-empty">

      <CalendarDays size={28} />

      <h3>No meetings yet</h3>

      <p>
        Create your first meeting to start
        seeing workspace analytics.
      </p>

      <button
        type="button"
        onClick={() => navigate("/new-meeting")}
      >
        Create meeting
        <ArrowRight size={15} />
      </button>

    </div>

  ) : (

    analytics.meetings
      .slice(0, 6)
      .map((meeting) => (

        <div
          key={meeting.id}
          className="analytics-meeting"
          role="button"
          tabIndex={0}
          onClick={() =>
            navigate(`/meetings/${meeting.id}`)
          }
          onKeyDown={(e) => {
            if (
              e.key === "Enter" ||
              e.key === " "
            ) {
              e.preventDefault();

              navigate(
                `/meetings/${meeting.id}`
              );
            }
          }}
        >

          <div className="analytics-meeting-icon">
            <CalendarDays size={18} />
          </div>

          <div className="analytics-meeting-content">

            <h3>
              {meeting.title}
            </h3>

            <div className="analytics-meeting-meta">

              <span>
                {new Date(
                  meeting.createdAt
                ).toLocaleDateString()}
              </span>

              {meeting.duration !== null &&
                meeting.duration !== undefined && (
                  <span>
                    {meeting.duration} min
                  </span>
                )}

            </div>

          </div>

          <ArrowRight
            size={17}
            className="analytics-meeting-arrow"
          />

        </div>

      ))

  )}

</div>

      </div>

    </div>
  );
}

export default AnalyticsPage;
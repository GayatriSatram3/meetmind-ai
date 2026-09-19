import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  FileText,
  ListChecks,
  CheckCircle2,
  Users,
  Loader2,
  Sparkles,
} from "lucide-react";

import api from "../api/axios";
import "../styles/MeetingDetailsPage.css";


function MeetingDetailsPage() {

  const navigate = useNavigate();
  const { meetingId } = useParams();

  const [meeting, setMeeting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [taskUpdateError, setTaskUpdateError] = useState("");

  useEffect(() => {

    const fetchMeeting = async () => {
  try {
    setLoading(true);
    setError("");

    const response = await api.get(
      `/meetings/${meetingId}`
    );

    setMeeting(response.data.meeting);

  } catch (error) {
    console.error(
      "Meeting details error:",
      error.response?.data || error
    );

    setError(
      error.response?.data?.message ||
      "Failed to load meeting details."
    );
  } finally {
    setLoading(false);
  }
};


    if (meetingId) {
      fetchMeeting();
    }

  }, [meetingId]);


  const formatDate = (date) => {

    if (!date) return "Unknown date";

    return new Date(date).toLocaleDateString(
      "en-US",
      {
        month: "long",
        day: "numeric",
        year: "numeric",
      }
    );

  };


  const formatDuration = (duration) => {

    if (!duration) {
      return "Not specified";
    }

    if (duration < 60) {
      return `${duration} min`;
    }

    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;

    if (minutes === 0) {
      return `${hours} hr`;
    }

    return `${hours} hr ${minutes} min`;

  };

const handleTaskStatusChange = async (
  taskId,
  status
) => {
  try {
    setTaskUpdateError("");

    const workspaceId =
      localStorage.getItem("workspaceId");

    if (!workspaceId) {
      setTaskUpdateError("No workspace selected.");
      return;
    }

    await api.patch(
      `/tasks/${workspaceId}/status/${taskId}`,
      {
        status,
      }
    );

    setMeeting((prev) => ({
      ...prev,
      tasks: prev.tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status,
            }
          : task
      ),
    }));

  } catch (error) {
    console.error(
      "Task status update error:",
      error.response?.data || error
    );

    setTaskUpdateError(
      error.response?.data?.message ||
      "Failed to update task status."
    );
  }
};


  if (loading) {

    return (
      <div className="meeting-details-loading">

        <Loader2
          size={28}
          className="spin"
        />

        <p>
          Loading meeting...
        </p>

      </div>
    );

  }


  if (error || !meeting) {
  return (
    <div className="meeting-details-error">
      <h2>Something went wrong</h2>

      <p>
        {error || "Meeting not found."}
      </p>

      <div className="meeting-error-actions">
        <button
          type="button"
          onClick={fetchMeeting}
        >
          Try again
        </button>

        <button
          type="button"
          className="secondary-error-button"
          onClick={() => navigate("/meetings")}
        >
          Back to meetings
        </button>
      </div>
    </div>
  );
}


  const actionItems =
    Array.isArray(meeting.aiActionItems)
      ? meeting.aiActionItems
      : [];


      const tasks =
  Array.isArray(meeting.tasks)
    ? meeting.tasks
    : [];


  const decisions =
    Array.isArray(meeting.aiDecisions)
      ? meeting.aiDecisions
      : [];

  const responsibilities =
    Array.isArray(meeting.aiResponsibilities)
      ? meeting.aiResponsibilities
      : [];


  return (

    <div className="meeting-details-page">

      {/* Header */}

      <div className="meeting-details-header">

        <button
  type="button"
  className="meeting-back-button"
  onClick={() => navigate("/meetings")}
>
          <ArrowLeft size={16} />
          Back to meetings
        </button>


        <div className="meeting-header-content">

          <div>

            <div className="meeting-eyebrow">
              <FileText size={15} />
              MEETING DETAILS
            </div>

            <h1>
              {meeting.title}
            </h1>

            {meeting.description && (
              <p>
  AI-generated insights from this meeting.
</p>
            )}

          </div>

        </div>


        <div className="meeting-meta">

          <div className="meta-item">
            <CalendarDays size={16} />
            <span>
              {formatDate(meeting.createdAt)}
            </span>
          </div>

          <div className="meta-item">
            <Clock3 size={16} />
            <span>
              {formatDuration(meeting.duration)}
            </span>
          </div>

        </div>

      </div>


      {/* Main Content */}

      <div className="meeting-details-content">


        {/* AI Summary */}

        <section className="details-card summary-card">

          <div className="card-heading">

            <div className="card-icon ai-icon">
              <Sparkles size={18} />
            </div>

            <div>
              <h2>
                AI Summary
              </h2>

              <span>
                Generated from the meeting transcript
              </span>
            </div>

          </div>


          <div className="summary-content">

            {meeting.aiSummary ? (
              <p>
                {meeting.aiSummary}
              </p>
            ) : (
              <p className="empty-text">
                No AI summary is available for
                this meeting.
              </p>
            )}

          </div>

        </section>
{taskUpdateError && (
  <div
    className="task-update-error"
    role="alert"
  >
    {taskUpdateError}
  </div>
)}

        {/* Action Items */}

<section className="details-card">

  <div className="card-heading">

    <div className="card-icon">
      <ListChecks size={18} />
    </div>

    <div>
      <h2>
        Action Items
      </h2>

      <span>
        Tasks identified from the meeting
      </span>
    </div>

  </div>


  {tasks.length === 0 ? (

    <div className="empty-section">

      <ListChecks size={24} />

      <p>
        No action items were identified.
      </p>

    </div>

  ) : (

    <div className="action-items-list">

      {tasks.map((task) => (

        <div
          className="action-item"
          key={task.id}
        >

          <div className="action-check">

            {task.status === "COMPLETED" ? (
              <CheckCircle2 size={18} />
            ) : (
              <ListChecks size={18} />
            )}

          </div>


          <div className="action-item-content">

            <h3>
              {task.title}
            </h3>


            <div className="action-item-meta">

              {task.owner && (
                <span>
                  👤 {task.owner}
                </span>
              )}


              {task.deadline && (
                <span>
                  <CalendarDays size={13} />
                  {task.deadline}
                </span>
              )}

            </div>

          </div>


          <select
  className={`task-status-select ${task.status.toLowerCase()}`}
  value={task.status}
  onChange={(e) =>
    handleTaskStatusChange(
      task.id,
      e.target.value
    )
  }
>
  <option value="PENDING">
    PENDING
  </option>

  <option value="IN_PROGRESS">
    IN PROGRESS
  </option>

  <option value="COMPLETED">
    COMPLETED
  </option>
</select>

        </div>

      ))}

    </div>

  )}

</section>

        {/* Decisions */}

        <section className="details-card">

          <div className="card-heading">

            <div className="card-icon">
              <CheckCircle2 size={18} />
            </div>

            <div>
              <h2>
                Decisions
              </h2>

              <span>
                Decisions made during the meeting
              </span>
            </div>

          </div>


          {decisions.length === 0 ? (

            <div className="empty-section">
              <CheckCircle2 size={24} />

              <p>
                No decisions were identified.
              </p>
            </div>

          ) : (

            <div className="decisions-list">

              {decisions.map(
                (decision, index) => (

                  <div
                    className="decision-item"
                    key={index}
                  >

                    <span className="decision-number">
                      {index + 1}
                    </span>

                    <p>
                      {decision}
                    </p>

                  </div>

                )
              )}

            </div>

          )}

        </section>


        {/* Responsibilities */}

        <section className="details-card">

          <div className="card-heading">

            <div className="card-icon">
              <Users size={18} />
            </div>

            <div>
              <h2>
                Responsibilities
              </h2>

              <span>
                Responsibilities identified by AI
              </span>
            </div>

          </div>


          {responsibilities.length === 0 ? (

            <div className="empty-section">
              <Users size={24} />

              <p>
                No specific responsibilities
                were identified.
              </p>
            </div>

          ) : (

            <div className="responsibilities-list">

              {responsibilities.map(
                (item, index) => (

                  <div
                    className="responsibility-item"
                    key={index}
                  >

                    <div className="responsibility-person">

                      <div className="person-avatar">
                        {item.person
                          ?.charAt(0)
                          ?.toUpperCase()}
                      </div>

                      <strong>
                        {item.person}
                      </strong>

                    </div>

                    <ul>

                      {item.responsibilities?.map(
                        (responsibility, i) => (
                          <li key={i}>
                            {responsibility}
                          </li>
                        )
                      )}

                    </ul>

                  </div>

                )
              )}

            </div>

          )}

        </section>


        {/* Transcript */}

        <section className="details-card">

          <div className="card-heading">

            <div className="card-icon">
              <FileText size={18} />
            </div>

            <div>
              <h2>
                Transcript
              </h2>

              <span>
                Original meeting transcript
              </span>
            </div>

          </div>


          <div className="transcript">

            {meeting.description ? (
              meeting.description
                .split("\n")
                .map((line, index) => (
                  <p key={index}>
                    {line}
                  </p>
                ))
            ) : (
              <p className="empty-text">
                No transcript available.
              </p>
            )}

          </div>

        </section>


      </div>

    </div>

  );

}


export default MeetingDetailsPage;
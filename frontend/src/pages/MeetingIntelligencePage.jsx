import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";

import {
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  Users,
  CalendarDays,
  FileText,
} from "lucide-react";

import "../styles/MeetingIntelligencePage.css";

function MeetingIntelligencePage() {
  const navigate = useNavigate();
  const { meetingId } = useParams();

  const [meeting, setMeeting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
  const fetchMeeting = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        `/meetings/${meetingId}`
      );

      console.log("Meeting:", response.data);

      setMeeting(response.data.meeting);
    } catch (error) {
      console.error(
        "Failed to fetch meeting:",
        error.response?.data || error
      );

      setError(
        error.response?.data?.message ||
        "Failed to load meeting intelligence."
      );
    } finally {
      setLoading(false);
    }
  };

  fetchMeeting();
}, [meetingId]);



  if (loading) {
    return (
      <div className="intelligence-loading">
        <Sparkles size={28} />
        <p>Loading meeting intelligence...</p>
      </div>
    );
  }

  if (error) {
  return (
    <div className="intelligence-loading intelligence-error">
      <Sparkles size={30} />

      <h2>Unable to load meeting</h2>

      <p>{error}</p>

      <div className="intelligence-error-actions">
        <button
          type="button"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>

        <button
          type="button"
          className="secondary-button"
          onClick={() => navigate("/dashboard")}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

if (!meeting) {
  return (
    <div className="intelligence-loading intelligence-error">
      <FileText size={30} />

      <h2>Meeting not found</h2>

      <p>
        The meeting you're looking for could not be found.
      </p>

      <button
        type="button"
        onClick={() => navigate("/dashboard")}
      >
        Back to Dashboard
      </button>
    </div>
  );
}

  return (
    <div className="intelligence-page">

      {/* ================= HEADER ================= */}

      <header className="intelligence-header">

        <button
          className="intelligence-back"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft size={18} />
          Dashboard
        </button>

        <div className="intelligence-title">

          <div>

            <div className="intelligence-badge">
              <Sparkles size={14} />
              MEETING INTELLIGENCE
            </div>

            <h1>
              {meeting.title}
            </h1>

          </div>

          <div className="intelligence-meta">

            <span>
              <CalendarDays size={15} />

              {new Date(
                meeting.createdAt
              ).toLocaleDateString()}
            </span>

            <span>
              <FileText size={15} />
              Transcript
            </span>

          </div>

        </div>

      </header>


      {/* ================= MAIN CONTENT ================= */}

      <main className="intelligence-content">

        {/* ================= LEFT COLUMN ================= */}

        <div>

          {/* AI SUMMARY */}

          <section className="intelligence-card summary-card">

            <div className="section-label">
              <Sparkles size={15} />
              AI SUMMARY
            </div>

            <h2>
              Meeting overview
            </h2>

            <p className="summary-text">
              {meeting.aiSummary ||
                "No AI summary is available for this meeting."}
            </p>

          </section>


          {/* ACTION ITEMS */}

          <section className="intelligence-card">

            <div className="section-label">
              <CheckCircle2 size={15} />
              ACTION ITEMS
            </div>

            <h2>
              What needs to happen?
            </h2>

            <div className="action-items-list">

              {meeting.aiActionItems &&
              meeting.aiActionItems.length > 0 ? (

                meeting.aiActionItems.map(
                  (item, index) => (

                    <div
                      className="action-item"
                      key={index}
                    >

                      <div className="action-item-check">
                        <CheckCircle2 size={18} />
                      </div>

                      <div className="action-item-content">

                        <h3>
                          {item.task}
                        </h3>

                        <div className="action-item-meta">

                          <span>
                            👤{" "}
                            {item.owner ||
                              "Owner not specified"}
                          </span>

                          <span>
                            📅{" "}
                            {item.deadline ||
                              "No deadline"}
                          </span>

                        </div>

                      </div>

                    </div>

                  )

                )

              ) : (

                <p>
                  No action items were identified.
                </p>

              )}

            </div>

          </section>


          {/* DECISIONS */}

          <section className="intelligence-card">

            <div className="section-label">
              <Sparkles size={15} />
              DECISIONS
            </div>

            <h2>
              What was decided?
            </h2>

            <div className="decisions-list">

              {meeting.aiDecisions &&
              meeting.aiDecisions.length > 0 ? (

                meeting.aiDecisions.map(
                  (decision, index) => (

                    <div
                      className="decision-item"
                      key={index}
                    >

                      <div className="decision-number">
                        {String(index + 1).padStart(
                          2,
                          "0"
                        )}
                      </div>

                      <p>
                        {decision}
                      </p>

                    </div>

                  )
                )

              ) : (

                <p>
                  No important decisions were identified.
                </p>

              )}

            </div>

          </section>

        </div>


        {/* ================= RIGHT COLUMN ================= */}

        <div>

          {/* RESPONSIBILITIES */}

          <section className="intelligence-card">

            <div className="section-label">
              <Users size={15} />
              RESPONSIBILITIES
            </div>

            <h2>
              Who owns what?
            </h2>

            <div className="responsibilities-list">

              {meeting.aiResponsibilities &&
              meeting.aiResponsibilities.length > 0 ? (

                meeting.aiResponsibilities.map(
                  (item, index) => (

                    <div
                      className="responsibility-item"
                      key={index}
                    >

                      <div className="responsibility-avatar">

                        {item.person
                          ?.charAt(0)
                          .toUpperCase()}

                      </div>

                      <div className="responsibility-content">

                        <h3>
                          {item.person}
                        </h3>

                        <p>
                          {item.responsibility}
                        </p>

                        {item.deadline && (
                          <span>
                            📅 {item.deadline}
                          </span>
                        )}

                      </div>

                    </div>

                  )
                )

              ) : (

                <p>
                  No responsibilities were identified.
                </p>

              )}

            </div>

          </section>


          {/* QUICK INSIGHT */}

          <section className="intelligence-card insight-card">

            <div className="section-label">
              <Sparkles size={15} />
              MEETMIND INSIGHT
            </div>

            <h2>
              AI detected{" "}
              {meeting.aiActionItems?.length || 0}{" "}
              action items
            </h2>

            <p>
              Your meeting contains{" "}
              {meeting.aiDecisions?.length || 0}{" "}
              important decision
              {meeting.aiDecisions?.length === 1
                ? ""
                : "s"}
              and{" "}
              {meeting.aiResponsibilities?.length || 0} assigned{" "}
              {meeting.aiResponsibilities?.length === 1
                ? "responsibility"
                : "responsibilities"}.
            </p>

          </section>

        </div>


        {/* ================= TRANSCRIPT ================= */}

        <section className="intelligence-card transcript-card">

          <div className="section-label">
            <FileText size={15} />
            ORIGINAL TRANSCRIPT
          </div>

          <h2>
            Meeting conversation
          </h2>

          <div className="transcript-text">
            {meeting.description}
          </div>

        </section>

      </main>

    </div>
  );
}

export default MeetingIntelligencePage;
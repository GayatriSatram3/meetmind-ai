import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

import {
  ArrowLeft,
  Sparkles,
  Users,
  Lightbulb,
  CheckSquare,
  GitBranch,
  ArrowRight,
  CalendarDays,
  Clock3,
} from "lucide-react";

import "../styles/NotesMeetingPage.css";

function NotesMeetingPage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [duration, setDuration] = useState("");
  const [attendees, setAttendees] = useState("");
  const [discussion, setDiscussion] = useState("");
  const [actions, setActions] = useState("");
  const [decisions, setDecisions] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
  setError("");

  if (!title.trim()) {
    setError("Please enter a meeting title.");
    return;
  }

  if (
    !discussion.trim() &&
    !actions.trim() &&
    !decisions.trim()
  ) {
    setError("Please add some meeting information.");
    return;
  }

  try {
    setLoading(true);

    const workspaceId =
      localStorage.getItem("workspaceId");

    if (!workspaceId) {
      setError("No workspace selected.");
      return;
    }

    // keep the rest of your existing code...
      /*
        Combine the structured notes into one description.

        The existing backend expects the meeting content
        in the description field, so we preserve that API.
      */

      const structuredNotes = `
Meeting Date: ${date}

Attendees:
${attendees.trim() || "Not specified"}

Key Discussion:
${discussion.trim() || "Not specified"}

Action Items:
${actions.trim() || "Not specified"}

Decisions:
${decisions.trim() || "Not specified"}
      `.trim();

      const response = await api.post(
        `/meetings/${workspaceId}`,
        {
          title: title.trim(),
          description: structuredNotes,
          duration: duration
            ? Number(duration)
            : null,
        }
      );

      console.log(
        "Quick notes meeting created:",
        response.data
      );

      navigate(
        `/meetings/${response.data.meeting.id}`
      );

    } catch (error) {
      console.error(
        "Create quick notes meeting error:",
        error.response?.data || error
      );

     setError(
  error.response?.data?.message ||
  "Failed to create meeting. Please try again."
);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="notes-meeting-page">

      {/* HEADER */}

      <header className="notes-header">

        <button
  type="button"
  className="notes-back-button"
          onClick={() => navigate("/new-meeting")}
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <div className="notes-brand">
          <div className="notes-brand-icon">
            <Sparkles size={16} />
          </div>

          MeetMindAI
        </div>

      </header>


      {/* MAIN */}

      <main className="notes-content">

        {/* PAGE INTRO */}

        <div className="notes-heading">

          <div className="notes-badge">
            QUICK NOTES
          </div>

          <h1>
            Capture the
            <span> important parts.</span>
          </h1>

          <p>
            Quickly organize the key points from your
            meeting. MeetMind will turn your notes into
            structured meeting intelligence.
          </p>

        </div>


        {/* BASIC INFORMATION */}

        <section className="notes-section">

          <div className="section-title">
            <span>01</span>
            Meeting details
          </div>

          <div className="notes-title-field">

            <label>
              Meeting title
            </label>

            <input
              type="text"
              placeholder="e.g. Product Strategy Discussion"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
            />

          </div>


          <div className="details-grid">

            <div className="notes-field">

              <label>
                <CalendarDays size={15} />
                Meeting date
              </label>

              <input
                type="date"
                value={date}
                onChange={(e) =>
                  setDate(e.target.value)
                }
              />

            </div>


            <div className="notes-field">

              <label>
                <Clock3 size={15} />
                Duration
              </label>

              <select
                value={duration}
                onChange={(e) =>
                  setDuration(e.target.value)
                }
              >

                <option value="">
                  Select duration
                </option>

                <option value="15">
                  15 minutes
                </option>

                <option value="30">
                  30 minutes
                </option>

                <option value="45">
                  45 minutes
                </option>

                <option value="60">
                  1 hour
                </option>

                <option value="90">
                  1.5 hours
                </option>

                <option value="120">
                  2 hours
                </option>

                <option value="180">
                  3 hours
                </option>

              </select>

            </div>

          </div>

        </section>


        {/* PEOPLE */}

        <section className="notes-section">

          <div className="section-title">
            <span>02</span>
            People
          </div>

          <div className="notes-card people-card">

            <div className="notes-card-icon">
              <Users size={20} />
            </div>

            <div className="notes-card-content">

              <label>
                Who was in the meeting?
              </label>

              <input
                type="text"
                placeholder="e.g. Gayatri, Rahul, Priya"
                value={attendees}
                onChange={(e) =>
                  setAttendees(e.target.value)
                }
              />

              <p>
                Separate names with commas.
              </p>

            </div>

          </div>

        </section>


        {/* DISCUSSION */}

        <section className="notes-section">

          <div className="section-title">
            <span>03</span>
            What happened?
          </div>

          <div className="notes-card discussion-card">

            <div className="notes-card-icon">
              <Lightbulb size={20} />
            </div>

            <div className="notes-card-content">

              <label>
                Key discussion
              </label>

              <p className="field-hint">
                Capture the important points,
                ideas or problems discussed.
              </p>

              <textarea
                placeholder="Example: The team discussed the new dashboard design and reviewed the current progress..."
                value={discussion}
                onChange={(e) =>
                  setDiscussion(e.target.value)
                }
              />

            </div>

          </div>

        </section>


        {/* ACTIONS */}

        <section className="notes-section">

          <div className="section-title">
            <span>04</span>
            What needs to happen?
          </div>

          <div className="notes-card action-notes-card">

            <div className="notes-card-icon">
              <CheckSquare size={20} />
            </div>

            <div className="notes-card-content">

              <label>
                Action items
              </label>

              <p className="field-hint">
                Write down things that need to be
                completed after the meeting.
              </p>

              <textarea
                placeholder={`Example:

Finish dashboard frontend by Friday.
Complete backend API by Wednesday.
Review the application on Thursday.`}
                value={actions}
                onChange={(e) =>
                  setActions(e.target.value)
                }
              />

            </div>

          </div>

        </section>


        {/* DECISIONS */}

        <section className="notes-section">

          <div className="section-title">
            <span>05</span>
            What was decided?
          </div>

          <div className="notes-card decision-notes-card">

            <div className="notes-card-icon">
              <GitBranch size={20} />
            </div>

            <div className="notes-card-content">

              <label>
                Decisions
              </label>

              <p className="field-hint">
                Record important decisions or agreements.
              </p>

              <textarea
                placeholder="Example: The team decided to launch the first version next week."
                value={decisions}
                onChange={(e) =>
                  setDecisions(e.target.value)
                }
              />

            </div>

          </div>

        </section>


        {/* AI PREVIEW */}
        {error && (
  <div className="notes-error" role="alert">
    {error}
  </div>
)}

        <div className="notes-ai-preview">

          <div className="notes-ai-icon">
            <Sparkles size={19} />
          </div>

          <div>

            <strong>
              MeetMind AI will organize this for you
            </strong>

            <p>
              Your notes will be analyzed to identify
              summaries, action items, decisions,
              responsibilities and deadlines.
            </p>

          </div>

        </div>


        {/* ACTION */}

        <div className="notes-submit-area">

          <button
  type="button"
  className="notes-cancel-button"
            onClick={() => navigate("/new-meeting")}
          >
            Cancel
          </button>

          <button
  type="button"
  className="notes-submit-button"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading
              ? "Analyzing..."
              : "Save & Analyze"}

            {!loading && (
              <ArrowRight size={18} />
            )}
          </button>

        </div>


        <p className="notes-footer">
          You can edit the generated meeting information later.
        </p>

      </main>

    </div>
  );
}

export default NotesMeetingPage;
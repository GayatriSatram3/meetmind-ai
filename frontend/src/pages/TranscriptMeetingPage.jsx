import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import {
  ArrowLeft,
  FileText,
  Sparkles,
  ArrowRight,
} from "lucide-react";

import "../styles/TranscriptMeetingPage.css";


function TranscriptMeetingPage() {

  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [transcript, setTranscript] = useState("");
  const [duration, setDuration] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
  setError("");

  if (!title.trim()) {
    setError("Please enter a meeting title.");
    return;
  }

  if (!duration) {
    setError("Please select the meeting duration.");
    return;
  }

  if (!transcript.trim()) {
    setError("Please enter the meeting transcript.");
    return;
  }

  try {
    const workspaceId = localStorage.getItem("workspaceId");

    if (!workspaceId) {
      setError("No workspace selected.");
      return;
    }

    const response = await api.post(
      `/meetings/${workspaceId}`,
      {
        title: title.trim(),
        description: transcript.trim(),
        duration: Number(duration),
      }
    );

    navigate(`/meetings/${response.data.meeting.id}`);

  } catch (error) {
    console.error(
      "Create meeting error:",
      error.response?.data || error
    );

    setError(
      error.response?.data?.message ||
      "Failed to create meeting. Please try again."
    );
  }
};

  return (

    <div className="transcript-page">


      {/* HEADER */}

      <header className="transcript-header">

        <button
          className="back-button"
          onClick={() => navigate("/new-meeting")}
        >

          <ArrowLeft size={18} />

          Back

        </button>


        <div className="header-brand">

          <div className="mini-logo">
            <Sparkles size={16} />
          </div>

          MeetMindAI

        </div>

      </header>


      {/* CONTENT */}

      <main className="transcript-content">


        <div className="transcript-heading">

          <div className="transcript-badge">

            <FileText size={15} />

            TRANSCRIPT ANALYSIS

          </div>


          <h1>
            Let AI understand your
            <span> meeting.</span>
          </h1>


          <p>
            Paste your meeting transcript below.
            MeetMind will identify summaries, decisions,
            action items and responsibilities.
          </p>

        </div>



        {/* FORM */}

        <div className="transcript-form">


          {/* TITLE */}

          <div className="form-group">

            <label>
              Meeting title
            </label>

            <input
              type="text"
              placeholder="e.g. Product Strategy Meeting"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
            />

          </div>


          {/* DURATION */}

<div className="form-group">

  <label>
    Meeting duration
  </label>

  <select
    value={duration}
    onChange={(e) => setDuration(e.target.value)}
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


          {/* TRANSCRIPT */}

          <div className="form-group">

            <div className="textarea-label">

              <label>
                Meeting transcript
              </label>

              <span>
                {transcript.length} characters
              </span>

            </div>


            <textarea
              placeholder="Paste your meeting conversation here...

Example:

Gayatri: We should finish the dashboard by Friday.

Teammate: I'll handle the backend API.

Gayatri: Great. Let's review the progress on Thursday."
              value={transcript}
              onChange={(e) =>
                setTranscript(e.target.value)
              }
            />

          </div>


          {error && (
  <div className="transcript-error" role="alert">
    {error}
  </div>
)}


          {/* AI INFO */}

          <div className="ai-info">

            <div className="ai-info-icon">
              <Sparkles size={18} />
            </div>

            <div>

              <h4>
                MeetMind AI will analyze your meeting
              </h4>

              <p>
                You'll get a summary, action items,
                decisions, owners and deadlines.
              </p>

            </div>

          </div>



          {/* BUTTON */}

          <button
  type="button"
  className="analyze-button"
  onClick={handleSubmit}
  disabled={loading}
>
  {loading ? "Analyzing meeting..." : "Analyze with AI"}

  {!loading && <ArrowRight size={18} />}
</button>


        </div>


      </main>

    </div>

  );

}


export default TranscriptMeetingPage;
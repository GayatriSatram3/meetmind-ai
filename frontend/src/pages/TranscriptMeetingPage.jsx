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


  const handleSubmit = async () => {

  if (!title || !transcript || !duration) {
  alert("Please enter meeting title, transcript and duration");
  return;
}

  try {

    const workspaceId = localStorage.getItem("workspaceId");

    if (!workspaceId) {
      alert("No workspace selected");
      return;
    }

    const response = await api.post(
  `/meetings/${workspaceId}`,
  {
    title: title,
    description: transcript,
    duration: Number(duration),
  }
);

    console.log("Meeting created:", response.data);


    navigate(
      `/meetings/${response.data.meeting.id}`
    );

  } catch (error) {

    console.error(
      "Create meeting error:",
      error.response?.data || error
    );

    alert(
      error.response?.data?.message ||
      "Failed to create meeting"
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
            className="analyze-button"
            onClick={handleSubmit}
          >

            Analyze with AI

            <ArrowRight size={18} />

          </button>


        </div>


      </main>

    </div>

  );

}


export default TranscriptMeetingPage;
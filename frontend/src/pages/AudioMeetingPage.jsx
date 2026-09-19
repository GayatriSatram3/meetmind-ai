import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Upload,
  Mic,
  Sparkles,
  FileAudio,
  Clock3,
} from "lucide-react";

import api from "../api/axios";
import "../styles/AudioMeetingPage.css";

function AudioMeetingPage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState("");
  const [audioFile, setAudioFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");

  const handleFile = (file) => {
  if (!file) return;

  setError("");

  const allowedTypes = [
    "audio/mpeg",
    "audio/wav",
    "audio/x-wav",
    "audio/mp4",
    "audio/x-m4a",
    "audio/webm",
    "audio/ogg",
  ];

  if (!allowedTypes.includes(file.type)) {
    setError("Please upload a supported audio file.");
    return;
  }

  if (file.size > 50 * 1024 * 1024) {
    setError("Audio file must be smaller than 50 MB.");
    return;
  }

  setAudioFile(file);
};

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);

    const file = event.dataTransfer.files[0];
    handleFile(file);
  };

  
const handleSubmit = async () => {
  setError("");

  if (!title.trim()) {
    setError("Please enter a meeting title.");
    return;
  }

  if (!audioFile) {
    setError("Please upload an audio file.");
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

    const formData = new FormData();

    formData.append("audio", audioFile);
    formData.append("title", title.trim());

    if (duration) {
      formData.append("duration", duration);
    }

    const response = await api.post(
      `/audio/${workspaceId}`,
      formData
    );

    navigate(`/meetings/${response.data.meeting.id}`);

  } catch (error) {
    console.error("Audio upload error:", error);

    setError(
      error.response?.data?.message ||
      "Failed to process audio. Please try again."
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="audio-page">

      <div className="audio-header">
        <button
  type="button"
  className="audio-analyze-button"
          onClick={() => navigate("/new-meeting")}
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <div>
          <h1>Upload Meeting Audio</h1>
          <p>
            Upload your meeting recording and let
            AI turn it into structured intelligence.
          </p>
        </div>
      </div>

      <div className="audio-content">

        <div className="audio-main-card">

          <div className="audio-section-title">
            <Mic size={20} />
            <div>
              <h2>Meeting details</h2>
              <p>
                Tell us a little about this meeting.
              </p>
            </div>
          </div>

          <div className="audio-form">

            <div className="audio-field">
              <label>Meeting title</label>

              <input
                type="text"
                placeholder="e.g. Product Launch Planning"
                value={title}
                onChange={(event) =>
                  setTitle(event.target.value)
                }
              />
            </div>

            <div className="audio-field">
              <label>Duration</label>

              <div className="audio-duration-input">
                <Clock3 size={18} />

                <select
                  value={duration}
                  onChange={(event) =>
                    setDuration(event.target.value)
                  }
                >
                  <option value="">
                    Select duration
                  </option>
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="90">1.5 hours</option>
                  <option value="120">2 hours</option>
                </select>
              </div>
            </div>

          </div>

          <div className="audio-section-title upload-title">
            <FileAudio size={20} />
            <div>
              <h2>Meeting recording</h2>
              <p>
                Supported formats: MP3, WAV, M4A,
                WEBM and OGG. Maximum 50 MB.
              </p>
            </div>
          </div>

          <div
            className={`audio-drop-zone ${
              dragging ? "dragging" : ""
            }`}
            onDragOver={(event) => {
              event.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() =>
              setDragging(false)
            }
            onDrop={handleDrop}
          >

            <input
  id="audio-upload"
  type="file"
  accept="audio/*"
  aria-label="Upload meeting audio"
  hidden
  onChange={(event) =>
    handleFile(event.target.files[0])
  }
/>

            {!audioFile ? (
              <>
                <div className="audio-upload-icon">
                  <Upload size={28} />
                </div>

                <h3>
                  Drop your meeting recording here
                </h3>

                <p>or</p>

                <label
                  htmlFor="audio-upload"
                  className="audio-browse-button"
                >
                  Browse files
                </label>

                <span>
                  Maximum file size: 50 MB
                </span>
              </>
            ) : (
              <>
                <div className="audio-upload-icon">
                  <FileAudio size={28} />
                </div>

                <h3>{audioFile.name}</h3>

                <p>
                  {(
                    audioFile.size /
                    (1024 * 1024)
                  ).toFixed(2)}{" "}
                  MB
                </p>

                <button
  type="button"
  className="audio-change-button"
  onClick={() =>
    document
      .getElementById("audio-upload")
      .click()
  }
>
  Change audio
</button>
              </>
            )}

          </div>

          <div className="audio-ai-info">

            <div className="audio-ai-icon">
              <Sparkles size={20} />
            </div>

            <div>
              <h3>
                What happens after upload?
              </h3>

              <p>
                MeetMind AI will transcribe the
                recording, generate a summary, extract
                action items and decisions, and create
                searchable meeting intelligence.
              </p>
            </div>

          </div>

          {error && (
  <div className="audio-error" role="alert">
    {error}
  </div>
)}

          <button
            className="audio-analyze-button"
            onClick={handleSubmit}
            disabled={loading}
          >
            <Sparkles size={18} />

            {loading
              ? "Processing meeting..."
              : "Upload & Analyze"}
          </button>

        </div>

      </div>

    </div>
  );
}

export default AudioMeetingPage;
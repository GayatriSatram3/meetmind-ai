import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  GitBranch,
  Calendar,
  ArrowRight,
  Search,
  Plus,
} from "lucide-react";

import api from "../api/axios";
import "../styles/DecisionsPage.css";


function DecisionsPage() {

  const navigate = useNavigate();

  const [meetings, setMeetings] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMeetings();
  }, []);


  const fetchMeetings = async () => {
  setLoading(true);
  setError("");

  try {
    const workspaceId = localStorage.getItem("workspaceId");

    if (!workspaceId) {
      setError("No workspace selected.");
      return;
    }

    const response = await api.get(
      `/meetings/workspace/${workspaceId}`
    );

    setMeetings(response.data.meetings || []);

  } catch (error) {
    console.error(
      "Failed to fetch decisions:",
      error.response?.data || error
    );

    setError(
      error.response?.data?.message ||
      "Failed to load decisions. Please try again."
    );

  } finally {
    setLoading(false);
  }
};


  const decisions = meetings.flatMap(
    (meeting) => {

      if (
        !Array.isArray(meeting.aiDecisions)
      ) {
        return [];
      }

      return meeting.aiDecisions.map(
        (decision, index) => ({
          id: `${meeting.id}-${index}`,
          meetingId: meeting.id,
          meetingTitle: meeting.title,
          createdAt: meeting.createdAt,
          decision:
            typeof decision === "string"
              ? decision
              : decision.decision ||
                decision.text ||
                decision.description ||
                "Decision recorded",
        })
      );

    }
  );


  const filteredDecisions =
    decisions.filter((item) =>
      item.decision
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      item.meetingTitle
        .toLowerCase()
        .includes(search.toLowerCase())
    );


  return (

    <div className="decisions-page">


      {/* HEADER */}

      <header className="decisions-header">

        <div>

          <p className="decisions-label">
            DECISION LOG
          </p>

          <h1>
            Decisions
          </h1>

          <p>
            Keep track of the important decisions
            made across your meetings.
          </p>

        </div>


        <button
          className="new-meeting-btn"
          onClick={() =>
            navigate("/new-meeting")
          }
        >

          <Plus size={18} />

          New Meeting

        </button>

      </header>



      {/* SEARCH */}

      <div className="decisions-toolbar">

        <div className="decisions-search">

          <Search size={18} />

          <input
  type="text"
  aria-label="Search decisions"
  placeholder="Search decisions..."
  value={search}
  onChange={(e) =>
    setSearch(e.target.value)
  }
/>

        </div>


        <span className="decision-count">
  {search
    ? `${filteredDecisions.length} ${
        filteredDecisions.length === 1
          ? "result"
          : "results"
      }`
    : `${decisions.length} ${
        decisions.length === 1
          ? "decision"
          : "decisions"
      }`}
</span>

      </div>



      {/* CONTENT */}

      <main className="decisions-content">

        {loading ? (

  <div className="decisions-empty">

    <GitBranch size={32} />

    <h3>
      Loading decisions...
    </h3>

  </div>

) : error ? (

  <div className="decisions-empty">

    <GitBranch size={34} />

    <h3>
      Couldn't load decisions
    </h3>

    <p>
      {error}
    </p>

    <button
      className="retry-btn"
      onClick={fetchMeetings}
    >
      Try Again
    </button>

  </div>

) : filteredDecisions.length === 0 ? (

          <div className="decisions-empty">

            <GitBranch size={34} />

            <h3>
              {search
                ? "No decisions found"
                : "No decisions yet"}
            </h3>

            <p>
              {search
                ? "Try searching for a different decision or meeting."
                : "Decisions extracted by MeetMind AI will appear here."}
            </p>

          </div>

        ) : (

          <div className="decisions-list">

            {filteredDecisions.map(
              (item, index) => (

                <div
  className="decision-card"
  key={item.id}
>

                  <div className="decision-number">

                    {String(index + 1).padStart(
                      2,
                      "0"
                    )}

                  </div>


                  <div className="decision-main">

                    <div className="decision-meta">

                      <span className="decision-badge">

                        <GitBranch size={14} />

                        Decision

                      </span>

                      <span>

                        <Calendar size={14} />

                        {new Date(
                          item.createdAt
                        ).toLocaleDateString()}

                      </span>

                    </div>


                    <h2>
                      {item.decision}
                    </h2>


                    <button
                      className="source-meeting"
                      onClick={() =>
                        navigate(
                          `/meetings/${item.meetingId}`
                        )
                      }
                    >

                      From:
                      {" "}
                      {item.meetingTitle}

                      <ArrowRight size={15} />

                    </button>

                  </div>

                </div>

              )
            )}

          </div>

        )}

      </main>

    </div>

  );

}


export default DecisionsPage;
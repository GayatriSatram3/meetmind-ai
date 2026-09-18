import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  Calendar,
  ArrowRight,
  Sparkles,
  FileText,
} from "lucide-react";

import api from "../api/axios";
import "../styles/MeetingsPage.css";


function MeetingsPage() {

  const navigate = useNavigate();

  const [meetings, setMeetings] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    fetchMeetings();
  }, []);


  const fetchMeetings = async () => {

    try {

      const workspaceId =
        localStorage.getItem("workspaceId");

      if (!workspaceId) {
        return;
      }

      const response = await api.get(
        `/meetings/workspace/${workspaceId}`
      );

      setMeetings(
        response.data.meetings || []
      );

    } catch (error) {

      console.error(
        "Failed to fetch meetings:",
        error.response?.data || error
      );

    } finally {

      setLoading(false);

    }

  };


  const filteredMeetings = meetings.filter(
  (meeting) => {

    const query = search
      .trim()
      .toLowerCase();

    if (!query) {
      return true;
    }

    const title =
      meeting.title?.toLowerCase() || "";

    const description =
      meeting.description?.toLowerCase() || "";

    const summary =
      meeting.aiSummary?.toLowerCase() || "";

    return (
      title.includes(query) ||
      description.includes(query) ||
      summary.includes(query)
    );

  }
);


  return (

    <div className="meetings-page">


      {/* HEADER */}

      <header className="meetings-header">

        <div>

          <p className="meetings-label">
            MEETING LIBRARY
          </p>

          <h1>
            Your meetings
          </h1>

          <p>
            Search and explore everything your team has discussed.
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

      <div className="meetings-toolbar">

        <div className="meetings-search">

          <Search size={18} />

          <input
            type="text"
            placeholder="Search meetings..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>


        <div className="meeting-count">

          {filteredMeetings.length} meetings

        </div>

      </div>



      {/* CONTENT */}

      <main className="meetings-content">

        {loading ? (

          <div className="meetings-empty">

            <Sparkles size={30} />

            <h3>
              Loading meetings...
            </h3>

          </div>

        ) : filteredMeetings.length === 0 ? (

          <div className="meetings-empty">

            <FileText size={32} />

            <h3>
              {search
                ? "No meetings found"
                : "No meetings yet"}
            </h3>

            <p>
              {search
                ? "Try a different search term."
                : "Create your first meeting to start building your meeting intelligence library."}
            </p>

            {!search && (

              <button
                onClick={() =>
                  navigate("/new-meeting")
                }
              >
                Create meeting
              </button>

            )}

          </div>

        ) : (

          <div className="meetings-grid">

            {filteredMeetings.map(
              (meeting) => {

                const actionCount =
                  Array.isArray(
                    meeting.aiActionItems
                  )
                    ? meeting.aiActionItems.length
                    : 0;

                const decisionCount =
                  Array.isArray(
                    meeting.aiDecisions
                  )
                    ? meeting.aiDecisions.length
                    : 0;


                return (

                  <div
                    className="meeting-card"
                    key={meeting.id}
                    onClick={() =>
                      navigate(
                        `/meetings/${meeting.id}`
                      )
                    }
                  >

                    <div className="meeting-card-top">

                      <div className="meeting-card-icon">

                        <Calendar size={19} />

                      </div>

                      <ArrowRight
                        size={18}
                        className="meeting-card-arrow"
                      />

                    </div>


                    <h2>
                      {meeting.title}
                    </h2>


                    <div className="meeting-card-meta">

  <span>
    <Calendar size={13} />

    {new Date(
      meeting.createdAt
    ).toLocaleDateString()}
  </span>


  {meeting.duration && (
    <span>
      <FileText size={13} />

      {meeting.duration < 60
        ? `${meeting.duration} min`
        : `${Math.floor(
            meeting.duration / 60
          )} hr ${
            meeting.duration % 60
              ? `${meeting.duration % 60} min`
              : ""
          }`}
    </span>
  )}

</div>


                    <p className="meeting-card-summary">

                      {meeting.aiSummary ||
                        "AI analysis is not available for this meeting yet."}

                    </p>


                    <div className="meeting-card-footer">

                      {actionCount > 0 && (

                        <span className="meeting-tag purple">

                          {actionCount}{" "}

                          {actionCount === 1
                            ? "action"
                            : "actions"}

                        </span>

                      )}


                      {decisionCount > 0 && (

                        <span className="meeting-tag green">

                          {decisionCount}{" "}

                          {decisionCount === 1
                            ? "decision"
                            : "decisions"}

                        </span>

                      )}

                    </div>

                  </div>

                );

              }
            )}

          </div>

        )}

      </main>

    </div>

  );

}


export default MeetingsPage;
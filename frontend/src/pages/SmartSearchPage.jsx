import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Search,
  Sparkles,
  Calendar,
  ArrowRight,
  FileText,
  CheckSquare,
  GitBranch,
} from "lucide-react";

import api from "../api/axios";
import "../styles/SmartSearchPage.css";

function SmartSearchPage() {
  const navigate = useNavigate();

  const [results, setResults] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchMode, setSearchMode] = useState("semantic");
  const [error, setError] = useState("");

  const performSearch = async (
  value,
  mode = searchMode
) => {
  setQuery(value);
  setError("");

  if (!value.trim()) {
    setResults([]);
    return;
  }

  try {
    setLoading(true);

    const workspaceId =
      localStorage.getItem("workspaceId");

    if (!workspaceId) {
      setError("No workspace selected.");
      setResults([]);
      return;
    }

    const endpoint =
      mode === "semantic"
        ? `/search/semantic/${workspaceId}`
        : `/search/meetings/${workspaceId}`;

    const response = await api.get(endpoint, {
      params: {
        q: value,
      },
    });

    setResults(
      response.data.results ||
      response.data.meetings ||
      []
    );

  } catch (error) {
    console.error(
      "Search error:",
      error.response?.data || error
    );

    setResults([]);

    setError(
      error.response?.data?.message ||
      "Search failed. Please try again."
    );

  } finally {
    setLoading(false);
  }
};

  return (
    <div className="smart-search-page">

      {/* Header */}

      <div className="smart-search-header">

        <div>
          <p className="section-label">
            MEETMIND AI
          </p>

          <h1>
            Smart Search
          </h1>

          <p>
            Search across your meetings, decisions,
            action items and transcripts.
          </p>
        </div>

        <div className="ai-search-badge">
          <Sparkles size={17} />
          AI Powered
        </div>

      </div>


      {/* Search Box */}

      <div className="smart-search-box">

        <Search size={22} />

        <input
  type="text"
  aria-label="Search meetings"
          placeholder="Search meetings, decisions, tasks..."
          value={query}
          onChange={(e) =>
            performSearch(e.target.value)
          }
        />

        {query && (
          <button
            className="clear-search"
            onClick={() => {
              setQuery("");
              setResults([]);
            }}
          >
            Clear
          </button>
        )}

      </div>


      {/* Search Mode */}

      <div className="search-mode-toggle">

        <button
          className={
            searchMode === "keyword"
              ? "active"
              : ""
          }
          onClick={() => {
            setSearchMode("keyword");

            if (query.trim()) {
              performSearch(
                query,
                "keyword"
              );
            }
          }}
        >
          🔍 Keyword
        </button>


        <button
          className={
            searchMode === "semantic"
              ? "active"
              : ""
          }
          onClick={() => {
            setSearchMode("semantic");

            if (query.trim()) {
              performSearch(
                query,
                "semantic"
              );
            }
          }}
        >
          🧠 Semantic
        </button>

      </div>


      {/* Suggestions */}

      {!query && (
        <div className="search-suggestions">

          <p>
            Try searching for:
          </p>

          <div className="suggestion-list">

            <button
              onClick={() =>
                performSearch(
                  "product launch"
                )
              }
            >
              <GitBranch size={16} />
              Product launch decisions
            </button>


            <button
              onClick={() =>
                performSearch(
                  "frontend"
                )
              }
            >
              <CheckSquare size={16} />
              Frontend action items
            </button>


            <button
              onClick={() =>
                performSearch(
                  "deadline"
                )
              }
            >
              <Calendar size={16} />
              Meeting deadlines
            </button>

          </div>

        </div>
      )}


      {/* Results */}

      {query && (
        <div className="search-results">

          <div className="results-header">

            <div>

              <span>
                SEARCH RESULTS
              </span>

              <h2>
  {results.length}{" "}
  {results.length === 1
    ? "result"
    : "results"}{" "}
  found
</h2>

            </div>

          </div>


          {/* Loading */}

          {loading ? (

  <div className="search-empty">
    <Search size={32} />

    <h3>
      Searching meetings...
    </h3>

    <p>
      {searchMode === "semantic"
        ? "Finding meetings by meaning..."
        : "Finding meetings by keyword..."}
    </p>
  </div>

) : error ? (

  <div className="search-empty">

    <Search size={32} />

    <h3>
      Search failed
    </h3>

    <p>
      {error}
    </p>

    <button
      className="retry-search-btn"
      onClick={() =>
        performSearch(query, searchMode)
      }
    >
      Try Again
    </button>

  </div>

) : results.length === 0 ? (

            <div className="search-empty">

              <Search size={32} />

              <h3>
                No meetings found
              </h3>

              <p>
                Try searching with a different
                keyword or phrase.
              </p>

            </div>

          ) : (

            <div className="search-result-list">

              {results.map((meeting) => {

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
  className="search-result-card"
  key={meeting.id}
  role="button"
  tabIndex={0}
  onClick={() =>
    navigate(`/meetings/${meeting.id}`)
  }
  onKeyDown={(e) => {
    if (e.key === "Enter" || e.key === " ") {
      navigate(`/meetings/${meeting.id}`);
    }
  }}
>

                    <div className="result-icon">
                      <FileText size={20} />
                    </div>


                    <div className="result-content">

                      <h3>
                        {meeting.title}
                      </h3>


                      <p className="result-date">

                        <Calendar size={14} />

                        {new Date(
                          meeting.createdAt
                        ).toLocaleDateString()}

                      </p>


                      {meeting.aiSummary && (

                        <p className="result-summary">
                          {meeting.aiSummary}
                        </p>

                      )}


                      {/* Semantic similarity */}

                      {searchMode === "semantic" &&
                        meeting.similarity !== undefined && (

                          <div className="similarity-score">
  <Sparkles size={13} />

  Semantic relevance
  <strong>
    {meeting.similarity.toFixed(3)}
  </strong>
</div>

                      )}


                      <div className="result-tags">

                        {actionCount > 0 && (

                          <span>
                            <CheckSquare size={13} />
                            {actionCount} actions
                          </span>

                        )}


                        {decisionCount > 0 && (

                          <span>
                            <GitBranch size={13} />
                            {decisionCount} decisions
                          </span>

                        )}

                      </div>

                    </div>


                    <ArrowRight
                      size={18}
                      className="result-arrow"
                    />

                  </div>

                );

              })}

            </div>

          )}

        </div>
      )}

    </div>
  );
}

export default SmartSearchPage;
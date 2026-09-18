import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";

import {
  Sparkles,
  Send,
  FileText,
  ArrowRight,
  Loader2,
  MessageSquare,
} from "lucide-react";

import api from "../api/axios";
import "../styles/AskAIPage.css";


function AskAIPage() {

  const navigate = useNavigate();

  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  const askAI = async () => {

  if (!question.trim() || loading) {
    return;
  }

  const currentQuestion = question.trim();

  try {

    setLoading(true);
    setError("");
    setQuestion("");

    const workspaceId =
      localStorage.getItem("workspaceId");

    if (!workspaceId) {

      setError(
        "Workspace not found. Please log in again."
      );

      return;
    }


    // Add user message immediately

    setMessages((prev) => [
      ...prev,

      {
        type: "user",
        content: currentQuestion,
      },

    ]);


    const history = messages.map((message) => ({
      role:
        message.type === "user"
          ? "user"
          : "assistant",
      content: message.content,
    }));
    
    const response = await api.post(
      `/rag/ask/${workspaceId}`,
      {
        question: currentQuestion,
        history,
      }
    );
    
    
    // Add AI response

    setMessages((prev) => [
      ...prev,

      {
        type: "ai",
        content:
          response.data.answer || "",
        sources:
          response.data.sources || [],
      },

    ]);

  } catch (error) {

    console.error(
      "Ask AI error:",
      error.response?.data || error
    );

    setError(
      error.response?.data?.message ||
      "Failed to get an answer. Please try again."
    );

  } finally {

    setLoading(false);

  }
};


  const handleKeyDown = (e) => {

    if (e.key === "Enter" && !e.shiftKey) {

      e.preventDefault();
      askAI();

    }

  };


  const useSuggestion = (text) => {

    setQuestion(text);

  };


  return (

    <div className="ask-ai-page">


      {/* Header */}

      <div className="ask-ai-header">

        <div>

          <p className="section-label">
            MEETMIND AI
          </p>

          <h1>
            Ask MeetMind AI
          </h1>

          <p>
            Ask questions about your meetings and
            get answers grounded in your meeting data.
          </p>

        </div>


        <div className="ai-assistant-badge">

          <Sparkles size={17} />

          AI Assistant

        </div>

      </div>



      {/* Question Box */}

      <div className="ai-question-card">

        <div className="question-icon">

          <MessageSquare size={20} />

        </div>


        <div className="question-input-area">

          <textarea
            value={question}
            onChange={(e) =>
              setQuestion(e.target.value)
            }
            onKeyDown={handleKeyDown}
            placeholder="Ask something about your meetings..."
            rows={3}
          />


          <div className="question-footer">

            <span>
              Press Enter to ask
            </span>


            <button
              onClick={askAI}
              disabled={
                loading ||
                !question.trim()
              }
            >

              {loading ? (

                <>
                  <Loader2
                    size={17}
                    className="spin"
                  />

                  Thinking...
                </>

              ) : (

                <>
                  <Send size={17} />

                  Ask AI
                </>

              )}

            </button>

          </div>

        </div>

      </div>



      {/* Suggestions */}

      {messages.length === 0 && !loading && !error && (
        <div className="ai-suggestions">

          <p>
            Try asking:
          </p>


          <div className="ai-suggestion-list">

            <button
              onClick={() =>
                useSuggestion(
                  "What are the deadlines for the development work?"
                )
              }
            >
              What are the deadlines for the development work?
            </button>


            <button
              onClick={() =>
                useSuggestion(
                  "What decisions were made in the meetings?"
                )
              }
            >
              What decisions were made in the meetings?
            </button>


            <button
              onClick={() =>
                useSuggestion(
                  "What action items were assigned?"
                )
              }
            >
              What action items were assigned?
            </button>

          </div>

        </div>

      )}



            {/* Error */}

      {error && (

        <div className="ai-error">

          <strong>
            Something went wrong
          </strong>

          <p>
            {error}
          </p>

        </div>

      )}


      {/* Loading */}

      {loading && (

        <div className="ai-answer-card loading-card">

          <div className="answer-heading">

            <Sparkles size={19} />

            <span>
              MeetMind AI is thinking...
            </span>

          </div>

          <div className="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>

        </div>

      )}


      {/* Conversation */}

      {messages.length > 0 && (

        <div className="conversation">

          {messages.map((message, index) => (

            <div
              className={`chat-message ${
                message.type === "user"
                  ? "user-message"
                  : "ai-message"
              }`}
              key={index}
            >

              {message.type === "user" ? (

                <>
                  <div className="message-label">
                    You
                  </div>

                  <div className="user-bubble">
                    {message.content}
                  </div>
                </>

              ) : (

                <>
                  <div className="message-label ai-label">

                    <Sparkles size={15} />

                    MeetMind AI

                  </div>

                  <div className="ai-bubble">

                    <ReactMarkdown>
                      {message.content}
                    </ReactMarkdown>

                    {message.sources &&
                      message.sources.length > 0 && (

                      <div className="ai-sources">

                        <div className="sources-header">

                          <FileText size={17} />

                          <h3>
                            Sources
                          </h3>

                        </div>

                        <div className="source-list">

                          {message.sources.map(
                            (source) => (

                            <div
                              className="source-card"
                              key={source.id}
                              onClick={() =>
                                navigate(
                                  `/meetings/${source.id}`
                                )
                              }
                            >

                              <div className="source-icon">
                                <FileText size={17} />
                              </div>

                              <div className="source-info">

                                <h4>
                                  {source.title}
                                </h4>

                                <span>
                                  Semantic relevance:{" "}
                                  {source.similarity?.toFixed(3)}
                                </span>

                              </div>

                              <ArrowRight size={17} />

                            </div>

                          ))}

                        </div>

                      </div>

                    )}

                  </div>
                </>

              )}

            </div>

          ))}

        </div>

      )}

    </div>

  );
}

export default AskAIPage;
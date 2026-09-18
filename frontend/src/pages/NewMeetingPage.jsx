import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  Mic,
  FileText,
  PenLine,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

import "../styles/NewMeetingPage.css";


function NewMeetingPage() {

  const navigate = useNavigate();

  const [selectedMethod, setSelectedMethod] = useState(null);


  const methods = [

    {
      id: "audio",
      icon: Mic,
      title: "Upload audio",
      description:
        "Upload your meeting recording and let AI turn it into structured intelligence.",
      label: "MOST POWERFUL",
      features: [
        "Automatic transcription",
        "AI summary",
        "Action items & decisions",
      ],
    },

    {
      id: "transcript",
      icon: FileText,
      title: "Paste transcript",
      description:
        "Already have a transcript? Paste it and let MeetMind understand everything.",
      label: "FASTEST",
      features: [
        "Instant AI analysis",
        "Extract action items",
        "Find key decisions",
      ],
    },

    {
      id: "notes",
      icon: PenLine,
      title: "Quick notes",
      description:
        "Create a meeting manually and organize notes for your team.",
      label: "SIMPLE",
      features: [
        "Manual notes",
        "Team collaboration",
        "Add AI analysis later",
      ],
    },

  ];


  return (

    <div className="new-meeting-page">


      {/* TOP BAR */}

      <header className="new-meeting-header">

        <button
          className="back-button"
          onClick={() => navigate("/dashboard")}
        >

          <ArrowLeft size={18} />

          Back to dashboard

        </button>


        <div className="header-brand">

          <div className="mini-logo">
            <Sparkles size={16} />
          </div>

          MeetMindAI

        </div>

      </header>



      {/* MAIN */}

      <main className="new-meeting-content">


        <div className="new-meeting-heading">

          <div className="new-meeting-badge">

            <Sparkles size={15} />

            CREATE MEETING

          </div>


          <h1>
            Start with your
            <span> conversation.</span>
          </h1>


          <p>
            Choose how you'd like to bring your meeting into MeetMind.
            We'll take care of turning it into something useful.
          </p>

        </div>



        {/* METHOD CARDS */}

        <div className="meeting-methods">


          {methods.map((method) => {

            const Icon = method.icon;

            return (

              <div
                key={method.id}
                className={`method-card ${
                  selectedMethod === method.id
                    ? "selected"
                    : ""
                }`}
                onClick={() =>
                  setSelectedMethod(method.id)
                }
              >

                <div className="method-top">

                  <div className="method-icon">

                    <Icon size={24} />

                  </div>


                  <span className="method-label">

                    {method.label}

                  </span>

                </div>


                <h2>
                  {method.title}
                </h2>


                <p className="method-description">

                  {method.description}

                </p>


                <div className="method-features">

                  {method.features.map((feature) => (

                    <div key={feature}>

                      <CheckCircle2 size={15} />

                      {feature}

                    </div>

                  ))}

                </div>


                <div className="method-select">

                  <span>
                    Select
                  </span>

                  <ArrowRight size={17} />

                </div>

              </div>

            );

          })}

        </div>



        {/* CONTINUE */}

        <button
          className="continue-button"
          disabled={!selectedMethod}
          onClick={() => navigate(`/new-meeting/${selectedMethod}`)}
        >
          Continue
          <ArrowRight size={18} />
        </button>


        <p className="new-meeting-footer">

          You can always edit your meeting information later.

        </p>


      </main>

    </div>

  );

}


export default NewMeetingPage;
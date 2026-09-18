import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  Brain,
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

import api from "../api/axios";

import "../styles/RegisterPage.css";


function RegisterPage() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");


  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };


  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");

    setLoading(true);

    try {

      const response = await api.post(
        "/auth/register",
        formData
      );

      console.log(response.data);

      navigate("/login");

    } catch (error) {

      setError(
        error.response?.data?.message ||
        "Something went wrong"
      );

    } finally {

      setLoading(false);

    }

  };


  return (

    <div className="register-page">

      {/* LEFT SIDE */}

      <div className="register-showcase">

        <Link
          to="/"
          className="auth-logo"
        >

          <div className="auth-logo-icon">
            <Brain size={22} />
          </div>

          <span>
            MeetMindAI
          </span>

        </Link>


        <div className="register-content">

          <div className="auth-badge">

            <Sparkles size={16} />

            AI-powered meetings

          </div>


          <h1>
            Every meeting has
            <span> something important.</span>
          </h1>


          <p>
            MeetMind helps your team remember
            decisions, tasks, and ideas automatically.
          </p>


          <div className="auth-benefits">

            <div>

              <CheckCircle2 size={18} />

              AI-generated meeting summaries

            </div>

            <div>

              <CheckCircle2 size={18} />

              Automatic action items

            </div>

            <div>

              <CheckCircle2 size={18} />

              Smart meeting search

            </div>

          </div>

        </div>


        {/* Decorative Meeting Card */}

        <div className="auth-meeting-card">

          <div className="auth-card-header">

            <div className="small-brain">
              <Brain size={16} />
            </div>

            <span>
              AI Analysis Ready
            </span>

          </div>


          <div className="auth-card-title">

            Product Planning

          </div>


          <div className="auth-card-line"></div>

          <div className="auth-card-line medium"></div>


          <div className="auth-card-task">

            <CheckCircle2 size={16} />

            Build dashboard interface

          </div>

        </div>

      </div>


      {/* RIGHT SIDE */}

      <div className="register-form-section">

        <div className="register-form-container">

          <div className="auth-heading">

            <span>
              CREATE ACCOUNT
            </span>

            <h2>
              Join MeetMindAI
            </h2>

            <p>
              Start turning meetings into action.
            </p>

          </div>


          {/* Error */}

          {error && (

            <div className="auth-error">

              {error}

            </div>

          )}


          <form onSubmit={handleSubmit}>


            {/* Name */}

            <div className="auth-input-group">

              <label>
                Full name
              </label>

              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                required
              />

            </div>


            {/* Email */}

            <div className="auth-input-group">

              <label>
                Email address
              </label>

              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />

            </div>


            {/* Password */}

            <div className="auth-input-group">

              <label>
                Password
              </label>

              <div className="password-input">

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >

                  {
                    showPassword
                      ? <EyeOff size={18} />
                      : <Eye size={18} />
                  }

                </button>

              </div>

            </div>


            {/* Submit */}

            <button
              type="submit"
              className="auth-submit-button"
              disabled={loading}
            >

              {
                loading
                  ? "Creating account..."
                  : "Create account"
              }

              {!loading && (
                <ArrowRight size={18} />
              )}

            </button>


          </form>


          <div className="auth-switch">

            Already have an account?

            <Link to="/login">

              Sign in

            </Link>

          </div>

        </div>

      </div>

    </div>

  );

}

export default RegisterPage;
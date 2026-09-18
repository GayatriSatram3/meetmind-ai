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

import "../styles/LoginPage.css";


function LoginPage() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
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
    // Login
    const response = await api.post(
      "/auth/login",
      formData
    );

    console.log("Login response:", response.data);

    // Save JWT token
    localStorage.setItem(
      "token",
      response.data.token
    );

    // Save user
    localStorage.setItem(
      "user",
      JSON.stringify(response.data.user)
    );

    // Get user's workspaces
    const workspaceResponse = await api.get(
      "/workspaces"
    );

    const workspaces =
      workspaceResponse.data.workspaces;

    // Select first workspace
    if (workspaces.length > 0) {
      localStorage.setItem(
        "workspaceId",
        workspaces[0].id
      );

      console.log(
        "Workspace selected:",
        workspaces[0].id
      );
    } else {
      console.log("No workspaces found");
    }

    // Redirect to dashboard
    navigate("/dashboard");

  } catch (error) {
    console.error(
      "Login error:",
      error.response?.data || error
    );

    setError(
      error.response?.data?.message ||
      "Invalid email or password"
    );

  } finally {
    setLoading(false);
  }
};


  return (

    <div className="login-page">


      {/* LEFT SIDE */}

      <div className="login-showcase">


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


        <div className="login-content">


          <div className="auth-badge">

            <Sparkles size={16} />

            Welcome back

          </div>


          <h1>
            Your meetings
            <span> remember everything.</span>
          </h1>


          <p>
            Continue where you left off and discover
            everything your team discussed.
          </p>


          <div className="login-benefits">

            <div>

              <CheckCircle2 size={18} />

              Review meeting intelligence

            </div>


            <div>

              <CheckCircle2 size={18} />

              Track action items

            </div>


            <div>

              <CheckCircle2 size={18} />

              Explore team knowledge

            </div>

          </div>


        </div>


        {/* Decorative Card */}

        <div className="login-insight-card">

          <div className="insight-card-top">

            <Brain size={17} />

            <span>
              MEETMIND INSIGHT
            </span>

          </div>


          <h3>
            3 new action items
          </h3>


          <div className="insight-progress">

            <div></div>

          </div>


          <p>
            Your team is moving forward.
          </p>

        </div>


      </div>



      {/* RIGHT SIDE */}

      <div className="login-form-section">


        <div className="login-form-container">


          <div className="auth-heading">

            <span>
              WELCOME BACK
            </span>

            <h2>
              Sign in to MeetMindAI
            </h2>

            <p>
              Continue turning conversations into action.
            </p>

          </div>


          {/* Error */}

          {error && (

            <div className="auth-error">

              {error}

            </div>

          )}


          <form onSubmit={handleSubmit}>


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
                  placeholder="Enter your password"
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
                  ? "Signing in..."
                  : "Sign in"
              }

              {!loading && (
                <ArrowRight size={18} />
              )}

            </button>


          </form>


          <div className="auth-switch">

            Don't have an account?

            <Link to="/register">

              Create account

            </Link>

          </div>


        </div>


      </div>


    </div>

  );

}

export default LoginPage;
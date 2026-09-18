import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import NewMeetingPage from "./pages/NewMeetingPage";
import TranscriptMeetingPage from "./pages/TranscriptMeetingPage";
import MeetingIntelligencePage from "./pages/MeetingIntelligencePage";
import ActionItemsPage from "./pages/ActionItemsPage";
import MeetingsPage from "./pages/MeetingsPage";
import DecisionsPage from "./pages/DecisionsPage";
import SmartSearchPage from "./pages/SmartSearchPage";
import AskAIPage from "./pages/AskAIPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import MembersPage from "./pages/MembersPage";
import MeetingDetailsPage from "./pages/MeetingDetailsPage";


function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={<LandingPage />}
        />

        <Route
          path="/register"
          element={<RegisterPage />}
        />

        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/dashboard"
          element={<DashboardPage />}
        />

        <Route
          path="/new-meeting"
          element={<NewMeetingPage />}
        />

        <Route
          path="/new-meeting/transcript"
          element={<TranscriptMeetingPage />}
        />

        <Route
          path="/meetings/:meetingId"
          element={<MeetingDetailsPage />}
        />

        <Route
          path="/action-items"
          element={<ActionItemsPage />}
        />

        <Route
          path="/meetings"
          element={<MeetingsPage />}
        />

        <Route
          path="/decisions"
          element={<DecisionsPage />}
        />

        <Route
          path="/smart-search"
          element={<SmartSearchPage />}
        />
        
        <Route
          path="/ask-ai"
          element={<AskAIPage />}
        />

        <Route
          path="/analytics"
          element={<AnalyticsPage />}
        />

        <Route
          path="/members"
          element={<MembersPage />}
        />


        <Route
          path="/meetings/:meetingId"
          element={<MeetingDetailsPage />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const analyticsRoutes = require("./routes/analytics.routes");
const authRoutes = require("./routes/auth.routes");
const workspaceRoutes = require("./routes/workspace.routes");
const meetingRoutes = require("./routes/meeting.routes");
const taskRoutes = require("./routes/task.routes");
const searchRoutes = require("./routes/search.routes");
const ragRoutes = require("./routes/rag.routes");
const memberRoutes = require("./routes/member.routes");
const audioRoutes = require("./routes/audio.routes");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "MeetMind AI backend is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/workspaces", workspaceRoutes);
app.use("/api/meetings", meetingRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/rag", ragRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/members", memberRoutes);
app.use("/api/audio", audioRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
const express = require("express");

const router = express.Router();

const {
  createMeeting,
  getMeeting,
  getWorkspaceMeetings,
} = require("../controllers/meeting.controller");

const authenticateUser =
  require("../middleware/auth.middleware");


router.post(
  "/:workspaceId",
  authenticateUser,
  createMeeting
);


router.get(
  "/:meetingId",
  authenticateUser,
  getMeeting
);

router.get(
  "/workspace/:workspaceId",
  authenticateUser,
  getWorkspaceMeetings
);

module.exports = router;
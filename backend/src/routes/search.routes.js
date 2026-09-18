const express = require("express");

const router = express.Router();

const {
    searchMeetings,
    semanticSearchMeetings,
} = require("../controllers/search.controller");

const authenticateUser =
  require("../middleware/auth.middleware");

router.get(
  "/meetings/:workspaceId",
  authenticateUser,
  searchMeetings
);

router.get(
    "/semantic/:workspaceId",
    authenticateUser,
    semanticSearchMeetings
);

module.exports = router;
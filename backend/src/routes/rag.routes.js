const express = require("express");

const router = express.Router();

const {
    askMeetingQuestion,
} = require("../controllers/rag.controller");

const authenticateUser =
    require("../middleware/auth.middleware");


router.post(
    "/ask/:workspaceId",
    authenticateUser,
    askMeetingQuestion
);


module.exports = router;
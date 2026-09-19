const express = require("express");

const authenticateUser = require("../middleware/auth.middleware");

const uploadAudio = require("../middleware/upload.middleware");

const {
    uploadAndAnalyzeAudio,
} = require("../controllers/audio.controller");

const router = express.Router();

router.post(
    "/:workspaceId",
    authenticateUser,
    uploadAudio.single("audio"),
    uploadAndAnalyzeAudio
);

module.exports = router;
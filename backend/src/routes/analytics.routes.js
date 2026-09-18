const express = require("express");

const router = express.Router();

const {
    getWorkspaceAnalytics,
    generateAIWorkspaceSummary,
} = require("../controllers/analytics.controller");

const authenticateUser =
    require(
        "../middleware/auth.middleware"
    );

router.get(
    "/:workspaceId",
    authenticateUser,
    getWorkspaceAnalytics
);

router.get(
    "/:workspaceId/ai-summary",
    authenticateUser,
    generateAIWorkspaceSummary
);

module.exports = router;
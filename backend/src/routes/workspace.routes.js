const express = require("express");

const {
    createWorkspace,
    getMyWorkspaces,
    getWorkspaceById
} = require("../controllers/workspace.controller");

const authenticateUser =
    require("../middleware/auth.middleware");

const router = express.Router();

router.post(
    "/",
    authenticateUser,
    createWorkspace
);

router.get(
    "/",
    authenticateUser,
    getMyWorkspaces
);

router.get(
    "/:workspaceId",
    authenticateUser,
    getWorkspaceById
);

module.exports = router;
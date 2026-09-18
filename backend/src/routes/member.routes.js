const express = require("express");

const router = express.Router();

const {
    getWorkspaceMembers,
    addWorkspaceMember,
    updateMemberRole,
    removeWorkspaceMember,
} = require("../controllers/member.controller");

const authenticateUser =
    require("../middleware/auth.middleware");

router.get(
    "/:workspaceId",
    authenticateUser,
    getWorkspaceMembers
);

router.post(
    "/:workspaceId",
    authenticateUser,
    addWorkspaceMember
);

router.patch(
    "/:workspaceId/role",
    authenticateUser,
    updateMemberRole
);

router.delete(
    "/:workspaceId/:memberId",
    authenticateUser,
    removeWorkspaceMember
);

module.exports = router;
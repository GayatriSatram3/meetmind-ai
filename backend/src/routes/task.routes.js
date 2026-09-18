const express = require("express");

const router = express.Router();

const {
  createTask,
  getWorkspaceTasks,
  updateTaskStatus,
} = require("../controllers/task.controller");

const authenticateUser =
  require("../middleware/auth.middleware");


// Create task
router.post(
  "/:workspaceId",
  authenticateUser,
  createTask
);


// Get workspace tasks
router.get(
  "/:workspaceId",
  authenticateUser,
  getWorkspaceTasks
);


// Update task status
router.patch(
  "/:workspaceId/status/:taskId",
  authenticateUser,
  updateTaskStatus
);


module.exports = router;
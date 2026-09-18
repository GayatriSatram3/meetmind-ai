const prisma = require("../config/prisma");

// Create a task
const createTask = async (req, res) => {
  try {
    const { title, description, owner, deadline, meetingId } =
      req.body;

    const userId = req.user.userId;
    const { workspaceId } = req.params;

    if (!title || !title.trim()) {
    return res.status(400).json({
        success: false,
        message: "Task title is required",
    });
}

    if (!meetingId) {
      return res.status(400).json({
        success: false,
        message: "Meeting ID is required",
      });
    }

    // Check workspace membership
    const membership =
  await prisma.workspaceMember.findUnique({
    where: {
      userId_workspaceId: {
        userId,
        workspaceId,
      },
    },
  });
    if (!membership) {
      return res.status(403).json({
        success: false,
        message: "You don't have access to this workspace",
      });
    }

    // Check meeting belongs to workspace
    const meeting = await prisma.meeting.findFirst({
      where: {
        id: meetingId,
        workspaceId,
      },
    });

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found",
      });
    }

    const task = await prisma.task.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
owner: owner?.trim() || null,
deadline: deadline?.trim() || null,
        meetingId,
        workspaceId,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Task created successfully",
      task,
    });

  } catch (error) {
    console.error("Create task error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create task",
    });
  }
};


// Get all tasks in workspace
const getWorkspaceTasks = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { workspaceId } = req.params;

    // Check membership
    const membership =
      await prisma.workspaceMember.findUnique({
        where: {
          userId_workspaceId: {
            userId,
            workspaceId,
          },
        },
      });

    if (!membership) {
      return res.status(403).json({
        success: false,
        message: "You don't have access to this workspace",
      });
    }

    const tasks = await prisma.task.findMany({
      where: {
        workspaceId,
      },
      include: {
        meeting: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      tasks,
    });

  } catch (error) {
    console.error("Get tasks error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch tasks",
    });
  }
};


// Update task status
const updateTaskStatus = async (req, res) => {
  try {
    const { taskId, workspaceId } = req.params;
    const { status } = req.body;

    const userId = req.user.userId;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Task status is required",
      });
    }

    const validStatuses = [
      "PENDING",
      "IN_PROGRESS",
      "COMPLETED",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task status",
      });
    }

    // Check workspace membership
    const membership =
      await prisma.workspaceMember.findUnique({
        where: {
          userId_workspaceId: {
            userId,
            workspaceId,
          },
        },
      });

    if (!membership) {
      return res.status(403).json({
        success: false,
        message: "You don't have access to this workspace",
      });
    }

    // Check task belongs to workspace
    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        workspaceId,
      },
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    const updatedTask =
      await prisma.task.update({
        where: {
          id: taskId,
        },
        data: {
          status,
        },
      });

    return res.status(200).json({
      success: true,
      message: "Task status updated successfully",
      task: updatedTask,
    });

  } catch (error) {
    console.error(
      "Update task status error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to update task status",
    });
  }
};


module.exports = {
  createTask,
  getWorkspaceTasks,
  updateTaskStatus,
};
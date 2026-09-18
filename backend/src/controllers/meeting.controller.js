const prisma = require("../config/prisma");
const { analyzeMeeting } = require("../services/ai.service");
const { generateEmbedding,} = require("../services/embedding.service");

const createMeeting = async (req, res) => {
  try {
    const { title, description, duration } = req.body;

    const userId = req.user.userId;
    const { workspaceId } = req.params;

    let meetingDuration = null;

if (
  duration !== undefined &&
  duration !== null &&
  duration !== ""
) {
  meetingDuration = Number(duration);

  if (
    !Number.isFinite(meetingDuration) ||
    meetingDuration < 0
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Duration must be a valid non-negative number",
    });
  }
}

    if (!title || !title.trim()) {
    return res.status(400).json({
        success: false,
        message: "Meeting title is required",
    });
}

if (!description || !description.trim()) {
    return res.status(400).json({
        success: false,
        message: "Meeting transcript is required",
    });
}

    // Check workspace access
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

    console.log("🧠 Analyzing meeting with AI...");

    // Analyze transcript using AI
    const analysis = await analyzeMeeting(description);
    const embeddingText = `
Title: ${title}

Transcript:
${description}

Summary:
${analysis.summary || ""}
`;

const embedding =
  await generateEmbedding(embeddingText);

    console.log("✅ AI analysis completed");

    // Save meeting + AI analysis
    const meeting = await prisma.meeting.create({
  data: {
    title: title.trim(),
    description: description.trim(),
    duration: meetingDuration,

    embedding,

    userId,
    workspaceId,

    aiSummary: analysis.summary,
    aiActionItems: analysis.actionItems,
    aiDecisions: analysis.decisions,
    aiResponsibilities: analysis.responsibilities,
  },
});

    // Automatically create tasks from AI action items
if (
  analysis.actionItems &&
  analysis.actionItems.length > 0
) {
  await prisma.task.createMany({
    data: analysis.actionItems.map((item) => ({
      title: item.task,
      owner: item.owner || null,
      deadline: item.deadline || null,
      meetingId: meeting.id,
      workspaceId,
    })),
  });
}

    return res.status(201).json({
      success: true,
      message: "Meeting analyzed successfully",

      meeting,

      analysis,
    });

  } catch (error) {
    console.error(
      "Create meeting error:",
      error
    );

    return res.status(500).json({
    success: false,
    message: "Failed to create and analyze meeting",
});
  }
};

const getMeeting = async (req, res) => {
  try {

    const userId = req.user.userId;
    const { meetingId } = req.params;

    const meeting = await prisma.meeting.findUnique({
      where: {
        id: meetingId,
      },

      include: {
        tasks: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });


    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found",
      });
    }


    // Check workspace access
    const membership =
      await prisma.workspaceMember.findUnique({
        where: {
          userId_workspaceId: {
            userId,
            workspaceId: meeting.workspaceId,
          },
        },
      });


    if (!membership) {
      return res.status(403).json({
        success: false,
        message:
          "You don't have access to this meeting",
      });
    }


    return res.status(200).json({
      success: true,
      meeting,
    });

  } catch (error) {

    console.error(
      "Get meeting error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch meeting",
    });

  }
};

const getWorkspaceMeetings = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { workspaceId } = req.params;

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

    const meetings = await prisma.meeting.findMany({
      where: {
        workspaceId,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        title: true,
        description: true,
        duration: true,
        aiSummary: true,
        aiActionItems: true,
        aiDecisions: true,
        createdAt: true,
      },
    });

    return res.status(200).json({
      success: true,
      meetings,
    });

  } catch (error) {
    console.error(
      "Get workspace meetings error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch meetings",
    });
  }
};


module.exports = {
  createMeeting,
  getMeeting,
  getWorkspaceMeetings,
};
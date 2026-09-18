const prisma = require("../config/prisma");
const {
    generateWorkspaceSummary,
} = require("../services/analytics-ai.service");

const getWorkspaceAnalytics = async (req, res) => {
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
                message:
                    "You don't have access to this workspace",
            });
        }

        // Fetch meetings
        const meetings =
            await prisma.meeting.findMany({
                where: {
                    workspaceId,
                },
                select: {
                    id: true,
                    title: true,
                    duration: true,
                    createdAt: true,
                },
                orderBy: {
                    createdAt: "desc",
                },
            });

        // Fetch tasks
        const tasks =
            await prisma.task.findMany({
                where: {
                    workspaceId,
                },
                select: {
                    id: true,
                    status: true,
                    createdAt: true,
                },
            });

        // Basic metrics
        const totalMeetings =
            meetings.length;

        const totalMeetingMinutes =
            meetings.reduce(
                (total, meeting) =>
                    total +
                    (meeting.duration || 0),
                0
            );

        const totalMeetingHours =
            totalMeetingMinutes / 60;

        const totalTasks =
            tasks.length;

        const completedTasks =
            tasks.filter(
                (task) =>
                    task.status === "COMPLETED"
            ).length;

        const pendingTasks =
            tasks.filter(
                (task) =>
                    task.status === "PENDING"
            ).length;

        const inProgressTasks =
            tasks.filter(
                (task) =>
                    task.status === "IN_PROGRESS"
            ).length;

        const completionRate =
            totalTasks === 0
                ? 0
                : Math.round(
                    (completedTasks /
                        totalTasks) *
                        100
                );

        return res.status(200).json({
            success: true,

            overview: {
                totalMeetings,
                totalMeetingHours:
                    Number(
                        totalMeetingHours.toFixed(1)
                    ),
                totalTasks,
                completedTasks,
                pendingTasks,
                inProgressTasks,
                completionRate,
            },

            meetings,
        });

    } catch (error) {

    console.error(
        "AI analytics error:",
        error
    );


    if (error.status === 429) {

        return res.status(429).json({
            success: false,
            message:
                "AI service is temporarily rate-limited. Please try again shortly.",
        });
    }


    return res.status(500).json({
        success: false,
        message:
            "Failed to generate AI workspace summary",
    });
}
};


const generateAIWorkspaceSummary = async (
    req,
    res
) => {

    try {

        const userId = req.user.userId;

        const { workspaceId } =
            req.params;


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
                message:
                    "You don't have access to this workspace",
            });

        }


        const meetings =
            await prisma.meeting.findMany({

                where: {
                    workspaceId,
                },

                select: {
                    duration: true,
                },

            });


        const tasks =
            await prisma.task.findMany({

                where: {
                    workspaceId,
                },

                select: {
                    status: true,
                },

            });


        const totalMeetings =
            meetings.length;


        const totalMeetingMinutes =
            meetings.reduce(
                (total, meeting) =>
                    total +
                    (meeting.duration || 0),
                0
            );


        const totalMeetingHours =
            Number(
                (
                    totalMeetingMinutes / 60
                ).toFixed(1)
            );


        const totalTasks =
            tasks.length;


        const completedTasks =
            tasks.filter(
                task =>
                    task.status ===
                    "COMPLETED"
            ).length;


        const inProgressTasks =
            tasks.filter(
                task =>
                    task.status ===
                    "IN_PROGRESS"
            ).length;


        const pendingTasks =
            tasks.filter(
                task =>
                    task.status ===
                    "PENDING"
            ).length;


        const completionRate =
            totalTasks === 0
                ? 0
                : Math.round(
                    (
                        completedTasks /
                        totalTasks
                    ) * 100
                );


        const summary =
            await generateWorkspaceSummary({

                totalMeetings,

                totalMeetingHours,

                totalTasks,

                completedTasks,

                inProgressTasks,

                pendingTasks,

                completionRate,

            });


        return res.status(200).json({

            success: true,

            summary,

        });


    } catch (error) {

    console.error(
        "AI analytics error:",
        error
    );

    if (error.status === 429) {
        return res.status(429).json({
            success: false,
            message:
                "AI service is temporarily rate-limited. Please try again shortly.",
        });
    }

    return res.status(500).json({
        success: false,
        message:
            "Failed to generate AI workspace summary",
    });
}

};

module.exports = {
    getWorkspaceAnalytics,
    generateAIWorkspaceSummary,
};
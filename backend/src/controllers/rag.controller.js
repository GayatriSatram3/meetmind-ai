const prisma = require("../config/prisma");

const {
    askMeetings,
} = require("../services/rag.service");


const askMeetingQuestion = async (
    req,
    res
) => {

    try {

        const userId =
            req.user.userId;

        const {
            workspaceId,
        } = req.params;

        const {
            question,
            history = [],
        } = req.body;


        if (
            !question ||
            !question.trim()
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Question is required",
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
                message:
                    "You don't have access to this workspace",
            });

        }


        // Get meetings

        const meetings =
            await prisma.meeting.findMany({

                where: {
                    workspaceId,
                    embedding: {
                        not: null,
                    },
                },

                select: {
                    id: true,
                    title: true,
                    description: true,
                    aiSummary: true,
                    aiActionItems: true,
                    aiDecisions: true,
                    embedding: true,
                },

            });


        if (meetings.length === 0) {

            return res.status(404).json({
                success: false,
                message:
                    "No meetings available",
            });

        }


        console.log(
            "🤖 Processing meeting question..."
        );


        const result =
            await askMeetings(
                question.trim(),
                meetings,
                history
            );


        return res.status(200).json({

            success: true,

            question:
                question.trim(),

            answer:
                result.answer,

            sources:
                result.sources,

        });


    } catch (error) {

        console.error(
            "RAG error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Failed to answer question",

        });

    }
};


module.exports = {
    askMeetingQuestion,
};
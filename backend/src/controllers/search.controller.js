const prisma = require("../config/prisma");
const {
    generateEmbedding,
} = require("../services/embedding.service");

const {
    cosineSimilarity,
} = require("../utils/similarity");
const searchMeetings = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { workspaceId } = req.params;
    const { q } = req.query;

    if (!q || !q.trim()) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
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

    const query = q.trim();

    const meetings = await prisma.meeting.findMany({
      where: {
        workspaceId,
        OR: [
          {
            title: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            aiSummary: {
              contains: query,
              mode: "insensitive",
            },
          },
        ],
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

      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      query,
      count: meetings.length,
      meetings,
    });

  } catch (error) {
    console.error(
      "Search meetings error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to search meetings",
    });
  }
};


const semanticSearchMeetings = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { workspaceId } = req.params;
        const { q } = req.query;

        if (!q || !q.trim()) {
            return res.status(400).json({
                success: false,
                message: "Search query is required",
            });
        }

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

        const query = q.trim();

        console.log(
            "🧠 Generating embedding for search query..."
        );

        const queryEmbedding =
            await generateEmbedding(query);

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
                    duration: true,
                    aiSummary: true,
                    aiActionItems: true,
                    aiDecisions: true,
                    embedding: true,
                    createdAt: true,
                },
            });

        const results = meetings
            .map((meeting) => {
                const similarity =
                    cosineSimilarity(
                        queryEmbedding,
                        meeting.embedding
                    );

                return {
                    ...meeting,
                    similarity,
                    embedding: undefined,
                };
            })
            .sort(
                (a, b) =>
                    b.similarity - a.similarity
            )
            .slice(0, 10);

        return res.status(200).json({
            success: true,
            query,
            count: results.length,
            results,
        });

    } catch (error) {
        console.error(
            "Semantic search error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to perform semantic search",
        });
    }
};

module.exports = {
    searchMeetings,
    semanticSearchMeetings,
};
const fs = require("fs");
const prisma = require("../config/prisma");
const { transcribeAudio } = require("../services/transcription.service");
const { analyzeMeeting } = require("../services/ai.service");
const { generateEmbedding } = require("../services/embedding.service");

const uploadAndAnalyzeAudio = async (req, res) => {
    let audioPath = null;

    try {
        const { workspaceId } = req.params;
        const { title, duration } = req.body;
        const userId = req.user.userId;

        audioPath = req.file?.path;

        // -----------------------------
        // Validate input
        // -----------------------------

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Audio file is required",
            });
        }

        if (!title || !title.trim()) {
            return res.status(400).json({
                success: false,
                message: "Meeting title is required",
            });
        }

        // -----------------------------
        // Check workspace membership
        // -----------------------------

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

        // -----------------------------
        // Transcribe audio
        // -----------------------------

        console.log("🎙️ Starting audio transcription...");

        const transcript =
            await transcribeAudio(audioPath);

        if (!transcript) {
            return res.status(400).json({
                success: false,
                message:
                    "Could not extract speech from the audio",
            });
        }

        console.log("📝 Transcript generated");

        // -----------------------------
        // Analyze transcript with AI
        // -----------------------------

        console.log("🧠 Analyzing transcript with AI...");

        const analysis =
            await analyzeMeeting(transcript);

        // -----------------------------
        // Generate embedding
        // -----------------------------

        const embeddingText = `
Title: ${title}

Transcript:
${transcript}

Summary:
${analysis.summary || ""}
`;

        const embedding =
            await generateEmbedding(embeddingText);

        // -----------------------------
        // Create meeting
        // -----------------------------

        const meeting =
            await prisma.meeting.create({
                data: {
                    title: title.trim(),

                    description: transcript,

                    duration:
                        duration !== undefined &&
                        duration !== null &&
                        duration !== ""
                            ? Number(duration)
                            : null,

                    embedding,

                    userId,
                    workspaceId,

                    aiSummary:
                        analysis.summary,

                    aiActionItems:
                        analysis.actionItems,

                    aiDecisions:
                        analysis.decisions,

                    aiResponsibilities:
                        analysis.responsibilities,
                },
            });

        // -----------------------------
        // Create tasks
        // -----------------------------

        if (
            analysis.actionItems &&
            analysis.actionItems.length > 0
        ) {
            await prisma.task.createMany({
                data:
                    analysis.actionItems.map(
                        (item) => ({
                            title: item.task,
                            owner:
                                item.owner ||
                                null,
                            deadline:
                                item.deadline ||
                                null,
                            meetingId:
                                meeting.id,
                            workspaceId,
                        })
                    ),
            });
        }

        console.log(
            "✅ Audio meeting created successfully"
        );

        return res.status(201).json({
            success: true,
            message:
                "Audio meeting analyzed successfully",

            meeting,

            transcript,

            analysis,
        });

    } catch (error) {
        console.error(
            "Audio upload error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to process audio meeting",
        });

    } finally {
        // -----------------------------
        // Delete uploaded audio
        // -----------------------------

        if (audioPath) {
            fs.unlink(
                audioPath,
                (error) => {
                    if (error) {
                        console.error(
                            "Failed to delete temporary audio:",
                            error
                        );
                    } else {
                        console.log(
                            "🗑️ Temporary audio deleted"
                        );
                    }
                }
            );
        }
    }
};

module.exports = {
    uploadAndAnalyzeAudio,
};
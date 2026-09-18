const prisma = require("../config/prisma");

// Create a new workspace
const createWorkspace = async (req, res) => {
    try {
        const { name, description } = req.body;

        // Validate workspace name
        if (!name || !name.trim()) {
            return res.status(400).json({
                success: false,
                message: "Workspace name is required"
            });
        }

        // Create workspace and add creator as OWNER
        const workspace = await prisma.workspace.create({
            data: {
                name: name.trim(),
                description: description?.trim() || null,
                members: {
                    create: {
                        userId: req.user.userId,
                        role: "OWNER"
                    }
                }
            },
            include: {
                members: true
            }
        });

        res.status(201).json({
            success: true,
            message: "Workspace created successfully",
            workspace
        });

    } catch (error) {
        console.error("Create workspace error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to create workspace"
        });
    }
};

// Get all workspaces of logged-in user
const getMyWorkspaces = async (req, res) => {
    try {
        const workspaces = await prisma.workspace.findMany({
            where: {
                members: {
                    some: {
                        userId: req.user.userId
                    }
                }
            },
            include: {
                members: true
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        res.json({
            success: true,
            workspaces
        });

    } catch (error) {
        console.error("Get workspaces error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch workspaces"
        });
    }
};

// Get single workspace details
const getWorkspaceById = async (req, res) => {
    try {
        const { workspaceId } = req.params;

        const workspace = await prisma.workspace.findUnique({
            where: {
                id: workspaceId
            },
            include: {
                members: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true
                            }
                        }
                    }
                }
            }
        });

        // Check if workspace exists
        if (!workspace) {
            return res.status(404).json({
                success: false,
                message: "Workspace not found"
            });
        }

        // Check if logged-in user belongs to this workspace
        const isMember = workspace.members.some(
            (member) => member.userId === req.user.userId
        );

        if (!isMember) {
            return res.status(403).json({
                success: false,
                message: "You don't have access to this workspace"
            });
        }

        res.status(200).json({
            success: true,
            workspace
        });

    } catch (error) {
        console.error("Get workspace error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch workspace"
        });
    }
};

module.exports = {
    createWorkspace,
    getMyWorkspaces,
    getWorkspaceById
};
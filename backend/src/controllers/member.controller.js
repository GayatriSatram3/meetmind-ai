const prisma = require("../config/prisma");


const getWorkspaceMembers = async (req, res) => {

    try {

        const userId = req.user.userId;
        const { workspaceId } = req.params;


        // Check whether current user belongs
        // to this workspace

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


        // Get workspace members

        const members =
            await prisma.workspaceMember.findMany({

                where: {
                    workspaceId,
                },

                include: {

                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },

                },

                orderBy: {
                    joinedAt: "asc",
                },

            });


        return res.status(200).json({

            success: true,

            members,

        });


    } catch (error) {

        console.error(
            "Get workspace members error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Failed to fetch workspace members",

        });

    }

};


const addWorkspaceMember = async (req, res) => {

    try {

        const currentUserId = req.user.userId;
        const { workspaceId } = req.params;
        const { email } = req.body;


        // Validate email

        if (!email || !email.trim()) {

            return res.status(400).json({
                success: false,
                message: "Email is required",
            });

        }


        // Check current user's membership

        const currentMembership =
            await prisma.workspaceMember.findUnique({

                where: {
                    userId_workspaceId: {
                        userId: currentUserId,
                        workspaceId,
                    },
                },

            });


        if (!currentMembership) {

            return res.status(403).json({
                success: false,
                message:
                    "You don't have access to this workspace",
            });

        }


        // Only OWNER and ADMIN can add members

        if (
            currentMembership.role !== "OWNER" &&
            currentMembership.role !== "ADMIN"
        ) {

            return res.status(403).json({
                success: false,
                message:
                    "Only workspace owners and admins can add members",
            });

        }


        // Find user by email

        const user =
            await prisma.user.findUnique({

                where: {
                    email: email.trim().toLowerCase(),
                },

                select: {
                    id: true,
                    name: true,
                    email: true,
                },

            });


        if (!user) {

            return res.status(404).json({
                success: false,
                message:
                    "No user found with this email",
            });

        }


        // Check whether user is already a member

        const existingMembership =
            await prisma.workspaceMember.findUnique({

                where: {
                    userId_workspaceId: {
                        userId: user.id,
                        workspaceId,
                    },
                },

            });


        if (existingMembership) {

            return res.status(409).json({
                success: false,
                message:
                    "User is already a member of this workspace",
            });

        }


        // Add member

        const membership =
            await prisma.workspaceMember.create({

                data: {
                    userId: user.id,
                    workspaceId,
                    role: "MEMBER",
                },

                include: {

                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },

                },

            });


        return res.status(201).json({

            success: true,

            message:
                "Member added successfully",

            member: membership,

        });


    } catch (error) {

        console.error(
            "Add workspace member error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Failed to add workspace member",

        });

    }

};


const updateMemberRole = async (req, res) => {

    try {

        const currentUserId = req.user.userId;

        const { workspaceId } = req.params;

        const { memberId, role } = req.body;


        // Validate role

        const validRoles = [
            "OWNER",
            "ADMIN",
            "MEMBER",
        ];


        if (!memberId || !role) {

            return res.status(400).json({
                success: false,
                message:
                    "Member ID and role are required",
            });

        }


        if (!validRoles.includes(role)) {

            return res.status(400).json({
                success: false,
                message:
                    "Invalid workspace role",
            });

        }


        // Check current user's membership

        const currentMembership =
            await prisma.workspaceMember.findUnique({

                where: {
                    userId_workspaceId: {
                        userId: currentUserId,
                        workspaceId,
                    },
                },

            });


        if (!currentMembership) {

            return res.status(403).json({
                success: false,
                message:
                    "You don't have access to this workspace",
            });

        }


        // Only OWNER and ADMIN can change roles

        if (
            currentMembership.role !== "OWNER" &&
            currentMembership.role !== "ADMIN"
        ) {

            return res.status(403).json({
                success: false,
                message:
                    "Only workspace owners and admins can change member roles",
            });

        }


        // Find the member

        const member =
            await prisma.workspaceMember.findFirst({

                where: {
                    id: memberId,
                    workspaceId,
                },

            });


        if (!member) {

            return res.status(404).json({
                success: false,
                message:
                    "Workspace member not found",
            });

        }


        // Prevent an ADMIN from changing
        // another member to OWNER

        if (
            role === "OWNER" &&
            currentMembership.role !== "OWNER"
        ) {

            return res.status(403).json({
                success: false,
                message:
                    "Only an owner can assign the OWNER role",
            });

        }


        // Update role

        const updatedMember =
            await prisma.workspaceMember.update({

                where: {
                    id: memberId,
                },

                data: {
                    role,
                },

                include: {

                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },

                },

            });


        return res.status(200).json({

            success: true,

            message:
                "Member role updated successfully",

            member: updatedMember,

        });


    } catch (error) {

        console.error(
            "Update member role error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Failed to update member role",

        });

    }

};


const removeWorkspaceMember = async (req, res) => {
    try {
        const currentUserId = req.user.userId;
        const { workspaceId, memberId } = req.params;

        // Check current user's membership
        const currentMembership =
            await prisma.workspaceMember.findUnique({
                where: {
                    userId_workspaceId: {
                        userId: currentUserId,
                        workspaceId,
                    },
                },
            });

        if (!currentMembership) {
            return res.status(403).json({
                success: false,
                message:
                    "You don't have access to this workspace",
            });
        }

        // Only OWNER and ADMIN can remove members
        if (
            currentMembership.role !== "OWNER" &&
            currentMembership.role !== "ADMIN"
        ) {
            return res.status(403).json({
                success: false,
                message:
                    "Only workspace owners and admins can remove members",
            });
        }

        // Find the member
        const member =
            await prisma.workspaceMember.findFirst({
                where: {
                    id: memberId,
                    workspaceId,
                },
            });

        if (!member) {
            return res.status(404).json({
                success: false,
                message:
                    "Workspace member not found",
            });
        }

        // Prevent removing yourself
        if (member.userId === currentUserId) {
            return res.status(400).json({
                success: false,
                message:
                    "You cannot remove yourself from the workspace",
            });
        }

        // Admin cannot remove an OWNER
        if (
            member.role === "OWNER" &&
            currentMembership.role !== "OWNER"
        ) {
            return res.status(403).json({
                success: false,
                message:
                    "Only an owner can remove another owner",
            });
        }

        await prisma.workspaceMember.delete({
            where: {
                id: memberId,
            },
        });

        return res.status(200).json({
            success: true,
            message:
                "Member removed successfully",
        });

    } catch (error) {
        console.error(
            "Remove member error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to remove member",
        });
    }
};


module.exports = {
    getWorkspaceMembers,
    addWorkspaceMember,
    updateMemberRole,
    removeWorkspaceMember,
};
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const prisma = require("../config/prisma");

// Register a new user
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Basic validation
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message:
                    "Name, email and password are required"
            });
        }

        // Validate name
        if (!name.trim()) {
            return res.status(400).json({
                success: false,
                message: "Name cannot be empty"
            });
        }

        // Validate password
        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message:
                    "Password must be at least 8 characters"
            });
        }

        // Normalize email
        const normalizedEmail =
            email.trim().toLowerCase();

        // Check if user already exists
        const existingUser =
            await prisma.user.findUnique({
                where: {
                    email: normalizedEmail
                }
            });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists"
            });
        }

        // Hash password
        const hashedPassword =
            await bcrypt.hash(password, 10);

        // Create user
        const user =
            await prisma.user.create({
                data: {
                    name: name.trim(),
                    email: normalizedEmail,
                    password: hashedPassword
                }
            });

        return res.status(201).json({
            success: true,
            message:
                "User registered successfully",
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error(
            "Registration error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// Login user
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Basic validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message:
                    "Email and password are required"
            });
        }

        // Normalize email
        const normalizedEmail =
            email.trim().toLowerCase();

        // Find user
        const user =
            await prisma.user.findUnique({
                where: {
                    email: normalizedEmail
                }
            });

        if (!user) {
            return res.status(401).json({
                success: false,
                message:
                    "Invalid email or password"
            });
        }

        // Compare password
        const isPasswordValid =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message:
                    "Invalid email or password"
            });
        }

        // Generate JWT
        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error(
            "Login error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


module.exports = {
    register,
    login
};
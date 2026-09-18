const jwt = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {
    try {
        const authHeader =
            req.headers.authorization;

        // Check if Authorization header exists
        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "Access token is required"
            });
        }

        // Expected format: Bearer TOKEN
        if (!authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Invalid token format"
            });
        }

        const token =
            authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Invalid token format"
            });
        }

        // Verify token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Store authenticated user
        req.user = decoded;

        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
};

module.exports = authenticateUser;
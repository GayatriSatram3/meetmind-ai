const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Temporary upload directory
const uploadDir = path.join(
    __dirname,
    "../../uploads"
);

// Create directory if it doesn't exist
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, {
        recursive: true,
    });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },

    filename: (req, file, cb) => {
        const uniqueName =
            `${Date.now()}-${Math.round(
                Math.random() * 1e9
            )}${path.extname(file.originalname)}`;

        cb(null, uniqueName);
    },
});

// Allowed audio formats
const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        "audio/mpeg",
        "audio/wav",
        "audio/x-wav",
        "audio/mp4",
        "audio/x-m4a",
        "audio/webm",
        "audio/ogg",
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(
            new Error(
                "Only audio files are allowed"
            ),
            false
        );
    }
};

const uploadAudio = multer({
    storage,
    fileFilter,

    limits: {
        fileSize: 50 * 1024 * 1024, // 50 MB
    },
});

module.exports = uploadAudio;
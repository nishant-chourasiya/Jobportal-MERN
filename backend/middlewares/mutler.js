import multer from "multer";

const storage = multer.memoryStorage();
export const singleUpload = multer({storage}).single("file");

// Multer error handler middleware
export const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                message: "File size too large. Max 5MB allowed.",
                success: false
            });
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({
                message: "Only one file allowed.",
                success: false
            });
        }
    }
    if (err) {
        return res.status(400).json({
            message: "File upload error: " + err.message,
            success: false
        });
    }
    next();
};
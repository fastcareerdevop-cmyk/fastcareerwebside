"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
// Use memory storage so req.file.buffer is always available for parsing and streaming
const storage = multer_1.default.memoryStorage();
function checkFileType(file, cb) {
    const ext = path_1.default.extname(file.originalname || '').toLowerCase();
    const allowedExts = /\.(pdf|doc|docx|mp4|mov|mkv|webm|avi|mp3|wav|m4a|png|jpg|jpeg|webp)$/i;
    const isExtValid = allowedExts.test(ext);
    const mime = file.mimetype || '';
    const isMimeValid = /(pdf|msword|word|document|video|audio|image)/i.test(mime);
    if (isExtValid && (!mime || isMimeValid || mime === 'application/octet-stream')) {
        return cb(null, true);
    }
    return cb(new Error('Unsupported file type. Only PDF, DOC, DOCX, images, audio, and video files are allowed.'));
}
const upload = (0, multer_1.default)({
    storage,
    limits: {
        fileSize: 50 * 1024 * 1024, // 50MB max file size
    },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
});
exports.default = upload;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const industrialTrainingController_1 = require("../controllers/industrialTrainingController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const rateLimitMiddleware_1 = require("../middleware/rateLimitMiddleware");
const router = express_1.default.Router();
// Public routes for candidate registration & verification
router.post('/', industrialTrainingController_1.submitIndustrialTraining);
router.post('/send-otp', rateLimitMiddleware_1.otpRateLimiter, industrialTrainingController_1.sendVerificationOTP);
router.post('/verify-otp', rateLimitMiddleware_1.otpRateLimiter, industrialTrainingController_1.verifyOTP);
// Admin queries and exports
router.get('/', authMiddleware_1.protect, authMiddleware_1.adminOrEmployee, industrialTrainingController_1.getIndustrialTrainingApplications);
router.get('/export', authMiddleware_1.protect, authMiddleware_1.adminOrEmployee, industrialTrainingController_1.exportIndustrialTrainingExcel);
router.delete('/:id', authMiddleware_1.protect, authMiddleware_1.admin, industrialTrainingController_1.deleteIndustrialTrainingApplication);
exports.default = router;

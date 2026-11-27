import express from 'express';
import {
  submitIndustrialTraining,
  sendVerificationOTP,
  verifyOTP,
  getIndustrialTrainingApplications,
  exportIndustrialTrainingExcel,
  deleteIndustrialTrainingApplication
} from '../controllers/industrialTrainingController';

import { protect, admin, adminOrEmployee } from '../middleware/authMiddleware';
import { otpRateLimiter } from '../middleware/rateLimitMiddleware';

const router = express.Router();

// Public routes for candidate registration & verification
router.post('/', submitIndustrialTraining);
router.post('/send-otp', otpRateLimiter, sendVerificationOTP);
router.post('/verify-otp', otpRateLimiter, verifyOTP);

// Admin queries and exports
router.get('/', protect, adminOrEmployee, getIndustrialTrainingApplications);
router.get('/export', protect, adminOrEmployee, exportIndustrialTrainingExcel);
router.delete('/:id', protect, admin, deleteIndustrialTrainingApplication);

export default router;

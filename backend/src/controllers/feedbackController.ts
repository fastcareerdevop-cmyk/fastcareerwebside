import { Request, Response } from 'express';
import mongoose from 'mongoose';
import prisma from '../config/prisma';
import Feedback from '../models/Feedback';

export const submitFeedback = async (req: Request, res: Response) => {
  try {
    const { rating, message } = req.body;
    const userId = (req as any).user?.id || (req as any).user?._id?.toString();

    if (prisma) {
      try {
        const fb = await prisma.feedback.create({
          data: {
            rating: Number(rating) || 5,
            message: message || '',
            submittedById: userId || null
          }
        });
        return res.status(201).json({ ...fb, _id: fb.id });
      } catch (e) {
        console.warn('Prisma submitFeedback warning:', e);
      }
    }

    if (mongoose.connection.readyState === 1) {
      const feedback = new Feedback({
        rating,
        message,
        submittedBy: (req as any).user?._id
      });
      const savedFeedback = await feedback.save();
      return res.status(201).json(savedFeedback);
    }

    res.status(503).json({ message: 'Service unavailable' });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

export const getFeedbacks = async (req: Request, res: Response) => {
  try {
    if (prisma) {
      try {
        const feedbacks = await prisma.feedback.findMany({
          orderBy: { createdAt: 'desc' },
          include: {
            submittedBy: {
              select: { id: true, firstName: true, lastName: true, email: true }
            }
          }
        });
        return res.json(feedbacks.map(f => ({
          ...f,
          _id: f.id,
          submittedBy: f.submittedBy ? { ...f.submittedBy, _id: f.submittedBy.id } : null
        })));
      } catch (e) {
        console.warn('Prisma getFeedbacks warning:', e);
      }
    }

    if (mongoose.connection.readyState === 1) {
      const feedbacks = await Feedback.find().populate('submittedBy', 'firstName lastName email').sort({ createdAt: -1 });
      return res.json(feedbacks);
    }

    res.json([]);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

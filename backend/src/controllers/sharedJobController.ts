import { Request, Response } from 'express';
import mongoose from 'mongoose';
import prisma from '../config/prisma';
import SharedJob from '../models/SharedJob';

// @desc    Share a new job opportunity
// @route   POST /api/shared-jobs
// @access  Public (or Private if we want to enforce login)
export const createSharedJob = async (req: Request, res: Response) => {
  try {
    const {
      industry,
      companyName,
      jobDescription,
      location,
      region,
      noOfPost,
      concernedPerson,
      mobileNo,
      emailId
    } = req.body;

    const userId = (req as any).user?.id || (req as any).user?._id?.toString() || null;

    if (prisma) {
      try {
        const sharedJob = await prisma.sharedJob.create({
          data: {
            industry: industry || '',
            companyName: companyName || '',
            jobDescription: jobDescription || '',
            location: location || '',
            region: region || '',
            noOfPost: noOfPost || '',
            concernedPerson: concernedPerson || '',
            mobileNo: mobileNo || '',
            emailId: emailId || '',
            submittedById: userId
          }
        });
        return res.status(201).json({ ...sharedJob, _id: sharedJob.id });
      } catch (e) {
        console.warn('Prisma createSharedJob warning:', e);
      }
    }

    if (mongoose.connection.readyState === 1) {
      const sharedJob = await SharedJob.create({
        industry,
        companyName,
        jobDescription,
        location,
        region,
        noOfPost,
        concernedPerson,
        mobileNo,
        emailId,
        // @ts-ignore
        submittedBy: req.user?._id || null
      });

      return res.status(201).json(sharedJob);
    }

    res.status(503).json({ message: 'Service unavailable' });
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Error creating shared job' });
  }
};

// @desc    Get all shared jobs
// @route   GET /api/shared-jobs
// @access  Private/Admin
export const getSharedJobs = async (req: Request, res: Response) => {
  try {
    if (prisma) {
      try {
        const sharedJobs = await prisma.sharedJob.findMany({
          orderBy: { createdAt: 'desc' },
          include: {
            submittedBy: {
              select: { id: true, firstName: true, lastName: true, email: true }
            }
          }
        });
        return res.json(sharedJobs.map(sj => ({
          ...sj,
          _id: sj.id,
          submittedBy: sj.submittedBy ? { ...sj.submittedBy, _id: sj.submittedBy.id } : null
        })));
      } catch (e) {
        console.warn('Prisma getSharedJobs warning:', e);
      }
    }

    if (mongoose.connection.readyState === 1) {
      const sharedJobs = await SharedJob.find({}).populate('submittedBy', 'firstName lastName email').sort({ createdAt: -1 });
      return res.json(sharedJobs);
    }

    res.json([]);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

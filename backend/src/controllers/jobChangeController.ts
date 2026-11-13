import { Request, Response } from 'express';
import mongoose from 'mongoose';
import prisma from '../config/prisma';
import JobChangeRequest from '../models/JobChangeRequest';

export const submitJobChange = async (req: Request, res: Response) => {
  try {
    const { currentCompany, currentDesignation, currentCTC, expectedCTC, noticePeriod, reason } = req.body;
    const userId = (req as any).user?.id || (req as any).user?._id?.toString();

    if (prisma) {
      try {
        const jc = await prisma.jobChangeRequest.create({
          data: {
            currentCompany: currentCompany || '',
            currentDesignation: currentDesignation || '',
            currentCTC: currentCTC || '',
            expectedCTC: expectedCTC || '',
            noticePeriod: noticePeriod || '',
            reason: reason || '',
            requestedById: userId || null
          }
        });
        return res.status(201).json({ ...jc, _id: jc.id });
      } catch (e) {
        console.warn('Prisma submitJobChange warning:', e);
      }
    }

    if (mongoose.connection.readyState === 1) {
      const jobChange = new JobChangeRequest({
        currentCompany,
        currentDesignation,
        currentCTC,
        expectedCTC,
        noticePeriod,
        reason,
        requestedBy: (req as any).user?._id
      });

      const savedRequest = await jobChange.save();
      return res.status(201).json(savedRequest);
    }

    res.status(503).json({ message: 'Service unavailable' });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

export const getJobChangeRequests = async (req: Request, res: Response) => {
  try {
    if (prisma) {
      try {
        const requests = await prisma.jobChangeRequest.findMany({
          orderBy: { createdAt: 'desc' },
          include: {
            requestedBy: {
              select: { id: true, firstName: true, lastName: true, email: true }
            }
          }
        });
        return res.json(requests.map(r => ({
          ...r,
          _id: r.id,
          requestedBy: r.requestedBy ? { ...r.requestedBy, _id: r.requestedBy.id } : null
        })));
      } catch (e) {
        console.warn('Prisma getJobChangeRequests warning:', e);
      }
    }

    if (mongoose.connection.readyState === 1) {
      const requests = await JobChangeRequest.find().populate('requestedBy', 'firstName lastName email').sort({ createdAt: -1 });
      return res.json(requests);
    }

    res.json([]);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

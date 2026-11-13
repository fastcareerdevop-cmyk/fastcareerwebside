import { Request, Response } from 'express';
import mongoose from 'mongoose';
import prisma from '../config/prisma';
import Referral from '../models/Referral';

export const submitReferral = async (req: Request, res: Response) => {
  try {
    const { friendName, friendEmail, friendPhone } = req.body;
    let resumeUrl = '';

    if (req.file) {
      resumeUrl = req.file.path.startsWith('http') 
        ? req.file.path 
        : `/uploads/${req.file.filename}`;
    }
    
    const userId = (req as any).user?.id || (req as any).user?._id?.toString();

    if (prisma) {
      try {
        const ref = await prisma.referral.create({
          data: {
            friendName: friendName || '',
            friendEmail: (friendEmail || '').toLowerCase().trim(),
            friendPhone: friendPhone || '',
            resumeUrl: resumeUrl || '',
            referredById: userId || null
          }
        });
        return res.status(201).json({ ...ref, _id: ref.id });
      } catch (e) {
        console.warn('Prisma submitReferral warning:', e);
      }
    }

    if (mongoose.connection.readyState === 1) {
      const referral = new Referral({
        friendName,
        friendEmail,
        friendPhone,
        resumeUrl,
        referredBy: (req as any).user?._id
      });
      const savedReferral = await referral.save();
      return res.status(201).json(savedReferral);
    }

    res.status(503).json({ message: 'Service unavailable' });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

export const getReferrals = async (req: Request, res: Response) => {
  try {
    if (prisma) {
      try {
        const refs = await prisma.referral.findMany({
          orderBy: { createdAt: 'desc' },
          include: {
            referredBy: {
              select: { id: true, firstName: true, lastName: true, email: true }
            }
          }
        });
        return res.json(refs.map(r => ({
          ...r,
          _id: r.id,
          referredBy: r.referredBy ? { ...r.referredBy, _id: r.referredBy.id } : null
        })));
      } catch (e) {
        console.warn('Prisma getReferrals warning:', e);
      }
    }

    if (mongoose.connection.readyState === 1) {
      const referrals = await Referral.find().populate('referredBy', 'firstName lastName email').sort({ createdAt: -1 });
      return res.json(referrals);
    }

    res.json([]);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

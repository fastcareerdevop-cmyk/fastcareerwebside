import { Request, Response } from 'express';
import mongoose from 'mongoose';
import prisma from '../config/prisma';
import Job from '../models/Job';
import User from '../models/User';
import Application from '../models/Application';
import { calculateMatchScore } from '../utils/matchAlgorithm';
import { isValidCity } from '../utils/locationHelper';

// Helper to format Prisma job to match Mongoose API contract
const formatPgJob = (j: any) => ({
  ...j,
  _id: j.id,
  targetEmployers: (j.targetEmployers || []).map((te: any) => ({
    ...te,
    _id: te.id
  }))
});

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
export const getJobs = async (req: Request, res: Response) => {
  try {
    if (prisma) {
      try {
        const jobs = await prisma.job.findMany({
          orderBy: { createdAt: 'desc' },
          include: {
            targetEmployers: {
              select: { id: true, companyName: true, firstName: true, lastName: true, email: true }
            }
          }
        });
        if (jobs) {
          return res.json(jobs.map(formatPgJob));
        }
      } catch (e) {
        console.warn('Prisma getJobs warning:', e);
      }
    }

    if (mongoose.connection.readyState === 1) {
      const jobs = await Job.find({}).sort({ createdAt: -1 });
      return res.json(jobs);
    }

    return res.json([]);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get logged in employer's jobs (or all jobs for admin)
// @route   GET /api/jobs/employer
// @access  Private/Employer/Admin
export const getEmployerJobs = async (req: any, res: Response) => {
  try {
    const user = req.user;
    const userId = user?.id || user?._id?.toString();

    if (prisma && userId) {
      try {
        const whereClause: any = {};
        if (user?.role !== 'admin') {
          whereClause.OR = [
            { postedById: userId },
            { targetEmployers: { some: { id: userId } } },
            { sharedHrEmails: { has: user?.email } }
          ];
        }

        const jobs = await prisma.job.findMany({
          where: whereClause,
          orderBy: { createdAt: 'desc' },
          include: {
            targetEmployers: {
              select: { id: true, companyName: true, firstName: true, lastName: true, email: true }
            }
          }
        });
        return res.json(jobs.map(formatPgJob));
      } catch (e) {
        console.warn('Prisma getEmployerJobs warning:', e);
      }
    }

    if (mongoose.connection.readyState === 1) {
      let query: any = {};
      if (user?.role === 'admin') {
        query = {};
      } else {
        query = {
          $or: [
            { postedBy: user._id },
            { targetEmployers: user._id },
            { sharedHrEmails: user.email }
          ]
        };
      }

      const jobs = await Job.find(query)
        .populate('targetEmployers', 'companyName firstName lastName email')
        .sort({ createdAt: -1 });
      return res.json(jobs);
    }

    return res.json([]);
  } catch (error) {
    console.error('Error fetching employer jobs:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
export const getJobById = async (req: Request, res: Response) => {
  try {
    const jobId = String(req.params.id || '');

    if (prisma && jobId) {
      try {
        const job = await prisma.job.findUnique({
          where: { id: jobId },
          include: {
            targetEmployers: {
              select: { id: true, companyName: true, firstName: true, lastName: true, email: true }
            }
          }
        });
        if (job) {
          return res.json(formatPgJob(job));
        }
      } catch (e) {
        console.warn('Prisma getJobById warning:', e);
      }
    }

    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(jobId)) {
      const job = await Job.findById(jobId).populate('targetEmployers', 'companyName firstName lastName email');
      if (job) return res.json(job);
    }

    res.status(404).json({ message: 'Job not found' });
  } catch (error) {
    console.error('Error fetching job by id:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a job
// @route   POST /api/jobs
// @access  Private/Employer
export const createJob = async (req: any, res: Response) => {
  try {
    const { title, company, location, type, category, salaryRange, description, requirements, responsibilities, targetEmployers, sharedHrEmails, isHot, shareShortlistedCandidates } = req.body;
    
    if (!title || !title.trim()) {
      res.status(400).json({ message: 'Job title is required.' });
      return;
    }
    if (!company || !company.trim()) {
      res.status(400).json({ message: 'Company name is required.' });
      return;
    }

    const safeDesc = (description && description.trim())
      ? description.trim()
      : `${title.trim()} opening at ${company.trim()}${location ? ` in ${location.trim()}` : ''}. Type: ${type || 'Full-time'}. Category: ${category || 'Finance'}. Salary/Stipend: ${salaryRange || 'Competitive'}.`;

    const safeReq = (Array.isArray(requirements) && requirements.length > 0)
      ? requirements
      : (typeof requirements === 'string' && requirements.trim() ? requirements.split('\n').filter(Boolean) : [`Relevant experience in ${category || 'Finance'}`]);

    const safeResp = (Array.isArray(responsibilities) && responsibilities.length > 0)
      ? responsibilities
      : (typeof responsibilities === 'string' && responsibilities.trim() ? responsibilities.split('\n').filter(Boolean) : [`Core responsibilities as ${title.trim()}`]);

    const resolvedTargetEmployers: string[] = Array.isArray(targetEmployers) ? [...targetEmployers] : [];
    const hrEmails: string[] = Array.isArray(sharedHrEmails) ? sharedHrEmails : [];

    const postedById = req.user?.id || req.user?._id?.toString() || null;

    if (prisma) {
      try {
        const createdPgJob = await prisma.job.create({
          data: {
            title: title.trim(),
            company: company.trim(),
            location: (location || 'Pan India').trim(),
            type: type || 'Full-time',
            category: category || 'Auditing',
            salaryRange: salaryRange || 'Not Disclosed',
            description: safeDesc,
            requirements: safeReq,
            responsibilities: safeResp,
            isHot: isHot === true || isHot === 'true',
            postedById: postedById,
            sharedHrEmails: hrEmails,
            shareShortlistedCandidates: shareShortlistedCandidates !== false,
            ...(resolvedTargetEmployers.length > 0 ? {
              targetEmployers: {
                connect: resolvedTargetEmployers.map(id => ({ id }))
              }
            } : {})
          },
          include: {
            targetEmployers: {
              select: { id: true, companyName: true, firstName: true, lastName: true, email: true }
            }
          }
        });

        return res.status(201).json(formatPgJob(createdPgJob));
      } catch (e) {
        console.warn('Prisma createJob warning:', e);
        if (mongoose.connection.readyState !== 1) {
          throw e;
        }
      }
    }

    if (mongoose.connection.readyState === 1) {
      const job = new Job({
        ...req.body,
        title: title.trim(),
        company: company.trim(),
        location: (location || 'Pan India').trim(),
        type: type || 'Full-time',
        category: category || 'Auditing',
        salaryRange: salaryRange || 'Not Disclosed',
        description: safeDesc,
        requirements: safeReq,
        responsibilities: safeResp,
        targetEmployers: resolvedTargetEmployers,
        sharedHrEmails: hrEmails,
        shareShortlistedCandidates: shareShortlistedCandidates !== false,
        postedBy: req.user?._id 
      });

      const createdJob = await job.save();
      const populatedJob = await Job.findById(createdJob._id).populate('targetEmployers', 'companyName firstName lastName email');
      return res.status(201).json(populatedJob || createdJob);
    }

    res.status(503).json({ message: 'Database service unavailable' });
  } catch (error: any) {
    console.error('Error creating job:', error);
    res.status(400).json({ message: error.message || 'Invalid job data' });
  }
};

// @desc    Update a job
// @route   PUT /api/jobs/:id
// @access  Private/Employer/Admin
export const updateJob = async (req: any, res: Response) => {
  try {
    const jobId = String(req.params.id || '');
    const { location, targetEmployers, sharedHrEmails, shareShortlistedCandidates } = req.body;
    
    if (location && !isValidCity(location)) {
      res.status(400).json({ message: 'Invalid location. Please select a valid city from the list.' });
      return;
    }

    const resolvedTargetEmployers: string[] = Array.isArray(targetEmployers) ? [...targetEmployers] : [];
    const hrEmails: string[] = Array.isArray(sharedHrEmails) ? sharedHrEmails : [];

    if (prisma && jobId) {
      try {
        const updateData: any = {};
        if (req.body.title) updateData.title = req.body.title.trim();
        if (req.body.company) updateData.company = req.body.company.trim();
        if (location) updateData.location = location.trim();
        if (req.body.type) updateData.type = req.body.type;
        if (req.body.category) updateData.category = req.body.category;
        if (req.body.salaryRange) updateData.salaryRange = req.body.salaryRange;
        if (req.body.description) updateData.description = req.body.description;
        if (req.body.requirements) updateData.requirements = req.body.requirements;
        if (req.body.responsibilities) updateData.responsibilities = req.body.responsibilities;
        if (req.body.isHot !== undefined) updateData.isHot = req.body.isHot === true || req.body.isHot === 'true';
        if (sharedHrEmails !== undefined) updateData.sharedHrEmails = hrEmails;
        if (shareShortlistedCandidates !== undefined) updateData.shareShortlistedCandidates = shareShortlistedCandidates !== false;

        if (targetEmployers !== undefined) {
          updateData.targetEmployers = {
            set: resolvedTargetEmployers.map(id => ({ id }))
          };
        }

        const updatedPgJob = await prisma.job.update({
          where: { id: jobId },
          data: updateData,
          include: {
            targetEmployers: {
              select: { id: true, companyName: true, firstName: true, lastName: true, email: true }
            }
          }
        });

        return res.json(formatPgJob(updatedPgJob));
      } catch (e: any) {
        console.warn('Prisma updateJob warning:', e);
        if (mongoose.connection.readyState !== 1) {
          return res.status(404).json({ message: 'Job not found or could not be updated' });
        }
      }
    }

    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(jobId)) {
      const updatedJob = await Job.findByIdAndUpdate(
        jobId,
        {
          ...req.body,
          targetEmployers: resolvedTargetEmployers,
          sharedHrEmails: hrEmails,
          shareShortlistedCandidates: shareShortlistedCandidates !== false,
        },
        { new: true }
      ).populate('targetEmployers', 'companyName firstName lastName email');

      if (!updatedJob) {
        res.status(404).json({ message: 'Job not found' });
        return;
      }
      return res.json(updatedJob);
    }

    res.status(404).json({ message: 'Job not found' });
  } catch (error) {
    console.error('Error updating job:', error);
    res.status(400).json({ message: 'Error updating job' });
  }
};

// @desc    Delete a job and its applications
// @route   DELETE /api/jobs/:id
// @access  Private/Employer/Admin
export const deleteJob = async (req: any, res: Response) => {
  try {
    const jobId = String(req.params.id || '');

    if (prisma && jobId) {
      try {
        await prisma.application.deleteMany({ where: { jobId } });
        await prisma.job.delete({ where: { id: jobId } });
        return res.json({ message: 'Job and associated applications removed successfully' });
      } catch (e) {
        console.warn('Prisma deleteJob warning:', e);
        if (mongoose.connection.readyState !== 1) {
          return res.status(404).json({ message: 'Job not found' });
        }
      }
    }

    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(jobId)) {
      await Application.deleteMany({ job: jobId });
      await Job.findByIdAndDelete(jobId);
      return res.json({ message: 'Job and associated applications removed successfully' });
    }

    res.status(404).json({ message: 'Job not found' });
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Cleanup junk / test jobs
// @route   POST /api/jobs/cleanup-test-jobs
// @access  Private/Employer/Admin
export const cleanupTestJobs = async (req: Request, res: Response) => {
  try {
    const junkRegex = /^(fdg|new|nj|test|demo|asdf|xyz)$/i;
    if (prisma) {
      try {
        await prisma.job.deleteMany({
          where: {
            OR: [
              { title: { in: ['fdg', 'new', 'nj', 'test', 'demo', 'asdf', 'xyz'] } },
              { company: { in: ['fdg', 'new', 'nj', 'test', 'demo', 'asdf', 'xyz'] } }
            ]
          }
        });
      } catch (e) {}
    }
    if (mongoose.connection.readyState === 1) {
      const junkJobs = await Job.find({
        $or: [
          { title: { $regex: junkRegex } },
          { company: { $regex: junkRegex } }
        ]
      });
      const junkIds = junkJobs.map(j => j._id);
      if (junkIds.length > 0) {
        await Application.deleteMany({ job: { $in: junkIds } });
        await Job.deleteMany({ _id: { $in: junkIds } });
      }
    }
    res.json({ message: 'Cleanup successful' });
  } catch (error) {
    res.status(500).json({ message: 'Server error during cleanup', error });
  }
};

// @desc    Calculate match score for a job and candidate
// @route   GET /api/jobs/:id/match/:userId
// @access  Private
export const getJobMatchScore = async (req: Request, res: Response) => {
  try {
    const jobId = String(req.params.id || '');
    const userId = String(req.params.userId || '');

    let jobObj: any = null;
    let userObj: any = null;

    if (prisma) {
      try {
        jobObj = await prisma.job.findUnique({ where: { id: jobId } });
        userObj = await prisma.user.findUnique({ where: { id: userId } });
      } catch (e) {}
    }

    if (!jobObj && mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(jobId)) {
      jobObj = await Job.findById(jobId);
    }
    if (!userObj && mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(userId)) {
      userObj = await User.findById(userId);
    }

    if (!jobObj || !userObj) {
      res.status(404).json({ message: 'Job or User not found' });
      return;
    }

    const matchScore = calculateMatchScore(userObj, jobObj);
    res.json({ matchScore });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

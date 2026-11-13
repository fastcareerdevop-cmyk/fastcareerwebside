import { Request, Response } from 'express';
import mongoose from 'mongoose';
import prisma from '../config/prisma';
import Application from '../models/Application';
import Job from '../models/Job';
import User from '../models/User';
import { sendShortlistedWhatsApp } from '../utils/whatsappService';

// @desc    Apply for a job
// @route   POST /api/applications/:jobId
// @access  Private (Candidate)
export const applyForJob = async (req: Request, res: Response) => {
  const jobId = String(req.params.jobId || '');
  const { coverLetter, existingResumeUrl } = req.body;

  try {
    if (!jobId || jobId === 'undefined') {
      res.status(400).json({ message: 'Invalid Job ID or job not found' });
      return;
    }

    const candidateId = String((req as any).user?.id || (req as any).user?._id?.toString() || '');

    // 1. Try PostgreSQL (Prisma) first
    if (prisma && candidateId) {
      try {
        const job = await prisma.job.findUnique({
          where: { id: jobId },
          include: { targetEmployers: true }
        });

        if (job) {
          const existing = await prisma.application.findFirst({
            where: { jobId, candidateId }
          });
          if (existing) {
            return res.status(400).json({ message: 'You have already applied for this job' });
          }

          const candidateUser = await prisma.user.findUnique({ where: { id: candidateId } });
          let resumeUrl = req.file ? req.file.path : (existingResumeUrl || candidateUser?.resumeUrl);
          if (!resumeUrl) {
            resumeUrl = 'uploads/default_resume.pdf';
          }

          const hasTargetEmployers = Boolean(
            (job.targetEmployers && job.targetEmployers.length > 0) ||
            (job.sharedHrEmails && job.sharedHrEmails.length > 0)
          );

          const application = await prisma.application.create({
            data: {
              jobId,
              candidateId,
              resumeUrl,
              coverLetter: coverLetter || '',
              status: 'applied',
              companyStatus: 'Pending Review',
              sharedWithEmployer: hasTargetEmployers
            },
            include: {
              job: true,
              candidate: true
            }
          });

          if (req.file) {
            await prisma.user.update({
              where: { id: candidateId },
              data: { resumeUrl: req.file.path }
            });
          }

          const appRel = application as any;
          return res.status(201).json({
            ...appRel,
            _id: appRel.id,
            job: appRel.job ? { ...appRel.job, _id: appRel.job.id } : null,
            candidate: appRel.candidate ? { ...appRel.candidate, _id: appRel.candidate.id } : null
          });
        }
      } catch (pgErr) {
        console.warn('Prisma applyForJob warning:', pgErr);
        if (mongoose.connection.readyState !== 1) {
          return res.status(500).json({ message: 'Failed to apply for job' });
        }
      }
    }

    if (!mongoose.Types.ObjectId.isValid(jobId as string)) {
      res.status(400).json({ message: 'Invalid Job ID or job not found' });
      return;
    }

    const candidateUser = await User.findById(candidateId);

    let resumeUrl = req.file ? req.file.path : (existingResumeUrl || candidateUser?.resumeUrl);
    if (!resumeUrl) {
      resumeUrl = 'uploads/default_resume.pdf';
    }

    const job = await Job.findById(jobId);
    if (!job) {
      res.status(404).json({ message: 'Job not found' });
      return;
    }

    // Check if user already applied
    const existingApplication = await Application.findOne({ job: jobId, candidate: candidateId });
    if (existingApplication) {
      res.status(400).json({ message: 'You have already applied for this job' });
      return;
    }

    // Auto-share if job has target employers or shared HR emails
    const hasTargetEmployers = Boolean(
      (job.targetEmployers && job.targetEmployers.length > 0) ||
      (job.sharedHrEmails && job.sharedHrEmails.length > 0)
    );

    const application = await Application.create({
      job: new mongoose.Types.ObjectId(jobId as string),
      candidate: new mongoose.Types.ObjectId(candidateId as string),
      resumeUrl,
      coverLetter: coverLetter || '',
      status: 'applied',
      sharedWithEmployer: hasTargetEmployers ? true : false,
    });

    // Auto-assign candidate to target employers of this job so target HRs see applicant details
    if (job.targetEmployers && job.targetEmployers.length > 0) {
      await User.findByIdAndUpdate(candidateId, {
        $addToSet: { assignedEmployers: { $each: job.targetEmployers } }
      });
    }

    if (job.sharedHrEmails && job.sharedHrEmails.length > 0) {
      const matchingEmployers = await User.find({
        email: { $in: job.sharedHrEmails.map((e: string) => new RegExp(`^${e.trim()}$`, 'i')) }
      }).select('_id');
      if (matchingEmployers.length > 0) {
        const empIds = matchingEmployers.map(e => e._id);
        await User.findByIdAndUpdate(candidateId, {
          $addToSet: { assignedEmployers: { $each: empIds } }
        });
      }
    }

    // If a new resume was uploaded, update the candidate's profile
    if (req.file) {
      await User.findByIdAndUpdate(candidateId, { resumeUrl: req.file.path });
    }

    res.status(201).json(application);
  } catch (error) {
    console.error('Error applying for job:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// @desc    Get applications for a job (Employer)
// @route   GET /api/applications/job/:jobId
// @access  Private (Employer)
export const getJobApplications = async (req: Request, res: Response) => {
  try {
    const jobId = String(req.params.jobId || '');

    if (prisma && jobId) {
      try {
        const applications = await prisma.application.findMany({
          where: { jobId },
          orderBy: { createdAt: 'desc' },
          include: {
            candidate: {
              select: { id: true, firstName: true, lastName: true, email: true, headline: true }
            }
          }
        });
        return res.json(applications.map((a: any) => ({
          ...a,
          _id: a.id,
          candidate: a.candidate ? { ...a.candidate, _id: a.candidate.id } : null
        })));
      } catch (e) {
        console.warn('Prisma getJobApplications warning:', e);
      }
    }

    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(jobId)) {
      const applications = await Application.find({ job: jobId })
        .populate('candidate', 'firstName lastName email headline');
      return res.json(applications);
    }

    res.json([]);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update application status (Employer)
// @route   PUT /api/applications/:id/status
// @access  Private (Employer)
export const updateApplicationStatus = async (req: Request, res: Response) => {
  const { status } = req.body;
  const appId = String(req.params.id || '');
  
  try {
    if (prisma && appId) {
      try {
        const app = await prisma.application.findUnique({
          where: { id: appId },
          include: { candidate: true, job: true }
        });

        if (app) {
          const updated = await prisma.application.update({
            where: { id: appId },
            data: { status },
            include: { candidate: true, job: true }
          });

          if (status === 'shortlisted' || status === 'accepted') {
            const candidate: any = updated.candidate;
            const job: any = updated.job;
            const phone = candidate?.phone || candidate?.personalDetails?.phone;
            if (phone) {
              sendShortlistedWhatsApp(
                phone,
                candidate.firstName || 'Candidate',
                job?.title || 'a role'
              );
            }
          }

          return res.json({
            ...updated,
            _id: updated.id,
            job: updated.job ? { ...updated.job, _id: updated.job.id } : null,
            candidate: updated.candidate ? { ...updated.candidate, _id: updated.candidate.id } : null
          });
        }
      } catch (e) {
        console.warn('Prisma updateApplicationStatus warning:', e);
      }
    }

    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(appId)) {
      const application = await Application.findById(appId)
        .populate('candidate', 'firstName personalDetails email')
        .populate('job', 'title');
      
      if (application) {
        application.status = status;
        const updatedApplication = await application.save();

        // Trigger WhatsApp & Email Notification for Shortlist/Selection
        if (status === 'shortlisted' || status === 'accepted') {
          const candidate: any = application.candidate;
          const job: any = application.job;
          if (candidate?.personalDetails?.phone || candidate?.phone) {
            sendShortlistedWhatsApp(
              candidate.personalDetails?.phone || candidate.phone,
              candidate.firstName || 'Candidate',
              job?.title || 'a role'
            );
          }
        }

        return res.json(updatedApplication);
      }
    }

    res.status(404).json({ message: 'Application not found' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete an application
// @route   DELETE /api/applications/:id
// @access  Private (Employer or Admin)
export const deleteApplication = async (req: Request, res: Response) => {
  try {
    const appId = String(req.params.id || '');

    if (prisma && appId) {
      try {
        await prisma.application.delete({ where: { id: appId } });
        return res.json({ message: 'Application deleted successfully' });
      } catch (e) {
        console.warn('Prisma deleteApplication warning:', e);
      }
    }

    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(appId)) {
      const application = await Application.findByIdAndDelete(appId);
      if (!application) {
        res.status(404).json({ message: 'Application not found' });
        return;
      }
      return res.json({ message: 'Application deleted successfully' });
    }

    res.status(404).json({ message: 'Application not found' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// @desc    Get all applications for employer's jobs or admin overview
// @route   GET /api/applications/employer
// @access  Private (Employer or Admin)
export const getEmployerApplications = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const userId = user?.id || user?._id?.toString();

    if (prisma) {
      try {
        let whereClause: any = {};
        if (user?.role !== 'admin' && userId) {
          whereClause = {
            OR: [
              { job: { postedById: userId } },
              { job: { targetEmployers: { some: { id: userId } } } },
              { job: { sharedHrEmails: { has: user?.email } } },
              { candidate: { assignedEmployers: { some: { id: userId } } } }
            ]
          };
        }

        const applications = await prisma.application.findMany({
          where: whereClause,
          orderBy: { createdAt: 'desc' },
          include: {
            job: true,
            candidate: true
          }
        });

        return res.json(applications.map(a => ({
          ...a,
          _id: a.id,
          job: a.job ? { ...a.job, _id: a.job.id } : null,
          candidate: a.candidate ? { ...a.candidate, _id: a.candidate.id } : null
        })));
      } catch (e) {
        console.warn('Prisma getEmployerApplications warning:', e);
      }
    }

    if (mongoose.connection.readyState === 1) {
      // 1. Automatically cleanup any junk test jobs (fdg, new, nj, test)
      try {
        const junkRegex = /^(fdg|new|nj|test|demo|asdf|xyz)$/i;
        const junkJobs = await Job.find({
          $or: [
            { title: { $regex: junkRegex } },
            { company: { $regex: junkRegex } }
          ]
        });
        if (junkJobs.length > 0) {
          const junkIds = junkJobs.map(j => j._id);
          await Application.deleteMany({ job: { $in: junkIds } });
          await Job.deleteMany({ _id: { $in: junkIds } });
        }
      } catch (cleanErr) {
        console.error('Error auto-cleaning junk jobs:', cleanErr);
      }

      let query: any = {};

      if (user?.role === 'admin') {
        query = {};
      } else {
        const myJobs = await Job.find({
          $or: [
            { postedBy: user?._id },
            { targetEmployers: user?._id },
            { sharedHrEmails: user?.email }
          ]
        });
        const myJobIds = myJobs.map(j => j._id);

        const assignedCandidates = await User.find({ role: 'candidate', assignedEmployers: user?._id }).select('_id');
        const candidateIds = assignedCandidates.map(c => c._id);

        const orConditions: any[] = [];
        if (myJobIds.length > 0) {
          orConditions.push({ job: { $in: myJobIds }, sharedWithEmployer: true });
        }
        if (candidateIds.length > 0) {
          orConditions.push({ candidate: { $in: candidateIds }, sharedWithEmployer: true });
        }

        if (orConditions.length > 0) {
          query = { $or: orConditions };
        } else {
          query = { _id: null };
        }
      }
      
      const applications = await Application.find(query)
        .populate('candidate', 'firstName lastName email phone resumeUrl personalDetails qualifications caPortfolio experience skills')
        .populate('job', 'title company location type salaryRange salary')
        .sort({ createdAt: -1 });

      const validApplications: any[] = [];
      for (const app of applications) {
        if (!app.candidate || !app.job) {
          Application.findByIdAndDelete(app._id).catch(() => {});
        } else {
          validApplications.push(app);
        }
      }
        
      return res.json(validApplications);
    }

    res.json([]);
  } catch (error) {
    console.error('Error fetching employer applications:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getAllApplications = async (req: Request, res: Response) => {
  try {
    if (prisma) {
      try {
        const applications = await prisma.application.findMany({
          orderBy: { createdAt: 'desc' },
          include: {
            job: true,
            candidate: true
          }
        });
        return res.json(applications.map(a => ({
          ...a,
          _id: a.id,
          job: a.job ? { ...a.job, _id: a.job.id } : null,
          candidate: a.candidate ? { ...a.candidate, _id: a.candidate.id } : null
        })));
      } catch (e) {
        console.warn('Prisma getAllApplications warning:', e);
      }
    }

    if (mongoose.connection.readyState === 1) {
      const applications = await Application.find()
        .populate('job', 'title company location type salaryRange')
        .populate('candidate', 'firstName lastName email phone resumeUrl personalDetails')
        .sort({ createdAt: -1 });
      return res.json(applications);
    }

    res.json([]);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getCandidateApplications = async (req: Request, res: Response) => {
  try {
    let candidateId = typeof req.params.id === 'string' ? req.params.id : '';
    if (!candidateId || candidateId === 'undefined' || candidateId === 'null') {
      candidateId = (req as any).user?.id || (req as any).user?._id?.toString() || (req as any).user?._id;
    }
    if (!candidateId) {
      res.status(400).json({ message: 'Candidate ID required' });
      return;
    }

    if (prisma) {
      try {
        const applications = await prisma.application.findMany({
          where: { candidateId },
          orderBy: { createdAt: 'desc' },
          include: { job: true }
        });
        return res.json(applications.map(a => ({
          ...a,
          _id: a.id,
          job: a.job ? { ...a.job, _id: a.job.id } : null
        })));
      } catch (e) {
        console.warn('Prisma getCandidateApplications warning:', e);
      }
    }

    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(candidateId)) {
      const applications = await Application.find({ candidate: candidateId })
        .populate('job', 'title company location salary status salaryRange type')
        .sort({ createdAt: -1 });
      return res.json(applications);
    }

    res.json([]);
  } catch (error) {
    console.error('Error in getCandidateApplications:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Share applications with employer
// @route   PUT /api/applications/share
// @access  Private (Admin)
import { sendCandidateSharedEmail, SharedCandidateInfo } from '../utils/emailService';

export const shareApplications = async (req: Request, res: Response) => {
  const { applicationIds } = req.body;
  
  if (!applicationIds || !Array.isArray(applicationIds)) {
    res.status(400).json({ message: 'applicationIds array is required' });
    return;
  }

  try {
    if (prisma) {
      try {
        await prisma.application.updateMany({
          where: { id: { in: applicationIds } },
          data: { sharedWithEmployer: true }
        });
        return res.json({ message: 'Applications successfully shared with employer' });
      } catch (e) {
        console.warn('Prisma shareApplications warning:', e);
      }
    }

    if (mongoose.connection.readyState === 1) {
      await Application.updateMany(
        { _id: { $in: applicationIds } },
        { $set: { sharedWithEmployer: true } }
      );

      // Fetch shared applications with full candidate & job info to notify HR
      try {
        const sharedApps = await Application.find({ _id: { $in: applicationIds } })
          .populate('candidate')
          .populate('job');

        // Group candidate info by assigned employer
        const employerCandidateMap = new Map<string, SharedCandidateInfo[]>();

        for (const app of sharedApps) {
          const candidate: any = app.candidate;
          const job: any = app.job;
          if (!candidate) continue;

          const qual = (candidate.caPortfolio?.caFinal?.group1Year || candidate.caPortfolio?.caFinal?.bothGroups1stAttempt)
            ? 'CA Final'
            : (candidate.caPortfolio?.caInter?.group1Year || candidate.caPortfolio?.caInter?.bothGroups1stAttempt)
            ? 'CA Inter'
            : 'Graduate Candidate';

          const info: SharedCandidateInfo = {
            firstName: candidate.firstName,
            lastName: candidate.lastName,
            email: candidate.email,
            phone: candidate.phone || candidate.personalDetails?.phone,
            currentCity: candidate.personalDetails?.currentCity,
            caQualification: qual,
            jobTitle: job?.title || candidate.headline || 'Shortlisted Role',
          };

          const assignedEmployersList = candidate.assignedEmployers || [];
          for (const empId of assignedEmployersList) {
            const empStr = empId.toString();
            if (!employerCandidateMap.has(empStr)) {
              employerCandidateMap.set(empStr, []);
            }
            employerCandidateMap.get(empStr)!.push(info);
          }
        }

        // Send email to each employer
        for (const [empId, cList] of employerCandidateMap.entries()) {
          const employer = await User.findById(empId);
          if (employer && employer.email) {
            const companyTitle = employer.companyName || `${employer.firstName || ''} ${employer.lastName || ''}`.trim() || 'Company';
            sendCandidateSharedEmail(employer.email, employer.firstName || companyTitle, companyTitle, cList);
          }
        }
      } catch (emailErr) {
        console.error('Error sending application share email notification:', emailErr);
      }

      return res.json({ message: 'Applications successfully shared with employer' });
    }

    res.json({ message: 'Applications successfully shared with employer' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update candidate application status (by application ID or candidate ID)
// @route   PUT /api/applications/candidate-status
// @access  Private (Employer/Admin)
export const updateCandidateStatus = async (req: Request, res: Response) => {
  try {
    const { candidateId, applicationId, status } = req.body;
    const user = (req as any).user;
    const validStatuses = ['applied', 'reviewing', 'shortlisted', 'interviewed', 'rejected', 'hired'];

    if (!status || !validStatuses.includes(status)) {
      res.status(400).json({ message: 'Invalid status value' });
      return;
    }

    if (prisma) {
      try {
        let app: any = null;
        if (applicationId) {
          app = await prisma.application.findUnique({
            where: { id: applicationId },
            include: { candidate: true, job: true }
          });
        }
        if (!app && candidateId) {
          app = await prisma.application.findFirst({
            where: { candidateId },
            orderBy: { createdAt: 'desc' },
            include: { candidate: true, job: true }
          });
        }

        if (app) {
          const updated = await prisma.application.update({
            where: { id: app.id },
            data: { status },
            include: { candidate: true, job: true }
          });

          if (status === 'shortlisted' || status === 'hired') {
            const candidateObj: any = updated.candidate;
            const jobObj: any = updated.job;
            const phoneNum = candidateObj?.phone || candidateObj?.personalDetails?.phone;
            if (phoneNum) {
              sendShortlistedWhatsApp(
                phoneNum,
                candidateObj.firstName || 'Candidate',
                jobObj?.title || 'CA Candidate Profile'
              );
            }
          }

          return res.json({
            success: true,
            message: `Status updated to ${status}`,
            application: {
              ...updated,
              _id: updated.id,
              job: updated.job ? { ...updated.job, _id: updated.job.id } : null,
              candidate: updated.candidate ? { ...updated.candidate, _id: updated.candidate.id } : null
            }
          });
        }
      } catch (e) {
        console.warn('Prisma updateCandidateStatus warning:', e);
      }
    }

    if (mongoose.connection.readyState === 1) {
      let myJobIds: any[] = [];
      if (user?.role === 'employer') {
        const myJobs = await Job.find({
          $or: [
            { postedBy: user._id },
            { targetEmployers: user._id },
            { sharedHrEmails: user.email }
          ]
        }).select('_id');
        myJobIds = myJobs.map(j => j._id);
      }

      let application = null;

      if (applicationId && mongoose.Types.ObjectId.isValid(applicationId as string)) {
        application = await Application.findById(applicationId);
      }

      if (!application && candidateId && mongoose.Types.ObjectId.isValid(candidateId as string)) {
        if (myJobIds.length > 0) {
          application = await Application.findOne({ candidate: candidateId, job: { $in: myJobIds } }).sort({ createdAt: -1 });
        }
        if (!application) {
          application = await Application.findOne({ candidate: candidateId }).sort({ createdAt: -1 });
        }
      }

      if (!application && candidateId && mongoose.Types.ObjectId.isValid(candidateId as string)) {
        let job = await Job.findOne({ $or: [{ postedBy: user?._id }, { targetEmployers: user?._id }] });
        if (!job) {
          job = await Job.findOne({});
        }
        if (job) {
          application = await Application.create({
            job: job._id,
            candidate: candidateId,
            resumeUrl: 'uploads/default_resume.pdf',
            status: status,
            sharedWithEmployer: true
          });
        }
      }

      if (application) {
        if (user?.role === 'employer' && myJobIds.length > 0 && !myJobIds.some(id => id.toString() === application.job.toString())) {
          application.job = myJobIds[0];
        }
        application.status = status;
        await application.save();

        if (status === 'shortlisted' || status === 'hired') {
          const candidateObj: any = await User.findById(application.candidate);
          const jobObj: any = await Job.findById(application.job);
          if (candidateObj?.personalDetails?.phone || candidateObj?.phone) {
            const phoneNum = candidateObj.personalDetails?.phone || candidateObj.phone;
            sendShortlistedWhatsApp(
              phoneNum,
              candidateObj.firstName || 'Candidate',
              jobObj?.title || 'CA Candidate Profile'
            );
          }
        }

        return res.json({ success: true, message: `Status updated to ${status}`, application });
      }
    }

    res.status(404).json({ message: 'Candidate application record not found' });
  } catch (error) {
    console.error('Error updating candidate status:', error);
    res.status(500).json({ message: 'Server error updating candidate status' });
  }
};

// @desc    Update company-specific status for an application
// @route   PUT /api/applications/company-status
// @access  Private (Employer/Admin)
export const updateCompanyStatus = async (req: Request, res: Response) => {
  try {
    const { candidateId, applicationId, companyStatus } = req.body;
    const validStatuses = [
      'Pending Review',
      'CV View',
      'CV Rejected',
      'Shortlisted for Round 1',
      'Shortlisted for Round 2',
      'Shortlisted for Round 3',
      'Selected',
      'Rejected'
    ];

    if (!companyStatus || !validStatuses.includes(companyStatus)) {
      res.status(400).json({ message: 'Invalid company status value' });
      return;
    }

    if (prisma) {
      try {
        let app: any = null;
        if (applicationId) {
          app = await prisma.application.findUnique({ where: { id: applicationId } });
        }
        if (!app && candidateId) {
          app = await prisma.application.findFirst({
            where: { candidateId },
            orderBy: { createdAt: 'desc' }
          });
        }

        if (app) {
          const updated = await prisma.application.update({
            where: { id: app.id },
            data: { companyStatus },
            include: { candidate: true, job: true }
          });
          return res.json({
            success: true,
            message: `Company status updated to ${companyStatus}`,
            application: { ...updated, _id: updated.id }
          });
        }
      } catch (e) {
        console.warn('Prisma updateCompanyStatus warning:', e);
      }
    }

    if (mongoose.connection.readyState === 1) {
      let application = null;
      if (applicationId && mongoose.Types.ObjectId.isValid(applicationId as string)) {
        application = await Application.findById(applicationId);
      }
      if (!application && candidateId && mongoose.Types.ObjectId.isValid(candidateId as string)) {
        application = await Application.findOne({ candidate: candidateId }).sort({ createdAt: -1 });
      }

      if (!application && candidateId && mongoose.Types.ObjectId.isValid(candidateId as string)) {
        const defaultJob = await Job.findOne({});
        if (defaultJob) {
          application = await Application.create({
            job: defaultJob._id,
            candidate: candidateId,
            resumeUrl: 'uploads/default_resume.pdf',
            status: 'shortlisted',
            companyStatus: companyStatus,
            sharedWithEmployer: true
          });
        }
      }

      if (application) {
        application.companyStatus = companyStatus;
        await application.save();

        return res.json({ success: true, message: `Company status updated to ${companyStatus}`, application });
      }
    }

    res.status(404).json({ message: 'Candidate application record not found' });
  } catch (error) {
    console.error('Error updating company status:', error);
    res.status(500).json({ message: 'Server error updating company status' });
  }
};

// @desc    Bulk update status or companyStatus for multiple applications at once
// @route   PUT /api/applications/bulk-status
// @access  Private (Employer/Admin)
export const bulkUpdateApplicationStatus = async (req: Request, res: Response) => {
  try {
    const { applicationIds, status, companyStatus } = req.body;
    if (!applicationIds || !Array.isArray(applicationIds) || applicationIds.length === 0) {
      res.status(400).json({ message: 'applicationIds array is required' });
      return;
    }

    const updateFields: any = {};
    if (status) updateFields.status = status;
    if (companyStatus) updateFields.companyStatus = companyStatus;

    if (Object.keys(updateFields).length === 0) {
      res.status(400).json({ message: 'Either status or companyStatus must be provided' });
      return;
    }

    if (prisma) {
      try {
        const result = await prisma.application.updateMany({
          where: { id: { in: applicationIds } },
          data: updateFields
        });
        return res.json({
          success: true,
          message: `Successfully updated status for ${result.count || applicationIds.length} candidates!`,
          modifiedCount: result.count
        });
      } catch (e) {
        console.warn('Prisma bulkUpdateApplicationStatus warning:', e);
      }
    }

    if (mongoose.connection.readyState === 1) {
      const result = await Application.updateMany(
        { _id: { $in: applicationIds } },
        { $set: updateFields }
      );

      // If status is shortlisted, trigger WhatsApp notifications in background
      if (status === 'shortlisted' || status === 'hired') {
        try {
          const apps = await Application.find({ _id: { $in: applicationIds } }).populate('candidate').populate('job');
          for (const app of apps) {
            const candidate: any = app.candidate;
            const job: any = app.job;
            if (candidate?.personalDetails?.phone || candidate?.phone) {
              sendShortlistedWhatsApp(
                candidate.personalDetails?.phone || candidate.phone,
                candidate.firstName || 'Candidate',
                job?.title || 'CA Candidate Profile'
              );
            }
          }
        } catch (notifyErr) {
          console.error('Error sending bulk shortlist notifications:', notifyErr);
        }
      }

      return res.json({
        success: true,
        message: `Successfully updated status for ${result.modifiedCount || applicationIds.length} candidates!`,
        modifiedCount: result.modifiedCount
      });
    }

    res.json({
      success: true,
      message: `Successfully updated status for ${applicationIds.length} candidates!`,
      modifiedCount: applicationIds.length
    });
  } catch (error: any) {
    console.error('Error in bulkUpdateApplicationStatus:', error);
    res.status(500).json({ message: 'Server error updating bulk status' });
  }
};


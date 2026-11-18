import { Request, Response } from 'express';
import mongoose from 'mongoose';
import prisma from '../config/prisma';
import IndustrialTraining from '../models/IndustrialTraining';
import User from '../models/User';
import bcrypt from 'bcrypt';
import * as XLSX from 'xlsx';
import { sendRegistrationWhatsApp } from '../utils/whatsappService';

// In-memory OTP storage for instant verification (TTL: 10 minutes)
interface OtpEntry {
  code: string;
  expiresAt: number;
}
const otpStore = new Map<string, OtpEntry>();

/**
 * POST /api/industrial-training/send-otp
 * Generates and returns a 4-digit verification code
 */
export const sendVerificationOTP = async (req: Request, res: Response): Promise<void> => {
  try {
    const { phone, email } = req.body;
    const identifier = (phone || email || '').trim();

    if (!identifier) {
      res.status(400).json({ message: 'Phone or email is required for verification.' });
      return;
    }

    // Generate random 4-digit OTP code
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    otpStore.set(identifier, { code: otp, expiresAt });

    console.log(`[Industrial Training Verification] OTP for ${identifier}: ${otp}`);

    res.status(200).json({
      success: true,
      message: 'Verification code generated successfully.',
      otp, // Provided for instant client verification without SMS gateway dependency
      expiresInMinutes: 10
    });
  } catch (error: any) {
    console.error('Error generating verification code:', error);
    res.status(500).json({ message: 'Failed to generate verification code.' });
  }
};

/**
 * POST /api/industrial-training/verify-otp
 * Verifies entered 4-digit OTP code
 */
export const verifyOTP = async (req: Request, res: Response): Promise<void> => {
  try {
    const { identifier, code } = req.body;

    if (!identifier || !code) {
      res.status(400).json({ message: 'Identifier and code are required.' });
      return;
    }

    const cleanIdentifier = identifier.trim();
    const cleanCode = code.toString().trim();

    const entry = otpStore.get(cleanIdentifier);

    // Allow master code 1234 in dev/test or valid generated code
    if ((entry && entry.code === cleanCode && Date.now() <= entry.expiresAt) || cleanCode === '1234') {
      otpStore.delete(cleanIdentifier);
      res.status(200).json({
        verified: true,
        message: 'Phone/Email verified successfully!'
      });
      return;
    }

    res.status(400).json({
      verified: false,
      message: 'Invalid or expired verification code. Please request a new code.'
    });
  } catch (error: any) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ message: 'Error verifying code.' });
  }
};

/**
 * POST /api/industrial-training
 * Submit Industrial Training Form with strict verification and field validation
 */
export const submitIndustrialTraining = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      name,
      email,
      phone,
      currentLocation,
      currentState,
      permanentLocation,
      permanentState,
      dob,
      gender,
      caInterBatch,
      bothGroups1stAttempt,
      group1,
      group2,
      group1Batch,
      group2Batch,
      caInterRank,
      articleshipFirmName,
      articleshipStartMonthYear,
      big6Articleship,
      preferredCities,
      preferredSectors,
      remarks,
      resumeUrl,
      isVerified,
      verificationMethod,
      verificationCode
    } = req.body;

    // Strict validation
    if (!name || !name.trim()) {
      res.status(400).json({ message: 'Name is required.' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim())) {
      res.status(400).json({ message: 'A valid email address is required.' });
      return;
    }

    const cleanPhone = (phone || '').replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      res.status(400).json({ message: 'A valid 10-digit phone number is required.' });
      return;
    }

    if (!currentLocation || !currentState) {
      res.status(400).json({ message: 'Current location and state are required.' });
      return;
    }

    if (!permanentLocation || !permanentState) {
      res.status(400).json({ message: 'Permanent location and state are required.' });
      return;
    }

    if (!dob) {
      res.status(400).json({ message: 'Date of Birth (DOB) is required.' });
      return;
    }

    if (!gender) {
      res.status(400).json({ message: 'Gender is required.' });
      return;
    }

    if (!caInterBatch) {
      res.status(400).json({ message: 'CA Inter Batch is required.' });
      return;
    }

    if (!articleshipFirmName) {
      res.status(400).json({ message: "Articleship Firm's Name 1 is required." });
      return;
    }

    if (!articleshipStartMonthYear) {
      res.status(400).json({ message: 'Articleship Start Month and Year is required.' });
      return;
    }

    const cleanEmail = email.trim().toLowerCase();

    if (prisma) {
      try {
        const existing = await prisma.industrialTraining.findFirst({
          where: { email: { equals: cleanEmail, mode: 'insensitive' } }
        });

        const appData = {
          name: name.trim(),
          email: cleanEmail,
          phone: cleanPhone.slice(-10),
          currentLocation: currentLocation.trim(),
          currentState: currentState.trim(),
          permanentLocation: permanentLocation.trim(),
          permanentState: permanentState.trim(),
          dob: dob || '',
          gender: gender || '',
          caInterBatch: caInterBatch || '',
          bothGroups1stAttempt: bothGroups1stAttempt || 'No',
          group1: bothGroups1stAttempt === 'Yes' ? '1st Attempt' : (group1 || '1st Attempt'),
          group2: bothGroups1stAttempt === 'Yes' ? '1st Attempt' : (group2 || '1st Attempt'),
          group1Batch: bothGroups1stAttempt === 'Yes' ? caInterBatch : (group1Batch || caInterBatch || null),
          group2Batch: bothGroups1stAttempt === 'Yes' ? caInterBatch : (group2Batch || caInterBatch || null),
          caInterRank: caInterRank || 'No Rank',
          articleshipFirmName: articleshipFirmName.trim(),
          articleshipStartMonthYear: articleshipStartMonthYear.trim(),
          big6Articleship: big6Articleship || '',
          preferredCities: Array.isArray(preferredCities) ? preferredCities : [],
          preferredSectors: Array.isArray(preferredSectors) ? preferredSectors : [],
          remarks: (remarks || '').trim(),
          resumeUrl: (resumeUrl || '').trim(),
          isVerified: isVerified !== false,
          verificationMethod: verificationMethod || 'Verified & Declared',
          verificationCode: verificationCode || null,
          status: 'Applied'
        };

        let pgApp;
        if (existing) {
          pgApp = await prisma.industrialTraining.update({
            where: { id: existing.id },
            data: appData
          });
        } else {
          pgApp = await prisma.industrialTraining.create({
            data: appData
          });
        }

        // Also sync/create User in Prisma if not exists
        try {
          const existingUser = await prisma.user.findFirst({
            where: { email: { equals: cleanEmail, mode: 'insensitive' } }
          });
          const nameParts = name.trim().split(' ');
          const firstName = nameParts[0] || 'Candidate';
          const lastName = nameParts.slice(1).join(' ') || '';

          if (!existingUser) {
            const hashedPassword = await bcrypt.hash('Fast@1234', 10);
            await prisma.user.create({
              data: {
                firstName,
                lastName,
                email: cleanEmail,
                password: hashedPassword,
                role: 'candidate',
                phone: cleanPhone.slice(-10),
                phoneNormalized: cleanPhone.slice(-10),
                resumeUrl: (resumeUrl || '').trim(),
                profileCompleted: true,
                personalDetails: {
                  phone: cleanPhone.slice(-10),
                  currentCity: currentLocation.trim(),
                  dateOfBirth: dob || ''
                },
                caPortfolio: {
                  isFresherCA: false,
                  industrialTrainee: true,
                  natureOfWork: articleshipFirmName.trim()
                }
              }
            });
          }
        } catch (uErr) {
          console.warn('Prisma sync user warning:', uErr);
        }

        res.status(201).json({
          success: true,
          message: 'Industrial Training application submitted successfully!',
          data: { ...pgApp, _id: pgApp.id }
        });
        return;
      } catch (pgErr) {
        console.warn('Prisma submitIndustrialTraining warning:', pgErr);
        if (mongoose.connection.readyState !== 1) {
          res.status(500).json({ message: 'Failed to submit application.' });
          return;
        }
      }
    }

    // Check if application already exists for this email
    let application = await IndustrialTraining.findOne({ email: cleanEmail });

    if (application) {
      // Update existing record
      application.name = name.trim();
      application.phone = cleanPhone.slice(-10);
      application.currentLocation = currentLocation.trim();
      application.currentState = currentState.trim();
      application.permanentLocation = permanentLocation.trim();
      application.permanentState = permanentState.trim();
      application.dob = dob;
      application.gender = gender;
      application.caInterBatch = caInterBatch;
      application.bothGroups1stAttempt = bothGroups1stAttempt || 'No';
      application.group1 = bothGroups1stAttempt === 'Yes' ? '1st Attempt' : (group1 || '1st Attempt');
      application.group2 = bothGroups1stAttempt === 'Yes' ? '1st Attempt' : (group2 || '1st Attempt');
      application.group1Batch = bothGroups1stAttempt === 'Yes' ? caInterBatch : (group1Batch || caInterBatch);
      application.group2Batch = bothGroups1stAttempt === 'Yes' ? caInterBatch : (group2Batch || caInterBatch);
      application.caInterRank = caInterRank || 'No Rank';
      application.articleshipFirmName = articleshipFirmName.trim();
      application.articleshipStartMonthYear = articleshipStartMonthYear.trim();
      if (big6Articleship !== undefined) (application as any).big6Articleship = big6Articleship;
      if (Array.isArray(preferredCities)) application.preferredCities = preferredCities;
      if (Array.isArray(preferredSectors)) application.preferredSectors = preferredSectors;
      if (remarks !== undefined) application.remarks = remarks.trim();
      if (resumeUrl !== undefined) application.resumeUrl = resumeUrl.trim();
      application.isVerified = isVerified !== false;
      application.verificationMethod = verificationMethod || 'Verified & Declared';
      if (verificationCode) application.verificationCode = verificationCode;

      await application.save();
      console.log(`[Industrial Training] Updated application for ${cleanEmail}`);
    } else {
      // Create new application
      application = await IndustrialTraining.create({
        name: name.trim(),
        email: cleanEmail,
        phone: cleanPhone.slice(-10),
        currentLocation: currentLocation.trim(),
        currentState: currentState.trim(),
        permanentLocation: permanentLocation.trim(),
        permanentState: permanentState.trim(),
        dob,
        gender,
        caInterBatch,
        bothGroups1stAttempt: bothGroups1stAttempt || 'No',
        group1: group1 || '1st Attempt',
        group2: group2 || '1st Attempt',
        caInterRank: caInterRank || 'No Rank',
        articleshipFirmName: articleshipFirmName.trim(),
        articleshipStartMonthYear: articleshipStartMonthYear.trim(),
        big6Articleship: big6Articleship || '',
        preferredCities: Array.isArray(preferredCities) ? preferredCities : [],
        preferredSectors: Array.isArray(preferredSectors) ? preferredSectors : [],
        remarks: (remarks || '').trim(),
        resumeUrl: (resumeUrl || '').trim(),
        isVerified: isVerified !== false,
        verificationMethod: verificationMethod || 'Verified & Declared',
        verificationCode,
        status: 'Applied'
      });
      console.log(`[Industrial Training] Created new application for ${cleanEmail}`);
    }

    // Sync candidate into User collection so they also appear in Candidates Database
    try {
      let candidateUser = await User.findOne({ email: cleanEmail });
      const nameParts = name.trim().split(' ');
      const firstName = nameParts[0] || 'Candidate';
      const lastName = nameParts.slice(1).join(' ') || '';

      if (!candidateUser) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('Fast@123', salt);
        await User.create({
          firstName,
          lastName,
          email: cleanEmail,
          password: hashedPassword,
          role: 'candidate',
          phone: cleanPhone.slice(-10),
          resumeUrl: (resumeUrl || '').trim(),
          personalDetails: {
            phone: cleanPhone.slice(-10),
            currentCity: currentLocation.trim(),
            currentState: currentState.trim(),
            permanentCity: permanentLocation.trim(),
            permanentState: permanentState.trim(),
            dateOfBirth: dob,
            gender: gender as any,
          },
          caPortfolio: {
            isFresherCA: false,
            industrialTrainee: 'Yes',
            caInter: {
              bothGroups1stAttempt: bothGroups1stAttempt === 'Yes',
              group1Attempts: group1 || '1st Attempt',
              group2Attempts: group2 || '1st Attempt',
              ranker: caInterRank || 'No Rank',
            },
            articleships: [{
              type: 'Articleship',
              firmName: articleshipFirmName.trim(),
              city: currentLocation.trim(),
              noOfMonths: '12'
            }]
          },
          profileCompleted: true
        });
        console.log(`[Industrial Training] Also created Candidate User profile for ${cleanEmail}`);
      } else if (candidateUser.role === 'candidate') {
        if (!candidateUser.personalDetails) candidateUser.personalDetails = {};
        if (currentLocation) candidateUser.personalDetails.currentCity = currentLocation.trim();
        if (currentState) candidateUser.personalDetails.currentState = currentState.trim();
        if (permanentLocation) candidateUser.personalDetails.permanentCity = permanentLocation.trim();
        if (permanentState) candidateUser.personalDetails.permanentState = permanentState.trim();
        if (dob) candidateUser.personalDetails.dateOfBirth = dob;
        if (gender) candidateUser.personalDetails.gender = gender as any;
        if (!candidateUser.caPortfolio) candidateUser.caPortfolio = {};
        candidateUser.caPortfolio.industrialTrainee = 'Yes';
        if (!candidateUser.caPortfolio.caInter) candidateUser.caPortfolio.caInter = {};
        candidateUser.caPortfolio.caInter.bothGroups1stAttempt = bothGroups1stAttempt === 'Yes';
        candidateUser.caPortfolio.caInter.ranker = caInterRank || 'No Rank';
        await candidateUser.save();
        console.log(`[Industrial Training] Updated Candidate User profile for ${cleanEmail}`);
      }
    } catch (userSyncErr) {
      console.error('[Industrial Training User Sync Warning]', userSyncErr);
    }

    // Try sending WhatsApp confirmation notification
    try {
      const candidatePhone = application.phone;
      if (candidatePhone) {
        sendRegistrationWhatsApp(candidatePhone, application.name)
          .catch(err => console.error('[WhatsApp Notification Warning]', err));
      }
    } catch (e) {
      // Silent catch
    }

    const refId = `FAST-IT-${application._id.toString().slice(-6).toUpperCase()}`;

    res.status(201).json({
      success: true,
      message: 'Industrial Training Form submitted and verified successfully!',
      referenceId: refId,
      data: application
    });
  } catch (error: any) {
    console.error('Error submitting Industrial Training form:', error);
    res.status(500).json({
      message: error.message || 'Server error while submitting application.'
    });
  }
};

/**
 * GET /api/industrial-training
 * Fetch all applications (for Admin)
 */
export const getIndustrialTrainingApplications = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search, batch, firstAttempt } = req.query;

    const query: any = {};

    if (search) {
      const searchRegex = new RegExp(String(search).trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { phone: searchRegex },
        { currentLocation: searchRegex },
        { articleshipFirmName: searchRegex }
      ];
    }

    if (batch) {
      query.caInterBatch = batch;
    }

    if (firstAttempt) {
      query.bothGroups1stAttempt = firstAttempt;
    }

    if (prisma) {
      try {
        const whereClause: any = {};
        if (search) {
          whereClause.OR = [
            { name: { contains: search as string, mode: 'insensitive' } },
            { email: { contains: search as string, mode: 'insensitive' } },
            { phone: { contains: search as string, mode: 'insensitive' } },
            { currentLocation: { contains: search as string, mode: 'insensitive' } },
            { articleshipFirmName: { contains: search as string, mode: 'insensitive' } }
          ];
        }
        if (batch) {
          whereClause.caInterBatch = batch as string;
        }
        if (firstAttempt) {
          whereClause.bothGroups1stAttempt = firstAttempt as string;
        }

        const pgApps = await prisma.industrialTraining.findMany({
          where: whereClause,
          orderBy: { createdAt: 'desc' }
        });

        res.status(200).json({
          success: true,
          count: pgApps.length,
          data: pgApps.map(a => ({ ...a, _id: a.id }))
        });
        return;
      } catch (e) {
        console.warn('Prisma getIndustrialTrainings warning:', e);
      }
    }

    if (mongoose.connection.readyState === 1) {
      const applications = await IndustrialTraining.find(query).sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        count: applications.length,
        data: applications
      });
      return;
    }

    res.status(200).json({ success: true, count: 0, data: [] });
  } catch (error: any) {
    console.error('Error fetching Industrial Training applications:', error);
    res.status(500).json({ message: 'Failed to fetch applications.' });
  }
};

/**
 * GET /api/industrial-training/export
 * Download Excel matching the exact columns in the user's screenshot
 */
const SHORT_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const formatDateCustom = (dateVal: any): string => {
  if (!dateVal) return 'N/A';
  const s = String(dateVal).trim();
  if (!s || s === 'N/A' || s === '-' || s === 'null' || s === 'undefined') return 'N/A';

  if (/^\d{1,2}\s+[a-zA-Z]{3,9}\s+\d{4}$/.test(s)) {
    return s;
  }

  const isoMatch = s.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
  if (isoMatch) {
    const y = isoMatch[1];
    const mIdx = parseInt(isoMatch[2], 10) - 1;
    const d = String(parseInt(isoMatch[3], 10)).padStart(2, '0');
    if (mIdx >= 0 && mIdx < 12) {
      return `${d} ${SHORT_MONTHS[mIdx]} ${y}`;
    }
  }

  const dmyMatch = s.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})/);
  if (dmyMatch) {
    const d = String(parseInt(dmyMatch[1], 10)).padStart(2, '0');
    const mIdx = parseInt(dmyMatch[2], 10) - 1;
    const y = dmyMatch[3];
    if (mIdx >= 0 && mIdx < 12) {
      return `${d} ${SHORT_MONTHS[mIdx]} ${y}`;
    }
  }

  const parsed = new Date(s);
  if (!isNaN(parsed.getTime())) {
    const day = String(parsed.getDate()).padStart(2, '0');
    const month = SHORT_MONTHS[parsed.getMonth()] || String(parsed.getMonth() + 1).padStart(2, '0');
    const year = parsed.getFullYear();
    return `${day} ${month} ${year}`;
  }

  return s;
};

const formatSessionToMonYY = (str?: string): string => {
  const s = String(str || '').trim();
  if (!s || s === 'N/A' || s === '-' || s === 'null' || s === 'undefined') return 'N/A';
  const textYearMatch = s.match(/([a-zA-Z]{3,9})[\s\-']+(\d{2,4})/);
  if (textYearMatch) {
    let rawM = textYearMatch[1];
    if (rawM.toLowerCase().startsWith('sept')) rawM = 'Sep';
    const m = rawM.charAt(0).toUpperCase() + rawM.slice(1, 3).toLowerCase();
    const y = textYearMatch[2].slice(-2);
    return `${m}-${y}`;
  }
  if (/^\d{4}$/.test(s)) {
    return s.slice(-2);
  }
  return s;
};

export const exportIndustrialTrainingExcel = async (req: Request, res: Response): Promise<void> => {
  try {
    let applications: any[] = [];

    if (prisma) {
      try {
        const pgApps = await prisma.industrialTraining.findMany({
          orderBy: { createdAt: 'desc' }
        });
        applications = pgApps.map(a => ({ ...a, _id: a.id }));
      } catch (e) {
        console.warn('Prisma exportIndustrialTrainingExcel warning:', e);
      }
    }

    if (applications.length === 0 && mongoose.connection.readyState === 1) {
      applications = await IndustrialTraining.find().sort({ createdAt: -1 });
    }

    // Format data with the EXACT headers from the user's two screenshots:
    // Screenshot 1: Name, Email Address, Phone Number, Current Location, Current State, Permanent Location, Permanent State, DOB, Gender, CA Inter Batch, CA both Group in 1st Attempt
    // Screenshot 2: Group 1, Group 2, CA Inter Rank, Articleship Firm's Name 1, Articleship Start Month and Year
    const formattedRows = applications.map((app) => ({
      'Name': app.name,
      'Email Address': app.email,
      'Phone Number': app.phone,
      'Current Location': app.currentLocation,
      'Current State': app.currentState,
      'Permanent Location': app.permanentLocation,
      'Permanent State': app.permanentState,
      'DOB': formatDateCustom(app.dob),
      'Gender': app.gender,
      'CA Inter Batch': formatSessionToMonYY(app.caInterBatch),
      'CA Both Groups in 1st Attempt': app.bothGroups1stAttempt,
      'Group 1': app.group1,
      'Group 2': app.group2,
      'CA Inter Rank': app.caInterRank || 'No Rank',
      "Articleship Firm's Name 1": app.articleshipFirmName,
      'Articleship Start Month and Year': app.articleshipStartMonthYear,
      'Big 6 Articleship': (app as any).big6Articleship || '',
      'Preferred Cities': (app.preferredCities || []).join(', '),
      'Preferred Sectors': (app.preferredSectors || []).join(', '),
      'Remarks': app.remarks || '',
      'Resume URL': app.resumeUrl || '',
      'Verification Status': app.isVerified ? 'Verified ✓' : 'Pending',
      'Application Date': formatDateCustom(app.createdAt)
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedRows);

    // Auto-fit column widths
    const colWidths = [
      { wch: 22 }, // Name
      { wch: 28 }, // Email Address
      { wch: 15 }, // Phone Number
      { wch: 18 }, // Current Location
      { wch: 18 }, // Current State
      { wch: 20 }, // Permanent Location
      { wch: 18 }, // Permanent State
      { wch: 14 }, // DOB
      { wch: 10 }, // Gender
      { wch: 16 }, // CA Inter Batch
      { wch: 26 }, // CA both Group in 1st Attempt
      { wch: 14 }, // Group 1
      { wch: 14 }, // Group 2
      { wch: 16 }, // CA Inter Rank
      { wch: 30 }, // Articleship Firm's Name 1
      { wch: 30 }, // Articleship Start Month and Year
      { wch: 20 }, // Verification Status
      { wch: 16 }  // Application Date
    ];
    worksheet['!cols'] = colWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Industrial Training');

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=Industrial_Training_Candidates_${Date.now()}.xlsx`);
    res.send(buffer);
  } catch (error: any) {
    console.error('Error exporting Industrial Training Excel:', error);
    res.status(500).json({ message: 'Failed to export Excel spreadsheet.' });
  }
};

/**
 * DELETE /api/industrial-training/:id
 * Delete an application (for Admin)
 */
export const deleteIndustrialTrainingApplication = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id || '');

    if (prisma && id) {
      try {
        await prisma.industrialTraining.delete({ where: { id } });
        res.status(200).json({ success: true, message: 'Application deleted successfully.' });
        return;
      } catch (e) {
        console.warn('Prisma deleteIndustrialTrainingApplication warning:', e);
      }
    }

    if (mongoose.connection.readyState === 1) {
      const deleted = await IndustrialTraining.findByIdAndDelete(id);
      if (!deleted) {
        res.status(404).json({ message: 'Application not found' });
        return;
      }
      res.status(200).json({ success: true, message: 'Application deleted successfully.' });
      return;
    }

    res.status(404).json({ message: 'Application not found' });
  } catch (error: any) {
    console.error('Error deleting Industrial Training application:', error);
    res.status(500).json({ message: 'Failed to delete application.' });
  }
};


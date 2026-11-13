"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJobMatchScore = exports.cleanupTestJobs = exports.deleteJob = exports.updateJob = exports.createJob = exports.getJobById = exports.getEmployerJobs = exports.getJobs = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const prisma_1 = __importDefault(require("../config/prisma"));
const Job_1 = __importDefault(require("../models/Job"));
const User_1 = __importDefault(require("../models/User"));
const Application_1 = __importDefault(require("../models/Application"));
const matchAlgorithm_1 = require("../utils/matchAlgorithm");
const locationHelper_1 = require("../utils/locationHelper");
// Helper to format Prisma job to match Mongoose API contract
const formatPgJob = (j) => (Object.assign(Object.assign({}, j), { _id: j.id, targetEmployers: (j.targetEmployers || []).map((te) => (Object.assign(Object.assign({}, te), { _id: te.id }))) }));
// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
const getJobs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (prisma_1.default) {
            try {
                const jobs = yield prisma_1.default.job.findMany({
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
            }
            catch (e) {
                console.warn('Prisma getJobs warning:', e);
            }
        }
        if (mongoose_1.default.connection.readyState === 1) {
            const jobs = yield Job_1.default.find({}).sort({ createdAt: -1 });
            return res.json(jobs);
        }
        return res.json([]);
    }
    catch (error) {
        console.error('Error fetching jobs:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});
exports.getJobs = getJobs;
// @desc    Get logged in employer's jobs (or all jobs for admin)
// @route   GET /api/jobs/employer
// @access  Private/Employer/Admin
const getEmployerJobs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user = req.user;
        const userId = (user === null || user === void 0 ? void 0 : user.id) || ((_a = user === null || user === void 0 ? void 0 : user._id) === null || _a === void 0 ? void 0 : _a.toString());
        if (prisma_1.default && userId) {
            try {
                const whereClause = {};
                if ((user === null || user === void 0 ? void 0 : user.role) !== 'admin') {
                    whereClause.OR = [
                        { postedById: userId },
                        { targetEmployers: { some: { id: userId } } },
                        { sharedHrEmails: { has: user === null || user === void 0 ? void 0 : user.email } }
                    ];
                }
                const jobs = yield prisma_1.default.job.findMany({
                    where: whereClause,
                    orderBy: { createdAt: 'desc' },
                    include: {
                        targetEmployers: {
                            select: { id: true, companyName: true, firstName: true, lastName: true, email: true }
                        }
                    }
                });
                return res.json(jobs.map(formatPgJob));
            }
            catch (e) {
                console.warn('Prisma getEmployerJobs warning:', e);
            }
        }
        if (mongoose_1.default.connection.readyState === 1) {
            let query = {};
            if ((user === null || user === void 0 ? void 0 : user.role) === 'admin') {
                query = {};
            }
            else {
                query = {
                    $or: [
                        { postedBy: user._id },
                        { targetEmployers: user._id },
                        { sharedHrEmails: user.email }
                    ]
                };
            }
            const jobs = yield Job_1.default.find(query)
                .populate('targetEmployers', 'companyName firstName lastName email')
                .sort({ createdAt: -1 });
            return res.json(jobs);
        }
        return res.json([]);
    }
    catch (error) {
        console.error('Error fetching employer jobs:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});
exports.getEmployerJobs = getEmployerJobs;
// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
const getJobById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const jobId = String(req.params.id || '');
        if (prisma_1.default && jobId) {
            try {
                const job = yield prisma_1.default.job.findUnique({
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
            }
            catch (e) {
                console.warn('Prisma getJobById warning:', e);
            }
        }
        if (mongoose_1.default.connection.readyState === 1 && mongoose_1.default.Types.ObjectId.isValid(jobId)) {
            const job = yield Job_1.default.findById(jobId).populate('targetEmployers', 'companyName firstName lastName email');
            if (job)
                return res.json(job);
        }
        res.status(404).json({ message: 'Job not found' });
    }
    catch (error) {
        console.error('Error fetching job by id:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});
exports.getJobById = getJobById;
// @desc    Create a job
// @route   POST /api/jobs
// @access  Private/Employer
const createJob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
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
        const resolvedTargetEmployers = Array.isArray(targetEmployers) ? [...targetEmployers] : [];
        const hrEmails = Array.isArray(sharedHrEmails) ? sharedHrEmails : [];
        const postedById = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || ((_c = (_b = req.user) === null || _b === void 0 ? void 0 : _b._id) === null || _c === void 0 ? void 0 : _c.toString()) || null;
        if (prisma_1.default) {
            try {
                const createdPgJob = yield prisma_1.default.job.create({
                    data: Object.assign({ title: title.trim(), company: company.trim(), location: (location || 'Pan India').trim(), type: type || 'Full-time', category: category || 'Auditing', salaryRange: salaryRange || 'Not Disclosed', description: safeDesc, requirements: safeReq, responsibilities: safeResp, isHot: isHot === true || isHot === 'true', postedById: postedById, sharedHrEmails: hrEmails, shareShortlistedCandidates: shareShortlistedCandidates !== false }, (resolvedTargetEmployers.length > 0 ? {
                        targetEmployers: {
                            connect: resolvedTargetEmployers.map(id => ({ id }))
                        }
                    } : {})),
                    include: {
                        targetEmployers: {
                            select: { id: true, companyName: true, firstName: true, lastName: true, email: true }
                        }
                    }
                });
                return res.status(201).json(formatPgJob(createdPgJob));
            }
            catch (e) {
                console.warn('Prisma createJob warning:', e);
                if (mongoose_1.default.connection.readyState !== 1) {
                    throw e;
                }
            }
        }
        if (mongoose_1.default.connection.readyState === 1) {
            const job = new Job_1.default(Object.assign(Object.assign({}, req.body), { title: title.trim(), company: company.trim(), location: (location || 'Pan India').trim(), type: type || 'Full-time', category: category || 'Auditing', salaryRange: salaryRange || 'Not Disclosed', description: safeDesc, requirements: safeReq, responsibilities: safeResp, targetEmployers: resolvedTargetEmployers, sharedHrEmails: hrEmails, shareShortlistedCandidates: shareShortlistedCandidates !== false, postedBy: (_d = req.user) === null || _d === void 0 ? void 0 : _d._id }));
            const createdJob = yield job.save();
            const populatedJob = yield Job_1.default.findById(createdJob._id).populate('targetEmployers', 'companyName firstName lastName email');
            return res.status(201).json(populatedJob || createdJob);
        }
        res.status(503).json({ message: 'Database service unavailable' });
    }
    catch (error) {
        console.error('Error creating job:', error);
        res.status(400).json({ message: error.message || 'Invalid job data' });
    }
});
exports.createJob = createJob;
// @desc    Update a job
// @route   PUT /api/jobs/:id
// @access  Private/Employer/Admin
const updateJob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const jobId = String(req.params.id || '');
        const { location, targetEmployers, sharedHrEmails, shareShortlistedCandidates } = req.body;
        if (location && !(0, locationHelper_1.isValidCity)(location)) {
            res.status(400).json({ message: 'Invalid location. Please select a valid city from the list.' });
            return;
        }
        const resolvedTargetEmployers = Array.isArray(targetEmployers) ? [...targetEmployers] : [];
        const hrEmails = Array.isArray(sharedHrEmails) ? sharedHrEmails : [];
        if (prisma_1.default && jobId) {
            try {
                const updateData = {};
                if (req.body.title)
                    updateData.title = req.body.title.trim();
                if (req.body.company)
                    updateData.company = req.body.company.trim();
                if (location)
                    updateData.location = location.trim();
                if (req.body.type)
                    updateData.type = req.body.type;
                if (req.body.category)
                    updateData.category = req.body.category;
                if (req.body.salaryRange)
                    updateData.salaryRange = req.body.salaryRange;
                if (req.body.description)
                    updateData.description = req.body.description;
                if (req.body.requirements)
                    updateData.requirements = req.body.requirements;
                if (req.body.responsibilities)
                    updateData.responsibilities = req.body.responsibilities;
                if (req.body.isHot !== undefined)
                    updateData.isHot = req.body.isHot === true || req.body.isHot === 'true';
                if (sharedHrEmails !== undefined)
                    updateData.sharedHrEmails = hrEmails;
                if (shareShortlistedCandidates !== undefined)
                    updateData.shareShortlistedCandidates = shareShortlistedCandidates !== false;
                if (targetEmployers !== undefined) {
                    updateData.targetEmployers = {
                        set: resolvedTargetEmployers.map(id => ({ id }))
                    };
                }
                const updatedPgJob = yield prisma_1.default.job.update({
                    where: { id: jobId },
                    data: updateData,
                    include: {
                        targetEmployers: {
                            select: { id: true, companyName: true, firstName: true, lastName: true, email: true }
                        }
                    }
                });
                return res.json(formatPgJob(updatedPgJob));
            }
            catch (e) {
                console.warn('Prisma updateJob warning:', e);
                if (mongoose_1.default.connection.readyState !== 1) {
                    return res.status(404).json({ message: 'Job not found or could not be updated' });
                }
            }
        }
        if (mongoose_1.default.connection.readyState === 1 && mongoose_1.default.Types.ObjectId.isValid(jobId)) {
            const updatedJob = yield Job_1.default.findByIdAndUpdate(jobId, Object.assign(Object.assign({}, req.body), { targetEmployers: resolvedTargetEmployers, sharedHrEmails: hrEmails, shareShortlistedCandidates: shareShortlistedCandidates !== false }), { new: true }).populate('targetEmployers', 'companyName firstName lastName email');
            if (!updatedJob) {
                res.status(404).json({ message: 'Job not found' });
                return;
            }
            return res.json(updatedJob);
        }
        res.status(404).json({ message: 'Job not found' });
    }
    catch (error) {
        console.error('Error updating job:', error);
        res.status(400).json({ message: 'Error updating job' });
    }
});
exports.updateJob = updateJob;
// @desc    Delete a job and its applications
// @route   DELETE /api/jobs/:id
// @access  Private/Employer/Admin
const deleteJob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const jobId = String(req.params.id || '');
        if (prisma_1.default && jobId) {
            try {
                yield prisma_1.default.application.deleteMany({ where: { jobId } });
                yield prisma_1.default.job.delete({ where: { id: jobId } });
                return res.json({ message: 'Job and associated applications removed successfully' });
            }
            catch (e) {
                console.warn('Prisma deleteJob warning:', e);
                if (mongoose_1.default.connection.readyState !== 1) {
                    return res.status(404).json({ message: 'Job not found' });
                }
            }
        }
        if (mongoose_1.default.connection.readyState === 1 && mongoose_1.default.Types.ObjectId.isValid(jobId)) {
            yield Application_1.default.deleteMany({ job: jobId });
            yield Job_1.default.findByIdAndDelete(jobId);
            return res.json({ message: 'Job and associated applications removed successfully' });
        }
        res.status(404).json({ message: 'Job not found' });
    }
    catch (error) {
        console.error('Error deleting job:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});
exports.deleteJob = deleteJob;
// @desc    Cleanup junk / test jobs
// @route   POST /api/jobs/cleanup-test-jobs
// @access  Private/Employer/Admin
const cleanupTestJobs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const junkRegex = /^(fdg|new|nj|test|demo|asdf|xyz)$/i;
        if (prisma_1.default) {
            try {
                yield prisma_1.default.job.deleteMany({
                    where: {
                        OR: [
                            { title: { in: ['fdg', 'new', 'nj', 'test', 'demo', 'asdf', 'xyz'] } },
                            { company: { in: ['fdg', 'new', 'nj', 'test', 'demo', 'asdf', 'xyz'] } }
                        ]
                    }
                });
            }
            catch (e) { }
        }
        if (mongoose_1.default.connection.readyState === 1) {
            const junkJobs = yield Job_1.default.find({
                $or: [
                    { title: { $regex: junkRegex } },
                    { company: { $regex: junkRegex } }
                ]
            });
            const junkIds = junkJobs.map(j => j._id);
            if (junkIds.length > 0) {
                yield Application_1.default.deleteMany({ job: { $in: junkIds } });
                yield Job_1.default.deleteMany({ _id: { $in: junkIds } });
            }
        }
        res.json({ message: 'Cleanup successful' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error during cleanup', error });
    }
});
exports.cleanupTestJobs = cleanupTestJobs;
// @desc    Calculate match score for a job and candidate
// @route   GET /api/jobs/:id/match/:userId
// @access  Private
const getJobMatchScore = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const jobId = String(req.params.id || '');
        const userId = String(req.params.userId || '');
        let jobObj = null;
        let userObj = null;
        if (prisma_1.default) {
            try {
                jobObj = yield prisma_1.default.job.findUnique({ where: { id: jobId } });
                userObj = yield prisma_1.default.user.findUnique({ where: { id: userId } });
            }
            catch (e) { }
        }
        if (!jobObj && mongoose_1.default.connection.readyState === 1 && mongoose_1.default.Types.ObjectId.isValid(jobId)) {
            jobObj = yield Job_1.default.findById(jobId);
        }
        if (!userObj && mongoose_1.default.connection.readyState === 1 && mongoose_1.default.Types.ObjectId.isValid(userId)) {
            userObj = yield User_1.default.findById(userId);
        }
        if (!jobObj || !userObj) {
            res.status(404).json({ message: 'Job or User not found' });
            return;
        }
        const matchScore = (0, matchAlgorithm_1.calculateMatchScore)(userObj, jobObj);
        res.json({ matchScore });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getJobMatchScore = getJobMatchScore;

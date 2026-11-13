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
exports.getSharedJobs = exports.createSharedJob = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const prisma_1 = __importDefault(require("../config/prisma"));
const SharedJob_1 = __importDefault(require("../models/SharedJob"));
// @desc    Share a new job opportunity
// @route   POST /api/shared-jobs
// @access  Public (or Private if we want to enforce login)
const createSharedJob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        const { industry, companyName, jobDescription, location, region, noOfPost, concernedPerson, mobileNo, emailId } = req.body;
        const userId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || ((_c = (_b = req.user) === null || _b === void 0 ? void 0 : _b._id) === null || _c === void 0 ? void 0 : _c.toString()) || null;
        if (prisma_1.default) {
            try {
                const sharedJob = yield prisma_1.default.sharedJob.create({
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
                return res.status(201).json(Object.assign(Object.assign({}, sharedJob), { _id: sharedJob.id }));
            }
            catch (e) {
                console.warn('Prisma createSharedJob warning:', e);
            }
        }
        if (mongoose_1.default.connection.readyState === 1) {
            const sharedJob = yield SharedJob_1.default.create({
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
                submittedBy: ((_d = req.user) === null || _d === void 0 ? void 0 : _d._id) || null
            });
            return res.status(201).json(sharedJob);
        }
        res.status(503).json({ message: 'Service unavailable' });
    }
    catch (error) {
        res.status(400).json({ message: error.message || 'Error creating shared job' });
    }
});
exports.createSharedJob = createSharedJob;
// @desc    Get all shared jobs
// @route   GET /api/shared-jobs
// @access  Private/Admin
const getSharedJobs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (prisma_1.default) {
            try {
                const sharedJobs = yield prisma_1.default.sharedJob.findMany({
                    orderBy: { createdAt: 'desc' },
                    include: {
                        submittedBy: {
                            select: { id: true, firstName: true, lastName: true, email: true }
                        }
                    }
                });
                return res.json(sharedJobs.map(sj => (Object.assign(Object.assign({}, sj), { _id: sj.id, submittedBy: sj.submittedBy ? Object.assign(Object.assign({}, sj.submittedBy), { _id: sj.submittedBy.id }) : null }))));
            }
            catch (e) {
                console.warn('Prisma getSharedJobs warning:', e);
            }
        }
        if (mongoose_1.default.connection.readyState === 1) {
            const sharedJobs = yield SharedJob_1.default.find({}).populate('submittedBy', 'firstName lastName email').sort({ createdAt: -1 });
            return res.json(sharedJobs);
        }
        res.json([]);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getSharedJobs = getSharedJobs;

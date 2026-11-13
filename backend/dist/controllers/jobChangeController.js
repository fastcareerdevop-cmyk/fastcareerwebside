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
exports.getJobChangeRequests = exports.submitJobChange = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const prisma_1 = __importDefault(require("../config/prisma"));
const JobChangeRequest_1 = __importDefault(require("../models/JobChangeRequest"));
const submitJobChange = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        const { currentCompany, currentDesignation, currentCTC, expectedCTC, noticePeriod, reason } = req.body;
        const userId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || ((_c = (_b = req.user) === null || _b === void 0 ? void 0 : _b._id) === null || _c === void 0 ? void 0 : _c.toString());
        if (prisma_1.default) {
            try {
                const jc = yield prisma_1.default.jobChangeRequest.create({
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
                return res.status(201).json(Object.assign(Object.assign({}, jc), { _id: jc.id }));
            }
            catch (e) {
                console.warn('Prisma submitJobChange warning:', e);
            }
        }
        if (mongoose_1.default.connection.readyState === 1) {
            const jobChange = new JobChangeRequest_1.default({
                currentCompany,
                currentDesignation,
                currentCTC,
                expectedCTC,
                noticePeriod,
                reason,
                requestedBy: (_d = req.user) === null || _d === void 0 ? void 0 : _d._id
            });
            const savedRequest = yield jobChange.save();
            return res.status(201).json(savedRequest);
        }
        res.status(503).json({ message: 'Service unavailable' });
    }
    catch (error) {
        res.status(500).json({ message: error.message || 'Server Error' });
    }
});
exports.submitJobChange = submitJobChange;
const getJobChangeRequests = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (prisma_1.default) {
            try {
                const requests = yield prisma_1.default.jobChangeRequest.findMany({
                    orderBy: { createdAt: 'desc' },
                    include: {
                        requestedBy: {
                            select: { id: true, firstName: true, lastName: true, email: true }
                        }
                    }
                });
                return res.json(requests.map(r => (Object.assign(Object.assign({}, r), { _id: r.id, requestedBy: r.requestedBy ? Object.assign(Object.assign({}, r.requestedBy), { _id: r.requestedBy.id }) : null }))));
            }
            catch (e) {
                console.warn('Prisma getJobChangeRequests warning:', e);
            }
        }
        if (mongoose_1.default.connection.readyState === 1) {
            const requests = yield JobChangeRequest_1.default.find().populate('requestedBy', 'firstName lastName email').sort({ createdAt: -1 });
            return res.json(requests);
        }
        res.json([]);
    }
    catch (error) {
        res.status(500).json({ message: error.message || 'Server Error' });
    }
});
exports.getJobChangeRequests = getJobChangeRequests;

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
exports.getFeedbacks = exports.submitFeedback = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const prisma_1 = __importDefault(require("../config/prisma"));
const Feedback_1 = __importDefault(require("../models/Feedback"));
const submitFeedback = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        const { rating, message } = req.body;
        const userId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || ((_c = (_b = req.user) === null || _b === void 0 ? void 0 : _b._id) === null || _c === void 0 ? void 0 : _c.toString());
        if (prisma_1.default) {
            try {
                const fb = yield prisma_1.default.feedback.create({
                    data: {
                        rating: Number(rating) || 5,
                        message: message || '',
                        submittedById: userId || null
                    }
                });
                return res.status(201).json(Object.assign(Object.assign({}, fb), { _id: fb.id }));
            }
            catch (e) {
                console.warn('Prisma submitFeedback warning:', e);
            }
        }
        if (mongoose_1.default.connection.readyState === 1) {
            const feedback = new Feedback_1.default({
                rating,
                message,
                submittedBy: (_d = req.user) === null || _d === void 0 ? void 0 : _d._id
            });
            const savedFeedback = yield feedback.save();
            return res.status(201).json(savedFeedback);
        }
        res.status(503).json({ message: 'Service unavailable' });
    }
    catch (error) {
        res.status(500).json({ message: error.message || 'Server Error' });
    }
});
exports.submitFeedback = submitFeedback;
const getFeedbacks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (prisma_1.default) {
            try {
                const feedbacks = yield prisma_1.default.feedback.findMany({
                    orderBy: { createdAt: 'desc' },
                    include: {
                        submittedBy: {
                            select: { id: true, firstName: true, lastName: true, email: true }
                        }
                    }
                });
                return res.json(feedbacks.map(f => (Object.assign(Object.assign({}, f), { _id: f.id, submittedBy: f.submittedBy ? Object.assign(Object.assign({}, f.submittedBy), { _id: f.submittedBy.id }) : null }))));
            }
            catch (e) {
                console.warn('Prisma getFeedbacks warning:', e);
            }
        }
        if (mongoose_1.default.connection.readyState === 1) {
            const feedbacks = yield Feedback_1.default.find().populate('submittedBy', 'firstName lastName email').sort({ createdAt: -1 });
            return res.json(feedbacks);
        }
        res.json([]);
    }
    catch (error) {
        res.status(500).json({ message: error.message || 'Server Error' });
    }
});
exports.getFeedbacks = getFeedbacks;

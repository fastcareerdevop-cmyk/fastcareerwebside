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
exports.getReferrals = exports.submitReferral = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const prisma_1 = __importDefault(require("../config/prisma"));
const Referral_1 = __importDefault(require("../models/Referral"));
const submitReferral = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        const { friendName, friendEmail, friendPhone } = req.body;
        let resumeUrl = '';
        if (req.file) {
            resumeUrl = req.file.path.startsWith('http')
                ? req.file.path
                : `/uploads/${req.file.filename}`;
        }
        const userId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || ((_c = (_b = req.user) === null || _b === void 0 ? void 0 : _b._id) === null || _c === void 0 ? void 0 : _c.toString());
        if (prisma_1.default) {
            try {
                const ref = yield prisma_1.default.referral.create({
                    data: {
                        friendName: friendName || '',
                        friendEmail: (friendEmail || '').toLowerCase().trim(),
                        friendPhone: friendPhone || '',
                        resumeUrl: resumeUrl || '',
                        referredById: userId || null
                    }
                });
                return res.status(201).json(Object.assign(Object.assign({}, ref), { _id: ref.id }));
            }
            catch (e) {
                console.warn('Prisma submitReferral warning:', e);
            }
        }
        if (mongoose_1.default.connection.readyState === 1) {
            const referral = new Referral_1.default({
                friendName,
                friendEmail,
                friendPhone,
                resumeUrl,
                referredBy: (_d = req.user) === null || _d === void 0 ? void 0 : _d._id
            });
            const savedReferral = yield referral.save();
            return res.status(201).json(savedReferral);
        }
        res.status(503).json({ message: 'Service unavailable' });
    }
    catch (error) {
        res.status(500).json({ message: error.message || 'Server Error' });
    }
});
exports.submitReferral = submitReferral;
const getReferrals = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (prisma_1.default) {
            try {
                const refs = yield prisma_1.default.referral.findMany({
                    orderBy: { createdAt: 'desc' },
                    include: {
                        referredBy: {
                            select: { id: true, firstName: true, lastName: true, email: true }
                        }
                    }
                });
                return res.json(refs.map(r => (Object.assign(Object.assign({}, r), { _id: r.id, referredBy: r.referredBy ? Object.assign(Object.assign({}, r.referredBy), { _id: r.referredBy.id }) : null }))));
            }
            catch (e) {
                console.warn('Prisma getReferrals warning:', e);
            }
        }
        if (mongoose_1.default.connection.readyState === 1) {
            const referrals = yield Referral_1.default.find().populate('referredBy', 'firstName lastName email').sort({ createdAt: -1 });
            return res.json(referrals);
        }
        res.json([]);
    }
    catch (error) {
        res.status(500).json({ message: error.message || 'Server Error' });
    }
});
exports.getReferrals = getReferrals;

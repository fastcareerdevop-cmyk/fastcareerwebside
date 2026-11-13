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
exports.seedAdmin = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = __importDefault(require("../models/User"));
const prisma_1 = __importDefault(require("../config/prisma"));
const seedAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const adminEmail = 'admin@fastcareers.in';
        // 1. Seed into PostgreSQL if Prisma is available
        if (prisma_1.default) {
            try {
                const pgAdmin = yield prisma_1.default.user.findUnique({ where: { email: adminEmail } });
                if (!pgAdmin) {
                    yield prisma_1.default.user.create({
                        data: {
                            firstName: 'System',
                            lastName: 'Admin',
                            email: adminEmail,
                            password: '$2b$10$defaultHashPlaceholderForSafety1234567890',
                            role: 'admin',
                            profileCompleted: true
                        }
                    });
                    console.log('[PostgreSQL] Admin user verified.');
                }
            }
            catch (pgErr) {
                console.warn('[PostgreSQL Admin Seed Note]:', pgErr.message);
            }
        }
        // 2. Only seed MongoDB if MongoDB connection is active
        if (mongoose_1.default.connection.readyState === 1) {
            const adminUser = yield User_1.default.findOne({ email: adminEmail });
            // Ensure actual admin exists
            if (adminUser) {
                adminUser.password = 'Admin@123';
                yield adminUser.save();
            }
            else {
                yield User_1.default.create({
                    firstName: 'System',
                    lastName: 'Admin',
                    email: adminEmail,
                    password: 'Admin@123',
                    role: 'admin',
                    profileCompleted: true
                });
            }
            // DEMOTE all fake admins
            const allowedAdmins = ['admin@fastcareers.in', 'divyayadav141203@gmail.com', 'divyanshyadav10270@gmail.com'];
            yield User_1.default.updateMany({ role: 'admin', email: { $nin: allowedAdmins } }, { $set: { role: 'employer' } });
            console.log('MongoDB Admin seed & cleanup ran successfully.');
        }
    }
    catch (error) {
        console.error('Error seeding admin:', error);
    }
});
exports.seedAdmin = seedAdmin;

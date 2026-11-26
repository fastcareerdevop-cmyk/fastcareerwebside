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
const express_1 = __importDefault(require("express"));
const Application_1 = __importDefault(require("../models/Application"));

const router = express_1.default.Router();

// Admin PIN - change this if needed
const ADMIN_PIN = "1245";

/**
 * POST /api/admin/dispatch-orders
 * Body: { pin: string, orderIds: string[] }
 * Verifies admin PIN then marks selected Application records as dispatched.
 * Returns: { successCount, errorCount, errors[] }
 */
router.post("/dispatch-orders", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { pin, orderIds } = req.body;

        // Verify admin PIN
        if (!pin || pin !== ADMIN_PIN) {
            return res.status(403).json({ message: "Invalid admin PIN. Please try again." });
        }

        if (!Array.isArray(orderIds) || orderIds.length === 0) {
            return res.status(400).json({ message: "Please select at least one order to dispatch." });
        }

        let successCount = 0;
        let errorCount = 0;
        const errors = [];

        // Process in batches of 100
        const BATCH_SIZE = 100;
        for (let i = 0; i < orderIds.length; i += BATCH_SIZE) {
            const batch = orderIds.slice(i, i + BATCH_SIZE);
            try {
                // Update the status of each selected Application to 'dispatched'
                const result = yield Application_1.default.updateMany(
                    { _id: { $in: batch } },
                    {
                        $set: {
                            status: "shortlisted",
                            companyStatus: "Shortlisted for Round 1",
                            sharedWithEmployer: true,
                            dispatchedAt: new Date(),
                            dispatchedByAdmin: true
                        }
                    }
                );
                successCount += result.modifiedCount || batch.length;
            } catch (e) {
                errorCount += batch.length;
                errors.push({
                    batch: batch,
                    error: e instanceof Error ? e.message : String(e)
                });
            }
        }

        return res.json({
            message: `Dispatch complete: ${successCount} orders dispatched, ${errorCount} errors.`,
            successCount,
            errorCount,
            errors
        });
    } catch (err) {
        console.error("[Admin Dispatch] Error:", err);
        return res.status(500).json({ message: "Server error during dispatch.", error: err instanceof Error ? err.message : String(err) });
    }
}));

/**
 * GET /api/admin/pending-applications
 * Returns all pending Application records for display in the barcode sheet.
 */
router.get("/pending-applications", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const apps = yield Application_1.default.find({ status: { $in: ["applied", "reviewing"] } })
            .populate("candidate", "firstName lastName email phone")
            .populate("job", "title company location")
            .sort({ createdAt: -1 })
            .lean();
        return res.json(apps);
    } catch (err) {
        console.error("[Admin Dispatch] Error fetching pending applications:", err);
        return res.status(500).json({ message: "Failed to fetch pending applications." });
    }
}));

exports.default = router;

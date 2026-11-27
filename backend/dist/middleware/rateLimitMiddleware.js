"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.otpRateLimiter = exports.authRateLimiter = exports.createRateLimiter = void 0;
/**
 * Lightweight in-memory IP rate limiter for auth, OTP, and contact endpoints.
 */
const createRateLimiter = ({ windowMs, max, message = 'Too many requests. Please try again later.', }) => {
    const hits = new Map();
    // Periodically prune expired entries to prevent unbounded memory growth
    const cleanupTimer = setInterval(() => {
        const now = Date.now();
        for (const [key, record] of hits.entries()) {
            if (now > record.resetAt) {
                hits.delete(key);
            }
        }
    }, Math.max(windowMs, 60000));
    if (cleanupTimer.unref)
        cleanupTimer.unref();
    return (req, res, next) => {
        var _a, _b;
        const forwarded = req.headers['x-forwarded-for'];
        const ip = ((_a = (Array.isArray(forwarded) ? forwarded[0] : forwarded === null || forwarded === void 0 ? void 0 : forwarded.split(',')[0])) === null || _a === void 0 ? void 0 : _a.trim()) ||
            req.ip ||
            ((_b = req.socket) === null || _b === void 0 ? void 0 : _b.remoteAddress) ||
            'unknown';
        const now = Date.now();
        const record = hits.get(ip);
        if (!record || now > record.resetAt) {
            hits.set(ip, { count: 1, resetAt: now + windowMs });
            return next();
        }
        if (record.count >= max) {
            return res.status(429).json({ message });
        }
        record.count += 1;
        return next();
    };
};
exports.createRateLimiter = createRateLimiter;
exports.authRateLimiter = (0, exports.createRateLimiter)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 30,
    message: 'Too many authentication attempts. Please try again in 15 minutes.',
});
exports.otpRateLimiter = (0, exports.createRateLimiter)({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 15,
    message: 'Too many OTP requests. Please wait a few minutes before trying again.',
});

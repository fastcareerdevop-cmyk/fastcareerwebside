import { Request, Response, NextFunction } from 'express';

interface RateLimitOptions {
  windowMs: number;
  max: number;
  message?: string;
}

interface HitRecord {
  count: number;
  resetAt: number;
}

/**
 * Lightweight in-memory IP rate limiter for auth, OTP, and contact endpoints.
 */
export const createRateLimiter = ({
  windowMs,
  max,
  message = 'Too many requests. Please try again later.',
}: RateLimitOptions) => {
  const hits = new Map<string, HitRecord>();

  // Periodically prune expired entries to prevent unbounded memory growth
  const cleanupTimer = setInterval(() => {
    const now = Date.now();
    for (const [key, record] of hits.entries()) {
      if (now > record.resetAt) {
        hits.delete(key);
      }
    }
  }, Math.max(windowMs, 60_000));
  if (cleanupTimer.unref) cleanupTimer.unref();

  return (req: Request, res: Response, next: NextFunction) => {
    const forwarded = req.headers['x-forwarded-for'];
    const ip =
      (Array.isArray(forwarded) ? forwarded[0] : forwarded?.split(',')[0])?.trim() ||
      req.ip ||
      req.socket?.remoteAddress ||
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

export const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30,
  message: 'Too many authentication attempts. Please try again in 15 minutes.',
});

export const otpRateLimiter = createRateLimiter({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 15,
  message: 'Too many OTP requests. Please wait a few minutes before trying again.',
});

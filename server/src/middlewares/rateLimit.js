const buckets = new Map();

/** Simple per-process limiter for public endpoints. Use a shared store before horizontal scaling. */
export const rateLimit = ({ windowMs = 15 * 60 * 1000, max = 30, message = 'Terlalu banyak permintaan. Coba lagi beberapa saat.' } = {}) => {
  return (req, res, next) => {
    const now = Date.now();
    if (buckets.size > 5000) {
      for (const [bucketKey, bucket] of buckets) {
        if (bucket.resetAt <= now) buckets.delete(bucketKey);
      }
    }
    const key = `${req.ip}:${req.baseUrl}${req.path}`;
    const current = buckets.get(key);
    if (!current || current.resetAt <= now) {
      buckets.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }
    current.count += 1;
    if (current.count > max) {
      res.setHeader('Retry-After', Math.ceil((current.resetAt - now) / 1000));
      return res.status(429).json({ status: 'fail', message });
    }
    return next();
  };
};

export default rateLimit;

import jwt from 'jsonwebtoken';

export const adminAuth = (req, res, next) => {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    return res.status(503).json({
      status: 'error',
      message: 'Autentikasi admin belum dikonfigurasi. Hubungi pengelola sistem.',
    });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      status: 'fail',
      message: 'Akses ditolak: token autentikasi admin tidak ditemukan',
    });
  }

  const token = authHeader.slice('Bearer '.length).trim();
  try {
    const decoded = jwt.verify(token, secret, { algorithms: ['HS256'] });
    if (decoded.role !== 'admin') {
      return res.status(403).json({ status: 'fail', message: 'Akses khusus admin diperlukan' });
    }
    req.admin = decoded;
    return next();
  } catch {
    return res.status(401).json({
      status: 'fail',
      message: 'Sesi login admin kedaluwarsa atau tidak valid',
    });
  }
};

export default { adminAuth };

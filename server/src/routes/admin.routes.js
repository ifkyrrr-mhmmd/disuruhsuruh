import { Router } from 'express';
import {
  adminLogin,
  getOrders,
  getOrderStats,
  approveOrder,
  updateStatus,
  exportOrdersCsv,
  createManualOrder,
} from '../controllers/admin.controller.js';
import {
  requestRefund,
  getRefunds,
  completeRefund,
} from '../controllers/refund.controller.js';
import { adminAuth } from '../middlewares/auth.js';
import { rateLimit } from '../middlewares/rateLimit.js';

const router = Router();

// Public Auth
router.post('/admin/login', rateLimit({ max: 8, message: 'Terlalu banyak percobaan login. Coba lagi 15 menit.' }), adminLogin);

// Customer Facing Refund Submission
router.post('/orders/:nanoId/refund-request', rateLimit({ max: 5 }), requestRefund);

// Protected Admin Routes
router.use('/admin', adminAuth);

router.get('/admin/stats', getOrderStats);
router.get('/admin/orders', getOrders);
router.post('/admin/orders', createManualOrder);
router.patch('/admin/orders/:id/approve', approveOrder);
router.patch('/admin/orders/:id/status', updateStatus);
router.get('/admin/export', exportOrdersCsv);

// Refund management
router.get('/admin/refunds', getRefunds);
router.patch('/admin/refunds/:id/complete', completeRefund);

export default router;

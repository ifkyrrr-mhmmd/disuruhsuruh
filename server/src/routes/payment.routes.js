import { Router } from 'express';
import { handleMidtransNotification } from '../controllers/payment.controller.js';
import { rateLimit } from '../middlewares/rateLimit.js';

const router = Router();

router.post('/payments/notification', rateLimit({ max: 120, windowMs: 60 * 1000 }), handleMidtransNotification);

export default router;

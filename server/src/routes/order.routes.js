import { Router } from 'express';
import { createOrder, getOrderByNanoId, cancelOrderByCustomer } from '../controllers/order.controller.js';
import { validate } from '../middlewares/validate.js';
import { createOrderSchema } from '../schemas/order.schema.js';
import { rateLimit } from '../middlewares/rateLimit.js';

const router = Router();

router.post('/orders', rateLimit({ max: 10, message: 'Terlalu banyak pengajuan pesanan. Coba lagi nanti.' }), validate(createOrderSchema), createOrder);
router.get('/orders/:nanoId', rateLimit({ max: 60 }), getOrderByNanoId);
router.patch('/orders/:nanoId/cancel', rateLimit({ max: 5 }), cancelOrderByCustomer);

export default router;

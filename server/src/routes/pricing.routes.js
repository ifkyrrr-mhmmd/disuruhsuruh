import { Router } from 'express';
import { estimatePricing, getRouteGeometry } from '../controllers/pricing.controller.js';
import { validate } from '../middlewares/validate.js';
import { pricingEstimateSchema } from '../schemas/pricing.schema.js';

const router = Router();

router.post('/pricing/estimate', validate(pricingEstimateSchema), estimatePricing);
router.get('/pricing/route', getRouteGeometry);

export default router;

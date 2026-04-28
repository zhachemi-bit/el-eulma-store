import { Router } from 'express';
import {
  getVendors,
  getVendorById,
  getMyVendorProfile,
  updateMyVendorProfile,
  getVendorStats,
  applyVendor,
} from '../controllers/vendor.controller.js';
import { requireVendor } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { updateVendorSchema, applyVendorSchema } from '../schemas/vendor.schema.js';

const router = Router();

// Public
router.get('/', getVendors);
router.get('/:id', getVendorById);
router.post('/apply', validate(applyVendorSchema), applyVendor);

// Vendor only
router.get('/me/profile', requireVendor, getMyVendorProfile);
router.get('/me/stats', requireVendor, getVendorStats);
router.put('/me/profile', requireVendor, validate(updateVendorSchema), updateMyVendorProfile);

export default router;

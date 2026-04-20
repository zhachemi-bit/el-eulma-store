import { Router } from 'express';
import { getTestimonials, createTestimonial } from '../controllers/testimonial.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createTestimonialSchema } from '../schemas/testimonial.schema.js';

const router = Router();

router.get('/', getTestimonials);
router.post('/', requireAuth, validate(createTestimonialSchema), createTestimonial);

export default router;

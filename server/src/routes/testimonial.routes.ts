import { Router } from 'express';
import { getTestimonials, createTestimonial, deleteTestimonial, togglePinTestimonial } from '../controllers/testimonial.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createTestimonialSchema } from '../schemas/testimonial.schema.js';

const router = Router();

router.get('/', getTestimonials);
router.post('/', requireAuth, validate(createTestimonialSchema), createTestimonial);
router.delete('/:id', requireAuth, deleteTestimonial);
router.patch('/:id/pin', requireAuth, togglePinTestimonial);

export default router;

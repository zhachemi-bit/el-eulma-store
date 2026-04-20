import { Router } from 'express';
import {
  createOrder,
  getOrdersByUser,
  getOrderById,
  cancelOrder,
} from '../controllers/order.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createOrderSchema } from '../schemas/order.schema.js';

const router = Router();

// All order routes require authentication
router.post('/', requireAuth, validate(createOrderSchema), createOrder);
router.get('/user/:userId', requireAuth, getOrdersByUser);
router.get('/:id', requireAuth, getOrderById);
router.patch('/:id/cancel', requireAuth, cancelOrder);

export default router;

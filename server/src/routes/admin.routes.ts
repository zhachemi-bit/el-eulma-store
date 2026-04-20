import { Router } from 'express';
import {
  getStats,
  getAllUsers,
  getAllOrders,
  updateOrderStatus,
  getAllVendors,
  approveVendor,
  rejectVendor,
  deleteUser,
} from '../controllers/admin.controller.js';
import { requireAdmin } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { updateOrderStatusSchema } from '../schemas/order.schema.js';

const router = Router();

// All admin routes require admin role
router.get('/stats', requireAdmin, getStats);

router.get('/users', requireAdmin, getAllUsers);
router.delete('/users/:id', requireAdmin, deleteUser);

router.get('/orders', requireAdmin, getAllOrders);
router.patch('/orders/:id/status', requireAdmin, validate(updateOrderStatusSchema), updateOrderStatus);

router.get('/vendors', requireAdmin, getAllVendors);
router.patch('/vendors/:id/approve', requireAdmin, approveVendor);
router.patch('/vendors/:id/reject', requireAdmin, rejectVendor);

export default router;

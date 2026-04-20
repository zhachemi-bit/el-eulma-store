import { Router } from 'express';
import {
  signup,
  login,
  getMe,
  updateProfile,
  getUserAddresses,
  createAddress,
  deleteAddress,
  forgotPassword,
  verifyResetKey,
  resetPassword,
} from '../controllers/user.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { signupSchema, loginSchema, addressSchema, updateProfileSchema } from '../schemas/user.schema.js';

const router = Router();

// Public
router.post('/signup', validate(signupSchema), signup);
router.post('/login', validate(loginSchema), login);
router.post('/forgot-password', forgotPassword);
router.post('/verify-reset-key', verifyResetKey);
router.post('/reset-password', resetPassword);

// Protected
router.get('/me', requireAuth, getMe);
router.put('/me', requireAuth, validate(updateProfileSchema), updateProfile);
router.get('/:userId/addresses', requireAuth, getUserAddresses);
router.post('/addresses', requireAuth, validate(addressSchema), createAddress);
router.delete('/addresses/:id', requireAuth, deleteAddress);

export default router;

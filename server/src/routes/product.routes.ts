import { Router } from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createReview,
} from '../controllers/product.controller.js';
import { requireVendor, requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createProductSchema, updateProductSchema, createReviewSchema } from '../schemas/product.schema.js';

const router = Router();

// Public
router.get('/', getProducts);
router.get('/:id', getProductById);

// Authenticated
router.post('/:id/reviews', requireAuth, validate(createReviewSchema), createReview);

// Vendor only
router.post('/', requireVendor, validate(createProductSchema), createProduct);
router.put('/:id', requireVendor, validate(updateProductSchema), updateProduct);
router.delete('/:id', requireVendor, deleteProduct);

export default router;

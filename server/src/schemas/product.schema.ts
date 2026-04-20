import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(2, 'Product name is required'),
  description: z.string().optional(),
  price: z.number().positive('Price must be positive'),
  originalPrice: z.number().positive().optional(),
  images: z.array(z.string()).default([]),
  category: z.string().min(1, 'Category is required'),
  subcategory: z.string().optional(),
  stock: z.number().int().min(0).default(0),
  specifications: z.record(z.string()).default({}),
});

export const updateProductSchema = createProductSchema.partial();

export const createReviewSchema = z.object({
  rating: z.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
  comment: z.string().optional(),
});

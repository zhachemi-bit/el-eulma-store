import { z } from 'zod';

export const createOrderSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  shippingAddressId: z.string().min(1, 'Shipping address is required'),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().positive('Quantity must be at least 1'),
        price: z.number().positive('Price must be positive'),
      })
    )
    .min(1, 'Order must have at least one item'),
  total: z.number().positive('Total must be positive'),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']),
});

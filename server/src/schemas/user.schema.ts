import { z } from 'zod';

/**
 * @description Validation schema for user and vendor registration.
 */
export const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().optional(),
  role: z.enum(['user', 'vendor']).default('user'),
  // Vendor-specific fields (only required if role is vendor)
  businessName: z.string().optional(),
  businessAddress: z.string().optional(),
  wilaya: z.string().optional(),
  registrationNumber: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

/**
 * @description Validation schema for user authentication.
 */
export const loginSchema = z.object({
  email: z.string().min(1, 'Email or Username is required'),
  password: z.string().min(1, 'Password is required'),
  role: z.enum(['user', 'vendor', 'admin']),
});

/**
 * @description Validation schema for creating/updating shipping addresses.
 */
export const addressSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  fullName: z.string().min(2, 'Full name is required'),
  phone: z.string().min(8, 'Phone number is required'),
  wilaya: z.string().min(1, 'Wilaya is required'),
  city: z.string().min(1, 'City is required'),
  address: z.string().min(5, 'Address is required'),
  postalCode: z.string().optional(),
});

/**
 * @description Validation schema for updating user profile details.
 */
export const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  phone: z.string().optional(),
  avatar: z.string().optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(6, 'New password must be at least 6 characters').optional(),
}).refine(data => {
  if (data.newPassword && !data.currentPassword) {
    return false;
  }
  return true;
}, {
  message: "Current password is required to set a new password",
  path: ["currentPassword"]
});

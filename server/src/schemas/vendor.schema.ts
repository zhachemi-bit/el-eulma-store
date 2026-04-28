import { z } from 'zod';

export const updateVendorSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  wilaya: z.string().optional(),
  description: z.string().optional(),
  logo: z.string().url().optional(),
});

export const applyVendorSchema = z.object({
  businessName: z.string().min(2),
  ownerName: z.string().min(2),
  email: z.string().email(),
  phone: z.string(),
  wilaya: z.string(),
  city: z.string(),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
  address: z.string(),
  registrationNumber: z.string(),
  description: z.string().optional(),
});

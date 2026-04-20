import { z } from 'zod';

export const updateVendorSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  wilaya: z.string().optional(),
  description: z.string().optional(),
  logo: z.string().url().optional(),
});

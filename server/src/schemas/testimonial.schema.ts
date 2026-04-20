import { z } from 'zod';

export const createTestimonialSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  location: z.string().min(2, 'Location is required'),
  quote: z.string().min(2, 'Quote must be at least 2 characters'),
  rating: z.number().min(1).max(5),
});

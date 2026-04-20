import type { Request, Response } from 'express';
import { prisma } from '../prisma.js';
import type { AuthRequest } from '../types.js';

export const getTestimonials = async (req: Request, res: Response) => {
  try {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: { createdAt: 'desc' },
      take: 6, // limits to the 6 most recent testimonials to avoid blowing out the homepage
    });
    return res.json(testimonials);
  } catch (error) {
    console.error('GetTestimonials error:', error);
    return res.status(500).json({ error: 'Failed to fetch testimonials' });
  }
};

export const createTestimonial = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { name, location, quote, rating } = req.body;

    // Optional: prevent spamming by checking if a user already submitted a testimonial
    const existing = await prisma.testimonial.findFirst({
      where: { userId }
    });

    if (existing) {
      return res.status(400).json({ error: 'You have already submitted a testimonial.' });
    }

    const testimonial = await prisma.testimonial.create({
      data: {
        name,
        location,
        quote,
        rating,
        userId
      }
    });

    return res.status(201).json(testimonial);
  } catch (error) {
    console.error('CreateTestimonial error:', error);
    return res.status(500).json({ error: 'Failed to create testimonial' });
  }
};

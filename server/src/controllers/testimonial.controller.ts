import type { Request, Response } from 'express';
import { prisma } from '../prisma.js';
import type { AuthRequest } from '../types.js';

/**
 * @swagger
 * tags:
 *   name: Testimonials
 *   description: Customer feedback and stories
 */

/**
 * @swagger
 * /testimonials:
 *   get:
 *     summary: List customer testimonials
 *     tags: [Testimonials]
 *     responses:
 *       200:
 *         description: Success
 */
export const getTestimonials = async (_req: Request, res: Response) => {
  try {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: [
        { isPinned: 'desc' },
        { createdAt: 'desc' }
      ],
      take: 20, 
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

export const deleteTestimonial = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user!.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can delete testimonials' });
    }

    const { id } = req.params;
    await prisma.testimonial.delete({ where: { id: id as string } });
    return res.json({ message: 'Testimonial deleted' });
  } catch (error) {
    console.error('DeleteTestimonial error:', error);
    return res.status(500).json({ error: 'Failed to delete testimonial' });
  }
};

export const togglePinTestimonial = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user!.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can pin testimonials' });
    }

    const { id } = req.params;
    const testimonial = await prisma.testimonial.findUnique({ where: { id: id as string } });
    
    if (!testimonial) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }

    const updated = await prisma.testimonial.update({
      where: { id: id as string },
      data: { isPinned: !testimonial.isPinned }
    });

    return res.json(updated);
  } catch (error) {
    console.error('TogglePin error:', error);
    return res.status(500).json({ error: 'Failed to toggle pin' });
  }
};

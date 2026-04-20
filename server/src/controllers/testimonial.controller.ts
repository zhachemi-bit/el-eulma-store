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

/**
 * @swagger
 * /testimonials:
 *   post:
 *     summary: Submit a new testimonial
 *     tags: [Testimonials]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, location, quote, rating]
 *             properties:
 *               name: { type: string }
 *               location: { type: string }
 *               quote: { type: string }
 *               rating: { type: integer, minimum: 1, maximum: 5 }
 *     responses:
 *       201:
 *         description: Created
 */
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

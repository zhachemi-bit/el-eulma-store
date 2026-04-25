import { Router } from 'express';
import userRoutes from './user.routes.js';
import productRoutes from './product.routes.js';
import vendorRoutes from './vendor.routes.js';
import orderRoutes from './order.routes.js';
import adminRoutes from './admin.routes.js';
import testimonialRoutes from './testimonial.routes.js';
import { prisma } from '../prisma.js';

const router = Router();

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check
 *     tags: [System]
 *     responses:
 *       200:
 *         description: Server is online
 */
router.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

/**
 * @swagger
 * /stats:
 *   get:
 *     summary: Public platform statistics
 *     tags: [System]
 *     responses:
 *       200:
 *         description: Counts for products, vendors, and delivery coverage
 */
router.get('/stats', async (_req, res) => {
  try {
    const products = await prisma.product.count();
    const vendors = await prisma.vendor.count({
      where: { status: 'approved' }
    });
    res.json({ 
      products: products > 0 ? products : 0, 
      vendors: vendors > 0 ? vendors : 0, 
      wilayas: 58,
      delivery: 48 
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

router.get('/stats/categories', async (_req, res) => {
  try {
    const counts = await prisma.product.groupBy({
      by: ['category'],
      _count: {
        _all: true
      }
    });

    const categoriesWithCount = counts.reduce((acc, curr) => {
      acc[curr.category] = curr._count._all;
      return acc;
    }, {} as Record<string, number>);

    res.json(categoriesWithCount);
  } catch (error) {
    console.error('Category stats error:', error);
    res.status(500).json({ error: 'Failed to fetch category stats' });
  }
});

router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/vendors', vendorRoutes);
router.use('/orders', orderRoutes);
router.use('/admin', adminRoutes);
router.use('/testimonials', testimonialRoutes);

export default router;

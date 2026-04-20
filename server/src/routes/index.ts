import { Router } from 'express';
import userRoutes from './user.routes.js';
import productRoutes from './product.routes.js';
import vendorRoutes from './vendor.routes.js';
import orderRoutes from './order.routes.js';
import adminRoutes from './admin.routes.js';
import testimonialRoutes from './testimonial.routes.js';
import { prisma } from '../prisma.js';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

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

router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/vendors', vendorRoutes);
router.use('/orders', orderRoutes);
router.use('/admin', adminRoutes);
router.use('/testimonials', testimonialRoutes);

export default router;

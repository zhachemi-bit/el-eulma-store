import type { Request, Response } from 'express';
import { prisma } from '../prisma.js';
import type { AuthRequest } from '../types.js';

// Parse JSON fields stored as strings in SQLite
const transformProduct = (product: any) => ({
  ...product,
  images: JSON.parse(product.images || '[]'),
  specifications: JSON.parse(product.specifications || '{}'),
  image: JSON.parse(product.images || '[]')[0] || '',
});

// GET /api/products
export const getProducts = async (req: Request, res: Response) => {
  try {
    const { category, search, limit, page = '1', vendorId } = req.query;

    const pageNum = parseInt(page as string) || 1;
    const limitNum = limit ? parseInt(limit as string) : 20;
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};
    if (category) where.category = category;
    if (vendorId) where.vendorId = vendorId;
    if (search) {
      where.OR = [
        { name: { contains: search as string } },
        { description: { contains: search as string } },
      ];
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { vendor: { select: { id: true, name: true, logo: true, rating: true, verified: true, location: true, wilaya: true, latitude: true, longitude: true } } },
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count({ where }),
    ]);

    return res.json({
      data: products.map(transformProduct),
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('GetProducts error:', error);
    return res.status(500).json({ error: 'Failed to fetch products.' });
  }
};

// GET /api/products/:id
export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params['id'] as string },
      include: {
        vendor: true,
        reviews: {
          include: {
            user: {
              select: { name: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      },
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    return res.json(transformProduct(product));
  } catch (error) {
    console.error('GetProductById error:', error);
    return res.status(500).json({ error: 'Failed to fetch product.' });
  }
};

// POST /api/products  (vendor only)
export const createProduct = async (req: AuthRequest, res: Response) => {
  try {
    const vendorId = req.user!.vendorId;

    if (!vendorId) {
      return res.status(403).json({ error: 'No vendor profile linked to your account.' });
    }

    const { name, description, price, originalPrice, images, category, subcategory, stock, specifications } = req.body;

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        originalPrice,
        images: JSON.stringify(images || []),
        category,
        subcategory,
        stock: stock || 0,
        specifications: JSON.stringify(specifications || {}),
        vendorId,
      },
      include: { vendor: true },
    });

    // Update vendor product count
    await prisma.vendor.update({
      where: { id: vendorId },
      data: { productCount: { increment: 1 } },
    });

    return res.status(201).json(transformProduct(product));
  } catch (error) {
    console.error('CreateProduct error:', error);
    return res.status(500).json({ error: 'Failed to create product.' });
  }
};

// PUT /api/products/:id  (vendor only - own products)
export const updateProduct = async (req: AuthRequest, res: Response) => {
  try {
    const product = await prisma.product.findUnique({ where: { id: req.params['id'] as string } });

    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    // Only the product's vendor or admin can update
    if (product.vendorId !== req.user!.vendorId && req.user!.role !== 'admin') {
      return res.status(403).json({ error: 'You can only update your own products.' });
    }

    const { name, description, price, originalPrice, images, category, subcategory, stock, specifications } = req.body;

    const updated = await prisma.product.update({
      where: { id: req.params['id'] as string as string },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(price && { price }),
        ...(originalPrice !== undefined && { originalPrice }),
        ...(images && { images: JSON.stringify(images) }),
        ...(category && { category }),
        ...(subcategory !== undefined && { subcategory }),
        ...(stock !== undefined && { stock }),
        ...(specifications && { specifications: JSON.stringify(specifications) }),
      },
      include: { vendor: true },
    });

    return res.json(transformProduct(updated));
  } catch (error) {
    console.error('UpdateProduct error:', error);
    return res.status(500).json({ error: 'Failed to update product.' });
  }
};

// DELETE /api/products/:id  (vendor only - own products)
export const deleteProduct = async (req: AuthRequest, res: Response) => {
  try {
    const product = await prisma.product.findUnique({ where: { id: req.params['id'] as string } });

    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    if (product.vendorId !== req.user!.vendorId && req.user!.role !== 'admin') {
      return res.status(403).json({ error: 'You can only delete your own products.' });
    }

    await prisma.product.delete({ where: { id: req.params['id'] as string as string } });

    // Update vendor product count
    await prisma.vendor.update({
      where: { id: product.vendorId },
      data: { productCount: { decrement: 1 } },
    });

    return res.json({ message: 'Product deleted.' });
  } catch (error) {
    console.error('DeleteProduct error:', error);
    return res.status(500).json({ error: 'Failed to delete product.' });
  }
};

// POST /api/products/:id/reviews (authenticated)
export const createReview = async (req: AuthRequest, res: Response) => {
  try {
    const productId = req.params['id'] as string;
    const userId = req.user!.id;
    const { rating, comment } = req.body;

    // Check if product exists
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    // Check if user already reviewed
    const existingReview = await prisma.review.findFirst({
      where: { productId, userId }
    });

    if (existingReview) {
      return res.status(400).json({ error: 'You have already reviewed this product.' });
    }

    // Create the review
    const review = await prisma.review.create({
      data: {
        rating,
        comment,
        productId,
        userId
      },
      include: {
        user: { select: { name: true } }
      }
    });

    // Recalculate average rating
    const allReviews = await prisma.review.findMany({ where: { productId } });
    const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = totalRating / allReviews.length;

    // Update product rating and review count
    await prisma.product.update({
      where: { id: productId },
      data: {
        rating: avgRating,
        reviewCount: allReviews.length
      }
    });

    return res.status(201).json(review);
  } catch (error) {
    console.error('CreateReview error:', error);
    return res.status(500).json({ error: 'Failed to create review.' });
  }
};

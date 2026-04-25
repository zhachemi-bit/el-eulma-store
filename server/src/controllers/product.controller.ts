import type { Request, Response } from 'express';
import { prisma } from '../prisma.js';
import type { AuthRequest } from '../types.js';

// Parse JSON fields stored as strings
const transformProduct = (product: any) => {
  const safeParse = (val: any, fallback: any) => {
    if (typeof val !== 'string') return val || fallback;
    try {
      return JSON.parse(val || 'null') || fallback;
    } catch (e) {
      return fallback;
    }
  };

  const images = safeParse(product.images, []);
  const specifications = safeParse(product.specifications, {});

  return {
    ...product,
    images,
    specifications,
    image: images[0] || '',
  };
};

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product catalog management
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: List all products with filtering and pagination
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *     responses:
 *       200:
 *         description: Success
 */
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

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get a single product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Product not found
 */
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

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product (Vendors only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, price, category]
 *             properties:
 *               name: { type: string }
 *               description: { type: string }
 *               price: { type: number }
 *               originalPrice: { type: number }
 *               images: { type: array, items: { type: string } }
 *               category: { type: string }
 *               subcategory: { type: string }
 *               stock: { type: integer }
 *               specifications: { type: object }
 *     responses:
 *       201:
 *         description: Created
 *       403:
 *         description: Forbidden (Not a vendor)
 */
export const createProduct = async (req: AuthRequest, res: Response) => {
  try {
    const vendorId = req.user!.vendorId;

    if (!vendorId) {
      return res.status(403).json({ error: 'No vendor profile linked to your account.' });
    }

    const { name, description, price, originalPrice, images, category, subcategory, stock, specifications, minOrderQuantity } = req.body;

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
        minOrderQuantity: parseInt(minOrderQuantity as any) || 1,
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

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update an existing product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               description: { type: string }
 *               price: { type: number }
 *               originalPrice: { type: number }
 *               images: { type: array, items: { type: string } }
 *               category: { type: string }
 *               subcategory: { type: string }
 *               stock: { type: integer }
 *               specifications: { type: object }
 *     responses:
 *       200:
 *         description: Updated
 *       403:
 *         description: Forbidden (Not owner or admin)
 */
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

    const { name, description, price, originalPrice, images, category, subcategory, stock, specifications, minOrderQuantity } = req.body;

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
        ...(minOrderQuantity !== undefined && { minOrderQuantity: parseInt(minOrderQuantity as any) }),
      },
      include: { vendor: true },
    });

    return res.json(transformProduct(updated));
  } catch (error) {
    console.error('UpdateProduct error:', error);
    return res.status(500).json({ error: 'Failed to update product.' });
  }
};

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Deleted
 *       403:
 *         description: Forbidden
 */
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

/**
 * @swagger
 * /products/{id}/reviews:
 *   post:
 *     summary: Create a product review
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [rating]
 *             properties:
 *               rating: { type: integer, minimum: 1, maximum: 5 }
 *               comment: { type: string }
 *     responses:
 *       201:
 *         description: Review created
 */
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

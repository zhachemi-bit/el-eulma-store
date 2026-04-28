import type { Request, Response } from 'express';
import { prisma } from '../prisma.js';
import type { AuthRequest } from '../types.js';

/**
 * @swagger
 * tags:
 *   name: Vendors
 *   description: Vendor directory and profile management
 */

/**
 * @swagger
 * /vendors:
 *   get:
 *     summary: List all approved vendors
 *     tags: [Vendors]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Success
 */
export const getVendors = async (req: Request, res: Response) => {
  try {
    const { status = 'approved', search } = req.query;

    const where: any = { status };
    if (search) {
      where.name = { contains: search as string };
    }

    const vendors = await prisma.vendor.findMany({
      where,
      orderBy: { rating: 'desc' },
    });

    return res.json(vendors);
  } catch (error) {
    console.error('GetVendors error:', error);
    return res.status(500).json({ error: 'Failed to fetch vendors.' });
  }
};

/**
 * @swagger
 * /vendors/{id}:
 *   get:
 *     summary: Get vendor profile by ID
 *     tags: [Vendors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Vendor not found
 */
export const getVendorById = async (req: Request, res: Response) => {
  try {
    const vendor = await prisma.vendor.findUnique({
      where: { id: req.params['id'] as string },
      include: {
        products: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!vendor) {
      return res.status(404).json({ error: 'Vendor not found.' });
    }

    // Parse product JSON fields
    const vendorWithProducts = {
      ...vendor,
      products: vendor.products.map((p) => ({
        ...p,
        images: JSON.parse(p.images || '[]'),
        specifications: JSON.parse(p.specifications || '{}'),
        image: JSON.parse(p.images || '[]')[0] || '',
      })),
    };

    return res.json(vendorWithProducts);
  } catch (error) {
    console.error('GetVendorById error:', error);
    return res.status(500).json({ error: 'Failed to fetch vendor.' });
  }
};

/**
 * @swagger
 * /vendors/me/profile:
 *   get:
 *     summary: Get my vendor profile (Vendors only)
 *     tags: [Vendors]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 */
export const getMyVendorProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user!.vendorId) {
      return res.status(404).json({ error: 'No vendor profile linked to your account.' });
    }

    const vendor = await prisma.vendor.findUnique({
      where: { id: req.user!.vendorId },
      include: { products: { orderBy: { createdAt: 'desc' } } },
    });

    if (!vendor) {
      return res.status(404).json({ error: 'Vendor profile not found.' });
    }

    return res.json(vendor);
  } catch (error) {
    console.error('GetMyVendorProfile error:', error);
    return res.status(500).json({ error: 'Failed to fetch vendor profile.' });
  }
};

/**
 * @swagger
 * /vendors/me/profile:
 *   put:
 *     summary: Update my vendor profile (Vendors only)
 *     tags: [Vendors]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               phone: { type: string }
 *               location: { type: string }
 *               wilaya: { type: string }
 *               description: { type: string }
 *               logo: { type: string }
 *     responses:
 *       200:
 *         description: Updated
 */
export const updateMyVendorProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user!.vendorId) {
      return res.status(404).json({ error: 'No vendor profile linked to your account.' });
    }

    const { name, phone, location, wilaya, description, logo } = req.body;

    const updated = await prisma.vendor.update({
      where: { id: req.user!.vendorId },
      data: {
        ...(name && { name }),
        ...(phone !== undefined && { phone }),
        ...(location !== undefined && { location }),
        ...(wilaya !== undefined && { wilaya }),
        ...(description !== undefined && { description }),
        ...(logo !== undefined && { logo }),
      },
    });

    return res.json(updated);
  } catch (error) {
    console.error('UpdateMyVendorProfile error:', error);
    return res.status(500).json({ error: 'Failed to update vendor profile.' });
  }
};

/**
 * @swagger
 * /vendors/me/stats:
 *   get:
 *     summary: Get my dashboard stats (Vendors only)
 *     tags: [Vendors]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 */
export const getVendorStats = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user!.vendorId) {
      return res.status(404).json({ error: 'No vendor profile linked to your account.' });
    }

    const vendorId = req.user!.vendorId;

    const [totalProducts, totalOrders, recentOrders] = await Promise.all([
      prisma.product.count({ where: { vendorId } }),
      prisma.orderItem.aggregate({
        where: { product: { vendorId } },
        _sum: { price: true },
        _count: { id: true },
      }),
      prisma.orderItem.findMany({
        where: { product: { vendorId } },
        include: {
          order: { include: { user: { select: { name: true, email: true } }, shippingAddress: true } },
          product: { select: { name: true, images: true } },
        },
        orderBy: { order: { createdAt: 'desc' } },
        take: 10,
      }),
    ]);

    return res.json({
      totalProducts,
      totalRevenue: totalOrders._sum.price || 0,
      totalOrderItems: totalOrders._count.id || 0,
      recentOrders,
    });
  } catch (error) {
    console.error('GetVendorStats error:', error);
    return res.status(500).json({ error: 'Failed to fetch stats.' });
  }
};

/**
 * @swagger
 * /vendors/apply:
 *   post:
 *     summary: Submit a vendor application
 *     tags: [Vendors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [businessName, ownerName, email, phone, wilaya, city, address, registrationNumber]
 *             properties:
 *               businessName: { type: string }
 *               ownerName: { type: string }
 *               email: { type: string }
 *               phone: { type: string }
 *               wilaya: { type: string }
 *               city: { type: string }
 *               latitude: { type: number }
 *               longitude: { type: number }
 *               address: { type: string }
 *               registrationNumber: { type: string }
 *               description: { type: string }
 *     responses:
 *       201:
 *         description: Application submitted
 *       400:
 *         description: Email already exists
 */
export const applyVendor = async (req: Request, res: Response) => {
  try {
    const {
      businessName,
      ownerName,
      email,
      phone,
      wilaya,
      city,
      latitude,
      longitude,
      address,
      registrationNumber,
      description,
    } = req.body;

    // Check if vendor with this email already exists
    const existingVendor = await prisma.vendor.findUnique({
      where: { email },
    });

    if (existingVendor) {
      return res.status(400).json({ error: 'An application with this email already exists.' });
    }

    const vendor = await prisma.vendor.create({
      data: {
        name: businessName,
        email,
        phone,
        location: `${address}, ${city}`,
        wilaya,
        latitude,
        longitude,
        registrationNumber,
        description: description ? `${description}\n\nOwner: ${ownerName}` : `Owner: ${ownerName}`,
        status: 'pending',
      },
    });

    return res.status(201).json({ 
      message: 'Application submitted successfully', 
      vendor: {
        id: vendor.id,
        name: vendor.name,
        email: vendor.email,
        status: vendor.status
      }
    });
  } catch (error) {
    console.error('ApplyVendor error:', error);
    return res.status(500).json({ error: 'Failed to submit application.' });
  }
};

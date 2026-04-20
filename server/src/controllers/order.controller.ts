import type { Response } from 'express';
import { prisma } from '../prisma.js';
import type { AuthRequest } from '../types.js';

// POST /api/orders
export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    const { userId, items, total, shippingAddressId } = req.body;

    // Only allow users to create orders for themselves (unless admin)
    if (req.user!.id !== userId && req.user!.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied.' });
    }

    // Verify address belongs to user
    const address = await prisma.address.findUnique({ where: { id: shippingAddressId } });
    if (!address || address.userId !== userId) {
      return res.status(400).json({ error: 'Invalid shipping address.' });
    }

    // Verify all products exist and have enough stock
    for (const item of items) {
      const product = await prisma.product.findUnique({ where: { id: item.productId } });
      if (!product) {
        return res.status(400).json({ error: `Product ${item.productId} not found.` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ error: `Not enough stock for "${product.name}". Available: ${product.stock}` });
      }
    }

    // Create the order
    const order = await prisma.order.create({
      data: {
        userId,
        total,
        shippingAddressId,
        items: {
          create: items.map((item: { productId: string; quantity: number; price: number }) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: { include: { product: { select: { name: true, images: true } } } },
        shippingAddress: true,
      },
    });

    // Decrease stock for each product
    for (const item of items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    return res.status(201).json(order);
  } catch (error) {
    console.error('CreateOrder error:', error);
    return res.status(500).json({ error: 'Failed to create order.' });
  }
};

// GET /api/orders/user/:userId
export const getOrdersByUser = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user!.id !== req.params['userId'] as string && req.user!.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied.' });
    }

    const orders = await prisma.order.findMany({
      where: { userId: req.params['userId'] as string as string },
      include: {
        items: { include: { product: { select: { id: true, name: true, images: true } } } },
        shippingAddress: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.json(orders);
  } catch (error) {
    console.error('GetOrdersByUser error:', error);
    return res.status(500).json({ error: 'Failed to fetch orders.' });
  }
};

// GET /api/orders/:id
export const getOrderById = async (req: AuthRequest, res: Response) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params['id'] as string as string },
      include: {
        items: { include: { product: true } },
        shippingAddress: true,
        user: { select: { id: true, name: true, email: true, phone: true } },
      },
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    // Only the order owner or admin can view
    if (order.userId !== req.user!.id && req.user!.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied.' });
    }

    return res.json(order);
  } catch (error) {
    console.error('GetOrderById error:', error);
    return res.status(500).json({ error: 'Failed to fetch order.' });
  }
};

// PATCH /api/orders/:id/cancel
export const cancelOrder = async (req: AuthRequest, res: Response) => {
  try {
    const order = await prisma.order.findUnique({ where: { id: req.params['id'] as string as string } });

    if (!order) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    if (order.userId !== req.user!.id && req.user!.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied.' });
    }

    if (!['pending', 'confirmed'].includes(order.status)) {
      return res.status(400).json({ error: `Cannot cancel an order with status "${order.status}".` });
    }

    const updated = await prisma.order.update({
      where: { id: req.params['id'] as string as string },
      data: { status: 'cancelled' },
    });

    return res.json(updated);
  } catch (error) {
    console.error('CancelOrder error:', error);
    return res.status(500).json({ error: 'Failed to cancel order.' });
  }
};

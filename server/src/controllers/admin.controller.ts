import type { Response } from 'express';
import { prisma } from '../prisma.js';
import type { AuthRequest } from '../types.js';

// GET /api/admin/stats
export const getStats = async (_req: AuthRequest, res: Response) => {
  try {
    const [totalUsers, totalVendors, totalProducts, totalOrders, pendingVendors, revenue] = await Promise.all([
      prisma.user.count(),
      prisma.vendor.count({ where: { status: 'approved' } }),
      prisma.product.count(),
      prisma.order.count(),
      prisma.vendor.count({ where: { status: 'pending' } }),
      prisma.order.aggregate({
        where: { status: { not: 'cancelled' } },
        _sum: { total: true },
      }),
    ]);

    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, email: true } },
        items: true,
      },
    });

    return res.json({
      totalUsers,
      totalVendors,
      totalProducts,
      totalOrders,
      pendingVendors,
      totalRevenue: revenue._sum.total || 0,
      recentOrders,
    });
  } catch (error) {
    console.error('GetStats error:', error);
    return res.status(500).json({ error: 'Failed to fetch stats.' });
  }
};

// GET /api/admin/users
export const getAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    const { role, search, page = '1' } = req.query;
    const pageNum = parseInt(page as string) || 1;
    const limit = 20;
    const skip = (pageNum - 1) * limit;

    const where: any = {};
    if (role) where.role = role;
    if (search) {
      where.OR = [{ name: { contains: search as string } }, { email: { contains: search as string } }];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: { id: true, email: true, name: true, phone: true, role: true, vendorId: true, createdAt: true },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ]);

    return res.json({ data: users, pagination: { total, page: pageNum, limit, totalPages: Math.ceil(total / limit) } });
  } catch (error) {
    console.error('GetAllUsers error:', error);
    return res.status(500).json({ error: 'Failed to fetch users.' });
  }
};

// GET /api/admin/orders
export const getAllOrders = async (req: AuthRequest, res: Response) => {
  try {
    const { status, page = '1' } = req.query;
    const pageNum = parseInt(page as string) || 1;
    const limit = 20;
    const skip = (pageNum - 1) * limit;

    const where: any = {};
    if (status) where.status = status;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          user: { select: { name: true, email: true } },
          items: { include: { product: { select: { name: true } } } },
          shippingAddress: true,
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.order.count({ where }),
    ]);

    return res.json({ data: orders, pagination: { total, page: pageNum, limit, totalPages: Math.ceil(total / limit) } });
  } catch (error) {
    console.error('GetAllOrders error:', error);
    return res.status(500).json({ error: 'Failed to fetch orders.' });
  }
};

// PATCH /api/admin/orders/:id/status
export const updateOrderStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body;

    const order = await prisma.order.findUnique({ where: { id: req.params['id'] as string as string } });
    if (!order) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    const updated = await prisma.order.update({
      where: { id: req.params['id'] as string as string },
      data: { status },
      include: { items: true, shippingAddress: true },
    });

    return res.json(updated);
  } catch (error) {
    console.error('UpdateOrderStatus error:', error);
    return res.status(500).json({ error: 'Failed to update order status.' });
  }
};

// GET /api/admin/vendors
export const getAllVendors = async (req: AuthRequest, res: Response) => {
  try {
    const { status, search } = req.query;

    const where: any = {};
    if (status) where.status = status;
    if (search) where.name = { contains: search as string };

    const vendors = await prisma.vendor.findMany({
      where,
      include: {
        user: {
          select: {
            avatar: true,
            name: true,
            email: true,
            phone: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.json(vendors);
  } catch (error) {
    console.error('GetAllVendors error:', error);
    return res.status(500).json({ error: 'Failed to fetch vendors.' });
  }
};

// PATCH /api/admin/vendors/:id/approve
export const approveVendor = async (req: AuthRequest, res: Response) => {
  try {
    const vendor = await prisma.vendor.findUnique({ where: { id: req.params['id'] as string } });
    if (!vendor) {
      return res.status(404).json({ error: 'Vendor not found.' });
    }

    const updated = await prisma.vendor.update({
      where: { id: req.params['id'] as string },
      data: { status: 'approved', verified: true },
    });

    return res.json({ message: 'Vendor approved.', vendor: updated });
  } catch (error) {
    console.error('ApproveVendor error:', error);
    return res.status(500).json({ error: 'Failed to approve vendor.' });
  }
};

// PATCH /api/admin/vendors/:id/reject
export const rejectVendor = async (req: AuthRequest, res: Response) => {
  try {
    const vendor = await prisma.vendor.findUnique({ where: { id: req.params['id'] as string } });
    if (!vendor) {
      return res.status(404).json({ error: 'Vendor not found.' });
    }

    const updated = await prisma.vendor.update({
      where: { id: req.params['id'] as string },
      data: { status: 'rejected' },
    });

    return res.json({ message: 'Vendor rejected.', vendor: updated });
  } catch (error) {
    console.error('RejectVendor error:', error);
    return res.status(500).json({ error: 'Failed to reject vendor.' });
  }
};

// DELETE /api/admin/users/:id
export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.params['id'] as string as string } });
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    if (user.role === 'admin') {
      return res.status(400).json({ error: 'Cannot delete an admin account.' });
    }

    await prisma.user.delete({ where: { id: req.params['id'] as string as string } });
    return res.json({ message: 'User deleted.' });
  } catch (error) {
    console.error('DeleteUser error:', error);
    return res.status(500).json({ error: 'Failed to delete user.' });
  }
};

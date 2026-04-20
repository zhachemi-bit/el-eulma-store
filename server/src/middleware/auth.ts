import type { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import type { AuthRequest, JwtPayload } from '../types.js';

const JWT_SECRET = process.env['JWT_SECRET'] || 'fallback-secret';

// Require a valid JWT token
export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'No token provided. Please login.' });
    return;
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'Invalid token format.' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Token is invalid or expired. Please login again.' });
  }
};

// Require admin role
export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  requireAuth(req, res, () => {
    if (req.user?.role !== 'admin') {
      res.status(403).json({ error: 'Access denied. Admin only.' });
      return;
    }
    next();
  });
};

// Require vendor role
export const requireVendor = (req: AuthRequest, res: Response, next: NextFunction): void => {
  requireAuth(req, res, () => {
    if (req.user?.role !== 'vendor' && req.user?.role !== 'admin') {
      res.status(403).json({ error: 'Access denied. Vendor only.' });
      return;
    }
    next();
  });
};

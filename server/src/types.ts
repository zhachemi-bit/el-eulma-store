import type { Request } from 'express';

// JWT payload
export interface JwtPayload {
  id: string;
  email: string;
  role: string;
  vendorId?: string | null;
}

// Authenticated request (has user attached by auth middleware)
export interface AuthRequest extends Request {
  user?: JwtPayload;
}

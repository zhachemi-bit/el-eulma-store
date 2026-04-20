import type { Request, Response, NextFunction } from 'express';
import type { ZodSchema } from 'zod';

// Validates req.body against a Zod schema
export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = result.error.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      }));
      res.status(400).json({ error: 'Validation failed', details: errors });
      return;
    }

    req.body = result.data;
    next();
  };
};

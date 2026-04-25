import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../prisma.js';
import type { AuthRequest } from '../types.js';
import { sendResetKeyEmail } from '../lib/email.service.js';

const JWT_SECRET = process.env['JWT_SECRET'] || 'fallback-secret';
const JWT_EXPIRES_IN = process.env['JWT_EXPIRES_IN'] || '7d';

// Generate JWT token
const generateToken = (payload: { id: string; email: string; role: string; vendorId?: string | null }) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions);
};

// Remove password from user object before returning
const sanitizeUser = (user: any) => {
  const { password: _password, ...safe } = user;
  return safe;
};

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management and authentication
 */

/**
 * @swagger
 * /users/signup:
 *   post:
 *     summary: Registers a new user or vendor
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password, name, role]
 *             properties:
 *               email: { type: string, example: user@example.com }
 *               password: { type: string, example: secret123 }
 *               name: { type: string, example: John Doe }
 *               role: { type: string, enum: [user, vendor], default: user }
 *               phone: { type: string }
 *               businessName: { type: string }
 *               wilaya: { type: string }
 *               registrationNumber: { type: string }
 *     responses:
 *       201:
 *         description: Registered successfully
 *       400:
 *         description: Bad request
 */
export const signup = async (req: Request, res: Response) => {
  try {
    const { 
      email, 
      password, 
      name, 
      phone, 
      role, 
      businessName, 
      businessAddress, 
      wilaya, 
      registrationNumber,
      latitude,
      longitude,
      avatar
    } = req.body;

    // Check if user already exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    let vendorId: string | undefined = undefined;

    // If signing up as vendor, create vendor profile (pending approval)
    if (role === 'vendor') {
      if (!businessName || !wilaya || !registrationNumber) {
        return res.status(400).json({
          error: 'Vendor registration requires: businessName, wilaya, and registrationNumber.',
        });
      }

      const vendorExists = await prisma.vendor.findUnique({ where: { email } });
      if (vendorExists) {
        return res.status(400).json({ error: 'A vendor with this email already exists.' });
      }

      const vendor = await prisma.vendor.create({
        data: {
          name: businessName,
          email,
          phone,
          location: businessAddress,
          wilaya,
          registrationNumber,
          latitude: latitude ? parseFloat(latitude.toString()) : undefined,
          longitude: longitude ? parseFloat(longitude.toString()) : undefined,
          status: 'pending',
        },
      });
      vendorId = vendor.id;
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone,
        role,
        vendorId,
        avatar,
      },
    });

    const token = generateToken({ id: user.id, email: user.email, role: user.role, vendorId: user.vendorId });

    return res.status(201).json({
      message: role === 'vendor' ? 'Vendor application submitted. Awaiting approval.' : 'Account created successfully.',
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ error: 'Failed to create account.' });
  }
};

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Authenticate user/vendor/admin
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password, role]
 *             properties:
 *               email: { type: string, example: admin@eleulmastore.dz }
 *               password: { type: string, example: admin123 }
 *               role: { type: string, enum: [user, vendor, admin], default: user }
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
export const login = async (req: Request, res: Response) => {
  try {
    const { email: identifier, password, role } = req.body;

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier },
          { name: identifier }
        ]
      }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email/username or password.' });
    }

    // Check role matches
    if (user.role !== role) {
      return res.status(401).json({ error: `This account is not registered as a ${role}.` });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // If vendor, check approval status
    if (role === 'vendor' && user.vendorId) {
      const vendor = await prisma.vendor.findUnique({ where: { id: user.vendorId } });
      if (vendor?.status === 'pending') {
        return res.status(403).json({ error: 'Your vendor application is pending approval.' });
      }
      if (vendor?.status === 'rejected') {
        return res.status(403).json({ error: 'Your vendor application has been rejected.' });
      }
    }

    const token = generateToken({ id: user.id, email: user.email, role: user.role, vendorId: user.vendorId });

    return res.json({
      message: 'Login successful.',
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Failed to login.' });
  }
};

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Get current authenticated user details
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Unauthorized
 */
export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    return res.json(sanitizeUser(user));
  } catch (error) {
    console.error('GetMe error:', error);
    return res.status(500).json({ error: 'Failed to fetch user.' });
  }
};

/**
 * @swagger
 * /users/:userId/addresses:
 *   get:
 *     summary: Get all shipping addresses for a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Success
 */
export const getUserAddresses = async (req: AuthRequest, res: Response) => {
  try {
    // Only allow users to access their own addresses (unless admin)
    if (req.user!.id !== req.params['userId'] as string && req.user!.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied.' });
    }

    const addresses = await prisma.address.findMany({
      where: { userId: req.params['userId'] as string },
    });

    return res.json(addresses);
  } catch (error) {
    console.error('GetAddresses error:', error);
    return res.status(500).json({ error: 'Failed to fetch addresses.' });
  }
};

/**
 * @swagger
 * /users/addresses:
 *   post:
 *     summary: Create a new shipping address
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId, fullName, phone, wilaya, city, address]
 *             properties:
 *               userId: { type: string }
 *               fullName: { type: string }
 *               phone: { type: string }
 *               wilaya: { type: string }
 *               city: { type: string }
 *               address: { type: string }
 *               postalCode: { type: string }
 *     responses:
 *       201:
 *         description: Created
 */
export const createAddress = async (req: AuthRequest, res: Response) => {
  try {
    const { userId, fullName, phone, wilaya, city, address, postalCode } = req.body;

    // Only allow users to create their own addresses (unless admin)
    if (req.user!.id !== userId && req.user!.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied.' });
    }

    const newAddress = await prisma.address.create({
      data: { userId, fullName, phone, wilaya, city, address, postalCode },
    });

    return res.status(201).json(newAddress);
  } catch (error) {
    console.error('CreateAddress error:', error);
    return res.status(500).json({ error: 'Failed to create address.' });
  }
};

/**
 * @swagger
 * /users/addresses/{id}:
 *   delete:
 *     summary: Delete a shipping address
 *     tags: [Users]
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
 */
export const deleteAddress = async (req: AuthRequest, res: Response) => {
  try {
    const address = await prisma.address.findUnique({ where: { id: req.params['id'] as string } });

    if (!address) {
      return res.status(404).json({ error: 'Address not found.' });
    }

    if (address.userId !== req.user!.id && req.user!.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied.' });
    }

    await prisma.address.delete({ where: { id: req.params['id'] as string } });
    return res.json({ message: 'Address deleted.' });
  } catch (error) {
    console.error('DeleteAddress error:', error);
    return res.status(500).json({ error: 'Failed to delete address.' });
  }
};

/**
 * @swagger
 * /users/me:
 *   put:
 *     summary: Update user profile or password
 *     tags: [Users]
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
 *               avatar: { type: string }
 *               currentPassword: { type: string }
 *               newPassword: { type: string }
 *     responses:
 *       200:
 *         description: Updated
 */
export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { name, phone, avatar, currentPassword, newPassword } = req.body;
    const userId = req.user!.id;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const updateData: any = {};
    if (name) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone; // allow clearing phone
    if (avatar !== undefined) updateData.avatar = avatar; // allow clearing or setting updated base64 avatar

    if (newPassword && currentPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid current password.' });
      }
      updateData.password = await bcrypt.hash(newPassword, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData
    });

    return res.json({
      message: 'Profile updated successfully',
      user: sanitizeUser(updatedUser),
    });
  } catch (error) {
    console.error('UpdateProfile error:', error);
    return res.status(500).json({ error: 'Failed to update profile.' });
  }
};

/**
 * @swagger
 * /users/forgot-password:
 *   post:
 *     summary: Request a password reset key
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email: { type: string }
 *     responses:
 *       200:
 *         description: Email sent
 */
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // For security reasons, don't reveal if user exists
      return res.json({ message: 'If an account with that email exists, we have sent a reset key.' });
    }

    // Generate a 6-digit key
    const resetKey = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 3600000); // 1 hour expiry

    await prisma.user.update({
      where: { email },
      data: {
        resetToken: resetKey,
        resetTokenExpiry: expiry,
      },
    });

    // Send the real email
    await sendResetKeyEmail(email, resetKey);

    return res.json({ 
      message: 'If an account with that email exists, we have sent a reset key.',
    });
  } catch (error) {
    console.error('ForgotPassword error:', error);
    return res.status(500).json({ error: 'Failed to process forgot password request.' });
  }
};

/**
 * @swagger
 * /users/verify-reset-key:
 *   post:
 *     summary: Verify a password reset key
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, key]
 *             properties:
 *               email: { type: string }
 *               key: { type: string }
 *     responses:
 *       200:
 *         description: Valid key
 *       400:
 *         description: Invalid or expired key
 */
export const verifyResetKey = async (req: Request, res: Response) => {
  try {
    const { email, key } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.resetToken || !user.resetTokenExpiry) {
      return res.status(400).json({ error: 'Invalid or expired reset key.' });
    }

    if (user.resetToken !== key || user.resetTokenExpiry < new Date()) {
      return res.status(400).json({ error: 'Invalid or expired reset key.' });
    }

    return res.json({ message: 'Key verified successfully.' });
  } catch (error) {
    console.error('VerifyResetKey error:', error);
    return res.status(500).json({ error: 'Failed to verify key.' });
  }
};

/**
 * @swagger
 * /users/reset-password:
 *   post:
 *     summary: Reset password using a valid key
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, key, newPassword]
 *             properties:
 *               email: { type: string }
 *               key: { type: string }
 *               newPassword: { type: string }
 *     responses:
 *       200:
 *         description: Password reset successful
 */
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, key, newPassword } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.resetToken || !user.resetTokenExpiry) {
      return res.status(400).json({ error: 'Invalid or expired reset key.' });
    }

    // Check if key matches and is not expired
    if (user.resetToken !== key || user.resetTokenExpiry < new Date()) {
      return res.status(400).json({ error: 'Invalid or expired reset key.' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and clear reset token
    await prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return res.json({ message: 'Password has been reset successfully. You can now login with your new password.' });
  } catch (error) {
    console.error('ResetPassword error:', error);
    return res.status(500).json({ error: 'Failed to reset password.' });
  }
};

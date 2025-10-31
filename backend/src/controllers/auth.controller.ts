import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export const authController = {
  async register(req: Request, res: Response) {
    try {
      const { email, password, role, ...profileData } = req.body;

      // Validar email único
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });

      if (existingUser) {
        return res.status(400).json({ error: 'Email already registered' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Crear usuario
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          role: role || 'EDTECH',
          ...(role === 'EDTECH' && {
            edtechCompany: {
              create: profileData
            }
          }),
          ...(role === 'IE' && {
            institution: {
              create: profileData
            }
          }),
          ...(role === 'CONSULTANT' && {
            consultantProfile: {
              create: profileData
            }
          })
        }
      });

      // Generar token
      const token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET!,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );

      res.status(201).json({
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role
        }
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const user = await prisma.user.findUnique({
        where: { email }
      });

      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Verificar si el usuario tiene contraseña (no es solo OAuth)
      if (!user.password) {
        return res.status(401).json({ error: 'This account uses social login. Please sign in with Google or Microsoft.' });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET!,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );

      res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role
        }
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async getCurrentUser(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          role: true,
          createdAt: true
        }
      });

      res.json(user);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async forgotPassword(req: Request, res: Response) {
    // TODO: Implementar recuperación de contraseña
    res.json({ message: 'Password recovery not implemented yet' });
  },

  async resetPassword(req: Request, res: Response) {
    // TODO: Implementar reset de contraseña
    res.json({ message: 'Password reset not implemented yet' });
  }
};


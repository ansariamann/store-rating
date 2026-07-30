import express from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../db';
import { authenticate, requireRole } from '../middleware/auth';
import { createAdminSchema } from '../validators';
import { Prisma } from '@prisma/client';

const router = express.Router();
router.use(authenticate, requireRole(['SYSTEM_ADMIN']));

router.get('/dashboard', async (req, res) => {
  try {
    const totalUsers = await prisma.user.count({ where: { role: 'NORMAL_USER' } });
    const totalStores = await prisma.user.count({ where: { role: 'STORE_OWNER' } });
    const totalRatings = await prisma.rating.count();

    res.json({ totalUsers, totalStores, totalRatings });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/users', async (req, res) => {
  try {
    const parsed = createAdminSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.issues[0].message });
    }

    const { name, email, password, address, role } = parsed.data;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, address, role: role || 'NORMAL_USER' },
    });

    res.status(201).json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/users', async (req, res) => {
  try {
    const { search, role, sortField, sortOrder } = req.query;
    
    let where: Prisma.UserWhereInput = {};
    if (role) {
      where.role = role as string;
    }
    if (search) {
      where.OR = [
        { name: { contains: search as string } }, // Removed mode: 'insensitive' because sqlite provider does not support it
        { email: { contains: search as string } },
        { address: { contains: search as string } }
      ];
    }

    let orderBy: Prisma.UserOrderByWithRelationInput = {};
    if (sortField && typeof sortField === 'string') {
      orderBy = { [sortField]: sortOrder === 'desc' ? 'desc' : 'asc' };
    } else {
      orderBy = { createdAt: 'desc' };
    }

    const users = await prisma.user.findMany({
      where,
      orderBy,
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
        ratingsReceived: {
          select: { score: true }
        }
      }
    });

    // Calculate average rating for stores
    const usersWithRatings = users.map(user => {
      let rating = null;
      if (user.role === 'STORE_OWNER') {
        const total = user.ratingsReceived.reduce((acc, curr) => acc + curr.score, 0);
        rating = user.ratingsReceived.length ? (total / user.ratingsReceived.length).toFixed(1) : '0';
      }
      const { ratingsReceived, ...rest } = user;
      return { ...rest, rating };
    });

    res.json(usersWithRatings);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

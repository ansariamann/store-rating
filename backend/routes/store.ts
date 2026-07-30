import express from 'express';
import prisma from '../db';
import { authenticate, requireRole, AuthRequest } from '../middleware/auth';
import { Prisma } from '@prisma/client';

const router = express.Router();

// Publicly available to all logged in users (normal, admin, store owner)
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const { search, sortField, sortOrder } = req.query;
    const userId = req.user!.id;

    let where: Prisma.UserWhereInput = { role: 'STORE_OWNER' };
    
    if (search) {
      where.OR = [
        { name: { contains: search as string } },
        { address: { contains: search as string } }
      ];
    }

    let orderBy: Prisma.UserOrderByWithRelationInput = {};
    if (sortField && typeof sortField === 'string') {
      orderBy = { [sortField]: sortOrder === 'desc' ? 'desc' : 'asc' };
    }

    const stores = await prisma.user.findMany({
      where,
      orderBy,
      select: {
        id: true,
        name: true,
        address: true,
        ratingsReceived: {
          select: { score: true, userId: true }
        }
      }
    });

    const storeListings = stores.map(store => {
      const total = store.ratingsReceived.reduce((acc, curr) => acc + curr.score, 0);
      const avgRating = store.ratingsReceived.length ? (total / store.ratingsReceived.length).toFixed(1) : '0';
      
      const userRatingObj = store.ratingsReceived.find(r => r.userId === userId);
      const userRating = userRatingObj ? userRatingObj.score : null;

      return {
        id: store.id,
        name: store.name,
        address: store.address,
        overallRating: avgRating,
        userRating
      };
    });

    res.json(storeListings);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Store Owner Dashboard
router.get('/dashboard', authenticate, requireRole(['STORE_OWNER']), async (req: AuthRequest, res) => {
  try {
    const storeId = req.user!.id;
    
    const ratings = await prisma.rating.findMany({
      where: { storeId },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    const total = ratings.reduce((acc, curr) => acc + curr.score, 0);
    const avgRating = ratings.length ? (total / ratings.length).toFixed(1) : '0';

    res.json({
      averageRating: avgRating,
      raters: ratings.map(r => ({ ...r.user, score: r.score }))
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Submit / Modify Rating
router.post('/:id/ratings', authenticate, requireRole(['NORMAL_USER']), async (req: AuthRequest, res) => {
  try {
    const storeId = req.params.id;
    const userId = req.user!.id;
    const { score } = req.body;

    if (typeof score !== 'number' || score < 1 || score > 5) {
      return res.status(400).json({ error: 'Score must be a number between 1 and 5' });
    }

    const store = await prisma.user.findUnique({ where: { id: storeId, role: 'STORE_OWNER' } });
    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    // Upsert rating
    const rating = await prisma.rating.upsert({
      where: {
        userId_storeId: { userId, storeId }
      },
      update: { score },
      create: { score, userId, storeId }
    });

    res.json({ message: 'Rating submitted successfully', rating });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/error.middleware';
import { AuthRequest } from '../middleware/auth.middleware';

export const getUserProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { username: req.params.username },
      select: {
        id: true,
        name: true,
        username: true,
        bio: true,
        avatar: true,
        createdAt: true,
        _count: { select: { posts: true, followers: true, following: true } },
        posts: {
          where: { status: 'PUBLISHED' },
          select: {
            id: true,
            title: true,
            slug: true,
            subtitle: true,
            thumbnail: true,
            readingTime: true,
            publishedAt: true,
            tags: true,
            _count: { select: { claps: true, views: true } },
          },
          orderBy: { publishedAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!user) throw new AppError('User not found', 404);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, bio, avatar } = req.body;
    const user = await prisma.user.update({
      where: { id: req.user!.id },
      data: { name, bio, avatar },
      select: { id: true, name: true, username: true, bio: true, avatar: true, email: true },
    });
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

export const followUser = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const targetUser = await prisma.user.findUnique({ where: { username: req.params.username } });
    if (!targetUser) throw new AppError('User not found', 404);
    if (targetUser.id === req.user!.id) throw new AppError('Cannot follow yourself', 400);

    const existing = await prisma.follow.findUnique({
      where: {
        followerId_followingId: { followerId: req.user!.id, followingId: targetUser.id },
      },
    });

    if (existing) {
      await prisma.follow.delete({ where: { id: existing.id } });
      res.status(200).json({ success: true, message: 'Unfollowed', following: false });
    } else {
      await prisma.follow.create({ data: { followerId: req.user!.id, followingId: targetUser.id } });
      res.status(200).json({ success: true, message: 'Following', following: true });
    }
  } catch (error) {
    next(error);
  }
};

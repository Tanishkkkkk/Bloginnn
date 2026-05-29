import { Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/error.middleware';
import { AuthRequest } from '../middleware/auth.middleware';

export const clapPost = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { postId, count = 1 } = req.body;
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw new AppError('Post not found', 404);

    const existingClap = await prisma.clap.findUnique({
      where: { userId_postId: { userId: req.user!.id, postId } },
    });

    if (existingClap) {
      const updated = await prisma.clap.update({
        where: { id: existingClap.id },
        data: { count: Math.min(existingClap.count + count, 50) },
      });
      res.status(200).json({ success: true, data: updated });
    } else {
      const clap = await prisma.clap.create({
        data: { userId: req.user!.id, postId, count: Math.min(count, 50) },
      });
      res.status(201).json({ success: true, data: clap });
    }
  } catch (error) {
    next(error);
  }
};

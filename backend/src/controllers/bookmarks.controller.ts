import { Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/error.middleware';
import { AuthRequest } from '../middleware/auth.middleware';

export const addBookmark = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { postId } = req.body;
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw new AppError('Post not found', 404);

    const bookmark = await prisma.bookmark.create({
      data: { userId: req.user!.id, postId },
    });
    res.status(201).json({ success: true, message: 'Bookmarked', data: bookmark });
  } catch (error: any) {
    if (error.code === 'P2002') {
      res.status(400).json({ success: false, message: 'Already bookmarked' });
      return;
    }
    next(error);
  }
};

export const removeBookmark = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const bookmark = await prisma.bookmark.findFirst({
      where: { id: req.params.id, userId: req.user!.id },
    });
    if (!bookmark) throw new AppError('Bookmark not found', 404);
    await prisma.bookmark.delete({ where: { id: req.params.id } });
    res.status(200).json({ success: true, message: 'Bookmark removed' });
  } catch (error) {
    next(error);
  }
};

export const getMyBookmarks = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const bookmarks = await prisma.bookmark.findMany({
      where: { userId: req.user!.id },
      include: {
        post: {
          select: {
            id: true,
            title: true,
            slug: true,
            subtitle: true,
            thumbnail: true,
            readingTime: true,
            publishedAt: true,
            author: { select: { name: true, username: true, avatar: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json({ success: true, data: bookmarks });
  } catch (error) {
    next(error);
  }
};

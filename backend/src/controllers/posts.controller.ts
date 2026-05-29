import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import {
  createPostService,
  getPublishedPostsService,
  getPostBySlugService,
  updatePostService,
  deletePostService,
  getUserPostsService,
  searchPostsService,
} from '../services/posts.service';

export const createPost = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const post = await createPostService(req.user!.id, req.body);
    res.status(201).json({ success: true, message: 'Post created', data: post });
  } catch (error) {
    next(error);
  }
};

export const getPosts = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const category = req.query.category as string | undefined;
    const tag = req.query.tag as string | undefined;
    const result = await getPublishedPostsService(page, limit, category, tag);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const getPostBySlug = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const post = await getPostBySlugService(req.params.slug, req.user?.id);
    res.status(200).json({ success: true, data: post });
  } catch (error) {
    next(error);
  }
};

export const updatePost = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const post = await updatePostService(req.params.id, req.user!.id, req.body);
    res.status(200).json({ success: true, message: 'Post updated', data: post });
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    await deletePostService(req.params.id, req.user!.id);
    res.status(200).json({ success: true, message: 'Post deleted' });
  } catch (error) {
    next(error);
  }
};

export const getMyPosts = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const posts = await getUserPostsService(req.user!.id);
    res.status(200).json({ success: true, data: posts });
  } catch (error) {
    next(error);
  }
};

export const searchPosts = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const query = req.query.q as string;
    if (!query) {
      res.status(400).json({ success: false, message: 'Search query required' });
      return;
    }
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const result = await searchPostsService(query, page, limit);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

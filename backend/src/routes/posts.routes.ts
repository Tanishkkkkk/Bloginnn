import { Router } from 'express';
import {
  createPost,
  getPosts,
  getPostBySlug,
  updatePost,
  deletePost,
  getMyPosts,
} from '../controllers/posts.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../validators/auth.validator';
import { createPostSchema, updatePostSchema } from '../validators/posts.validator';

const router = Router();

router.get('/', getPosts);
router.get('/mine', authenticate, getMyPosts);
router.get('/:slug', getPostBySlug);
router.post('/', authenticate, validate(createPostSchema), createPost);
router.put('/:id', authenticate, validate(updatePostSchema), updatePost);
router.delete('/:id', authenticate, deletePost);

export default router;

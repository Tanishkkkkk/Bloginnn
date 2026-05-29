import { Router } from 'express';
import { searchPosts } from '../controllers/posts.controller';

const router = Router();

router.get('/', searchPosts);

export default router;

import { Router } from 'express';
import { addBookmark, removeBookmark, getMyBookmarks } from '../controllers/bookmarks.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticate, getMyBookmarks);
router.post('/', authenticate, addBookmark);
router.delete('/:id', authenticate, removeBookmark);

export default router;

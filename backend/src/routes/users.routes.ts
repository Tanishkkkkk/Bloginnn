import { Router } from 'express';
import { getUserProfile, updateProfile, followUser } from '../controllers/users.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/:username', getUserProfile);
router.put('/profile', authenticate, updateProfile);
router.post('/:username/follow', authenticate, followUser);

export default router;

import { Router } from 'express';
import { clapPost } from '../controllers/claps.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authenticate, clapPost);

export default router;

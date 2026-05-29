import { Router } from 'express';
import { signup, login, logout, getMe, refreshToken } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authRateLimit } from '../middleware/rate-limit.middleware';
import { validate, signupSchema, loginSchema } from '../validators/auth.validator';

const router = Router();

router.post('/signup', authRateLimit, validate(signupSchema), signup);
router.post('/login', authRateLimit, validate(loginSchema), login);
router.post('/logout', logout);
router.get('/me', authenticate, getMe);
router.post('/refresh', refreshToken);

export default router;

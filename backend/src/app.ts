import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { globalRateLimit } from './middleware/rate-limit.middleware';
import { errorHandler, notFound } from './middleware/error.middleware';
import { env } from './config/env';

import authRoutes from './routes/auth.routes';
import postsRoutes from './routes/posts.routes';
import usersRoutes from './routes/users.routes';
import bookmarksRoutes from './routes/bookmarks.routes';
import clapsRoutes from './routes/claps.routes';
import searchRoutes from './routes/search.routes';

const app = express();

// Security
app.use(helmet());
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  }),
);

// Rate limiting
app.use(globalRateLimit);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/bookmarks', bookmarksRoutes);
app.use('/api/claps', clapsRoutes);
app.use('/api/search', searchRoutes);

// Error handling — must come last
app.use(notFound);
app.use(errorHandler);

export default app;

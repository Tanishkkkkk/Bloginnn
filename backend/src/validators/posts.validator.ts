import { z } from 'zod';

export const createPostSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    subtitle: z.string().optional(),
    content: z.string().min(1, 'Content is required'),
    tags: z.array(z.string()).optional().default([]),
    categoryId: z.string().uuid().optional(),
    thumbnail: z.string().url().optional(),
    seoDesc: z.string().max(160).optional(),
    status: z.enum(['DRAFT', 'PUBLISHED', 'SCHEDULED', 'ARCHIVED']).optional().default('DRAFT'),
    scheduledAt: z.string().datetime().optional(),
  }),
});

export const updatePostSchema = z.object({
  body: z.object({
    title: z.string().min(1).optional(),
    subtitle: z.string().optional(),
    content: z.string().min(1).optional(),
    tags: z.array(z.string()).optional(),
    categoryId: z.string().uuid().optional(),
    thumbnail: z.string().url().optional(),
    seoDesc: z.string().max(160).optional(),
    status: z.enum(['DRAFT', 'PUBLISHED', 'SCHEDULED', 'ARCHIVED']).optional(),
    scheduledAt: z.string().datetime().optional(),
  }),
});

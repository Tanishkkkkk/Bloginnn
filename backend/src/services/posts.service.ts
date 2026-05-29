import slugify from 'slugify';
import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/error.middleware';

const generateSlug = async (title: string): Promise<string> => {
  const base = slugify(title, { lower: true, strict: true });
  const existing = await prisma.post.findFirst({ where: { slug: { startsWith: base } } });
  if (!existing) return base;
  return `${base}-${Date.now()}`;
};

const estimateReadingTime = (content: string): number => {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
};

const postSelect = {
  id: true,
  title: true,
  slug: true,
  subtitle: true,
  content: true,
  thumbnail: true,
  status: true,
  tags: true,
  seoDesc: true,
  readingTime: true,
  publishedAt: true,
  createdAt: true,
  updatedAt: true,
  author: {
    select: { id: true, name: true, username: true, avatar: true, bio: true },
  },
  category: {
    select: { id: true, name: true, slug: true },
  },
  _count: {
    select: { claps: true, bookmarks: true, views: true },
  },
};

export const createPostService = async (
  authorId: string,
  data: {
    title: string;
    subtitle?: string;
    content: string;
    tags?: string[];
    categoryId?: string;
    thumbnail?: string;
    seoDesc?: string;
    status?: 'DRAFT' | 'PUBLISHED' | 'SCHEDULED' | 'ARCHIVED';
    scheduledAt?: string;
  },
) => {
  const slug = await generateSlug(data.title);
  const readingTime = estimateReadingTime(data.content);

  return prisma.post.create({
    data: {
      authorId,
      title: data.title,
      slug,
      subtitle: data.subtitle,
      content: data.content,
      tags: data.tags || [],
      categoryId: data.categoryId,
      thumbnail: data.thumbnail,
      seoDesc: data.seoDesc,
      status: data.status || 'DRAFT',
      readingTime,
      publishedAt: data.status === 'PUBLISHED' ? new Date() : undefined,
      scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : undefined,
    },
    select: postSelect,
  });
};

export const getPublishedPostsService = async (
  page = 1,
  limit = 10,
  category?: string,
  tag?: string,
) => {
  const skip = (page - 1) * limit;
  const where: any = { status: 'PUBLISHED' };
  if (category) where.category = { slug: category };
  if (tag) where.tags = { has: tag };

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      select: postSelect,
      orderBy: { publishedAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.post.count({ where }),
  ]);

  return { posts, total, page, limit, totalPages: Math.ceil(total / limit) };
};

export const getPostBySlugService = async (slug: string, viewerId?: string) => {
  const post = await prisma.post.findUnique({
    where: { slug },
    select: postSelect,
  });

  if (!post) throw new AppError('Post not found', 404);

  // Track view asynchronously - don't block response
  prisma.postView
    .create({
      data: { postId: post.id, viewerId: viewerId || null },
    })
    .catch(() => {});

  return post;
};

export const updatePostService = async (
  postId: string,
  authorId: string,
  data: {
    title?: string;
    subtitle?: string;
    content?: string;
    tags?: string[];
    categoryId?: string;
    thumbnail?: string;
    seoDesc?: string;
    status?: 'DRAFT' | 'PUBLISHED' | 'SCHEDULED' | 'ARCHIVED';
    scheduledAt?: string;
  },
) => {
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) throw new AppError('Post not found', 404);
  if (post.authorId !== authorId) throw new AppError('Not authorized to edit this post', 403);

  const updateData: any = { ...data };
  if (data.content) updateData.readingTime = estimateReadingTime(data.content);
  if (data.status === 'PUBLISHED' && post.status !== 'PUBLISHED') updateData.publishedAt = new Date();
  if (data.scheduledAt) updateData.scheduledAt = new Date(data.scheduledAt);

  return prisma.post.update({
    where: { id: postId },
    data: updateData,
    select: postSelect,
  });
};

export const deletePostService = async (postId: string, authorId: string) => {
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) throw new AppError('Post not found', 404);
  if (post.authorId !== authorId) throw new AppError('Not authorized', 403);
  await prisma.post.delete({ where: { id: postId } });
};

export const getUserPostsService = async (authorId: string) => {
  return prisma.post.findMany({
    where: { authorId },
    select: postSelect,
    orderBy: { createdAt: 'desc' },
  });
};

export const searchPostsService = async (query: string, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const where = {
    status: 'PUBLISHED' as const,
    OR: [
      { title: { contains: query, mode: 'insensitive' as const } },
      { subtitle: { contains: query, mode: 'insensitive' as const } },
      { tags: { has: query } },
    ],
  };

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      select: postSelect,
      skip,
      take: limit,
      orderBy: { publishedAt: 'desc' },
    }),
    prisma.post.count({ where }),
  ]);

  return { posts, total, page, limit, totalPages: Math.ceil(total / limit) };
};

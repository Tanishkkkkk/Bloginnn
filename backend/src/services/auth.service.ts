import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';
import { env } from '../config/env';
import { AppError } from '../middleware/error.middleware';

const generateTokens = (user: { id: string; email: string; role: string; username: string }) => {
  const accessToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role, username: user.username },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN } as jwt.SignOptions,
  );

  const refreshToken = jwt.sign(
    { id: user.id },
    env.JWT_REFRESH_SECRET,
    { expiresIn: env.JWT_REFRESH_EXPIRES_IN } as jwt.SignOptions,
  );

  return { accessToken, refreshToken };
};

export const signupService = async (data: {
  name: string;
  email: string;
  password: string;
  username: string;
}) => {
  const existingUser = await prisma.user.findFirst({
    where: { OR: [{ email: data.email }, { username: data.username }] },
  });

  if (existingUser) {
    if (existingUser.email === data.email) throw new AppError('Email already in use', 400);
    throw new AppError('Username already taken', 400);
  }

  const hashedPassword = await bcrypt.hash(data.password, 12);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      username: data.username,
      role: 'WRITER',
    },
    select: {
      id: true,
      name: true,
      email: true,
      username: true,
      role: true,
      avatar: true,
      bio: true,
      createdAt: true,
    },
  });

  const tokens = generateTokens({ id: user.id, email: user.email, role: user.role, username: user.username });
  return { user, tokens };
};

export const loginService = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.password) throw new AppError('Invalid credentials', 401);

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new AppError('Invalid credentials', 401);

  const tokens = generateTokens({ id: user.id, email: user.email, role: user.role, username: user.username });
  const { password: _, ...safeUser } = user;
  return { user: safeUser, tokens };
};

export const refreshTokenService = async (refreshToken: string) => {
  try {
    const decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as { id: string };
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) throw new AppError('User not found', 401);

    const tokens = generateTokens({ id: user.id, email: user.email, role: user.role, username: user.username });
    return tokens;
  } catch {
    throw new AppError('Invalid refresh token', 401);
  }
};

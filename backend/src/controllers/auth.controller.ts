import { Request, Response, NextFunction } from 'express';
import { signupService, loginService, refreshTokenService } from '../services/auth.service';
import { AuthRequest } from '../middleware/auth.middleware';
import { prisma } from '../lib/prisma';
import { env } from '../config/env';

const cookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const signup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { user, tokens } = await signupService(req.body);
    res.cookie('accessToken', tokens.accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });
    res.cookie('refreshToken', tokens.refreshToken, cookieOptions);
    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: { user, accessToken: tokens.accessToken },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { user, tokens } = await loginService(req.body.email, req.body.password);
    res.cookie('accessToken', tokens.accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });
    res.cookie('refreshToken', tokens.refreshToken, cookieOptions);
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: { user, accessToken: tokens.accessToken },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.status(200).json({ success: true, message: 'Logged out successfully' });
};

export const getMe = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
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
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) {
      res.status(401).json({ success: false, message: 'Refresh token required' });
      return;
    }
    const tokens = await refreshTokenService(token);
    res.cookie('accessToken', tokens.accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });
    res.status(200).json({ success: true, data: { accessToken: tokens.accessToken } });
  } catch (error) {
    next(error);
  }
};

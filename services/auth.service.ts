import { PrismaClient } from '@prisma/client';
import { hashPassword, comparePasswords } from '../utils/hash';
import { generateToken, verifyToken } from '../utils/jwt';
import crypto, { verify } from 'crypto';
import { sendResetEmail } from '../utils/mailer';
import { Request } from 'express';

const prisma = new PrismaClient();

export const registerUser = async (name: string, email: string, password: string,confirmPassword:string,province:string,district:string,sector:string,cell:string,village:string) => {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new Error('Email already registered');
  if(password != confirmPassword){
    throw new Error("Passwords mismatch!")
  }
  const hashed = await hashPassword(password);
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashed,
      role: 'CITIZEN',
      province,
      district,
      sector,
      cell,
      village,
    }
  });

  const token = generateToken(user.id, user.role);
  return { user, token };
};

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('Invalid credentials');

  const match = await comparePasswords(password, user.password);
  if (!match) throw new Error('Invalid credentials');

  const token = generateToken(user.id, user.role);
  return { user, token };
};

export const requestPasswordReset = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Email not found");

  // Check for existing unexpired token
  const existing = await prisma.passwordResetToken.findFirst({
    where: {
      email,
      expiresAt: { gt: new Date() },
    },
  });

  if (existing) {
    throw new Error("A reset token has already been sent. Please check your email.");
  }

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

  await prisma.passwordResetToken.create({
    data: {
      email,
      token,
      expiresAt,
    },
  });

  await sendResetEmail(email, token);
};


export const resetPasswordService = async (token: string, newPassword: string, confirmNewPassword: string) => {
  if (newPassword !== confirmNewPassword) {
    throw new Error("Passwords do not match");
  }

  const tokenEntry = await prisma.passwordResetToken.findUnique({
    where: { token },
  });

  if (!tokenEntry) {
    throw new Error("Invalid or expired token");
  }

  if (tokenEntry.expiresAt < new Date()) {
    // Cleanup expired token
    await prisma.passwordResetToken.delete({ where: { token } });
    throw new Error("Token has expired");
  }

  const hashedPassword = await hashPassword(newPassword);

  // Update user password
  await prisma.user.update({
    where: { email: tokenEntry.email },
    data: { password: hashedPassword },
  });

  // Remove used token
  await prisma.passwordResetToken.delete({ where: { token } });
};


export const getUserFromAccessOrRefresh = async (req: Request): Promise<null | { name: string; email: string; role: string; newAccessToken?: string }> => {
  try {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      throw new Error("No access token");
    }
      const decoded: any = verifyToken(accessToken);
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
      });
      if (user) return { name: user.name, email: user.email, role: user.role };
  } catch (err: any) {
    if (err.name !== 'TokenExpiredError') {
      return null;
    }
  }

  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return null;

  const storedToken = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
    include: { user: true },
  });

  if (!storedToken || new Date() > storedToken.expiresAt) return null;

  const newAccessToken = generateToken(storedToken.userId, storedToken.user.role);

  return {
    name: storedToken.user.name,
    email: storedToken.user.email,
    role: storedToken.user.role,
    newAccessToken,
  };
};

import { PrismaClient } from '@prisma/client';
import { hashPassword, comparePasswords } from '../utils/hash';
import { generateToken } from '../utils/jwt';
import crypto from 'crypto';
import { sendResetEmail } from '../utils/mailer';

const prisma = new PrismaClient();

export const registerUser = async (name: string, email: string, password: string,confirmPassword:string) => {
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
      role: 'CITIZEN'
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
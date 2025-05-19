import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";
const prisma = new PrismaClient();
export const generateToken = (userId: string, role: string) => {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: "15m" });
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      error.message = "Token has expired";
    } else if (error.name === "JsonWebTokenError") {
      error.message = "Invalid token";
    }
    throw error;
  }
};

export const generateRefreshToken = async (userId: string) => {
  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  const existing = await prisma.refreshToken.findFirst({
    where: { userId: userId },
  });

  if (existing) {
    await prisma.refreshToken.update({
      where: { id: existing.id },
      data: { token, expiresAt },
    });
  } else {
    await prisma.refreshToken.create({
      data: { token, userId, expiresAt },
    });
  }

  return token;
};

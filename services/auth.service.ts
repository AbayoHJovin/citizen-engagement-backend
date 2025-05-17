import { PrismaClient } from '@prisma/client';
import { hashPassword, comparePasswords } from '../utils/hash';
import { generateToken } from '../utils/jwt';

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

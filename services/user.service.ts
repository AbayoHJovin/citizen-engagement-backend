import { PrismaClient, Role, AdminstrationScope } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { hashPassword } from "../utils/hash";

const prisma = new PrismaClient();

export const createLeader = async (data: {
  name: string;
  email: string;
  adminstrationScope: AdminstrationScope;
  province?: string;
  district?: string;
  sector?: string;
  cell?: string;
  village?: string;
}) => {
  // Check if email already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });
  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  // Generate random password and hash it
  const randomPassword = uuidv4();
  const hashedPassword = await hashPassword(randomPassword);

  await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: Role.LEADER,
      adminstrationScope: AdminstrationScope[data.adminstrationScope],
      province: data.province,
      district: data.district,
      sector: data.sector,
      cell: data.cell,
      village: data.village,
    },
  });
};

export const getAllLeaders = async () => {
  return prisma.user.findMany({
    where: { role: Role.LEADER },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      adminstrationScope: true,
      province: true,
      district: true,
      sector: true,
      cell: true,
      village: true,
    },
  });
};
export const getLeaderById = async (id: string) => {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      adminstrationScope: true,
      province: true,
      district: true,
      sector: true,
      cell: true,
      village: true,
    },
  });
};
export const updateLeader = async (id: string, data: any) => {
  return prisma.user.update({
    where: { id },
    data,
  });
};

    
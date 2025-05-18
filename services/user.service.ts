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
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });
  if (existingUser) {
    throw new Error("User with this email already exists");
  }

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

export const showCitizenLeaders = async (id: string) => {
  const citizen = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      province: true,
      district: true,
      sector: true,
      cell: true,
      village: true,
    },
  });
  if (!citizen) throw new Error("Citizen not found");
  const villageLeader = await prisma.user.findFirst({
    where: {
      role: Role.LEADER,
      adminstrationScope: AdminstrationScope.VILLAGE,
      village: citizen.village,
    },
  });
  const cellLeader = await prisma.user.findFirst({
    where: {
      role: Role.LEADER,
      adminstrationScope: AdminstrationScope.CELL,
      cell: citizen.cell,
    },
  });
  const sectorLeader = await prisma.user.findFirst({
    where: {
      role: Role.LEADER,
      adminstrationScope: AdminstrationScope.SECTOR,
      sector: citizen.sector,
    },
  });
  const districtLeader = await prisma.user.findFirst({
    where: {
      role: Role.LEADER,
      adminstrationScope: AdminstrationScope.DISTRICT,
      district: citizen.district,
    },
  });
  const provinceLeader = await prisma.user.findFirst({
    where: {
      role: Role.LEADER,
      adminstrationScope: AdminstrationScope.PROVINCE,
      province: citizen.province,
    },
  });
  return {
    villageLeader,
    cellLeader,
    sectorLeader,
    districtLeader,
    provinceLeader,
  };
};

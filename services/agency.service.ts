import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createAgency = async (name: string, description?: string) => {
  return await prisma.agency.create({ data: { name, description } });
};

export const getAgencyById = async (id: string) => {
  return await prisma.agency.findUnique({
    where: { id },
    include: {
      categories: true,
    },
  });
};
export const updateAgency = async (id: string, name: string, description?: string) => {
  return await prisma.agency.update({
    where: { id },
    data: { name, description },
  });
};
export const deleteAgency = async (id: string) => {
  return await prisma.agency.delete({
    where: { id },
  });
};

export const getAllAgencies= async() => {
  return await prisma.agency.findMany({
    include: {
      categories: true,
    },
  });
}
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createAgency = async (name: string, description?: string) => {
  return await prisma.agency.create({ data: { name, description } });
};

export const addCategoryToAgency = async (agencyId: string, name: string) => {
  return await prisma.category.create({ data: { name, agencyId } });
};

export const getAllAgenciesWithCategories = async () => {
  return await prisma.agency.findMany({
    include: {
      categories: true,
    },
  });
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
export const deleteCategory = async (id: string) => {
  return await prisma.category.delete({
    where: { id },
  });
};
export const updateCategory = async (id: string, name: string) => {
  return await prisma.category.update({
    where: { id },
    data: { name },
  });
};
export const getCategoryById = async (id: string) => {
  return await prisma.category.findUnique({
    where: { id },
  });
};
export const getAllCategories = async () => {
  return await prisma.category.findMany();
};
export const getAllAgencies = async () => {
  return await prisma.agency.findMany();
};

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createResponse = async (responderId: string, complaintId: string, message: string) => {
  return prisma.response.create({
    data: {
      message,
      complaintId,
      responderId,
    },
  });
};

export const updateResponse = async (responseId: string, message: string,responderId:string) => {
  const response = await prisma.response.findUnique({
    where: { id: responseId, responderId },
  });
  if (!response) {
    throw new Error('Response not found or you do not have permission to update it');
  }
  return prisma.response.update({
    where: { id: responseId },
    data: { message },
  });
};

export const deleteResponse = async (responseId: string,responderId:string) => {
  const response = await prisma.response.findUnique({
    where: { id: responseId, responderId },
  });
  if (!response) {
    throw new Error('Response not found or you do not have permission to delete it');
  }
  return prisma.response.delete({
    where: { id: responseId },
  });
};

export const getAllResponses = async () => {
  return prisma.response.findMany({
    include: {
      complaint: true,
      responder: {
        select: {
          id: true,
          name: true,
          role: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const getResponseByComplaint = async (complaintId: string) => {
  return prisma.response.findFirst({
    where: { complaintId },
    include: {
      responder: true,
      complaint: true,
    },
  });
};

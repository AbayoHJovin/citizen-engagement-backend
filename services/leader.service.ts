import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const leaderSummaryService = async (leaderId: string) => {
  const leader = await prisma.user.findFirst({
    where: { id: leaderId },
  });
  if (!leader) {
    throw new Error("Leader not found");
  }
  if (leader.role !== "LEADER" || !leader.adminstrationScope) {
    throw new Error(
      "Only leaders with an adminstrationScope scope can access complaints"
    );
  }
  let filter: any = {};
  switch (leader.adminstrationScope) {
    case "PROVINCE":
      filter = { citizen: { province: leader.province } };
      break;
    case "DISTRICT":
      filter = { citizen: { district: leader.district } };
      break;
    case "SECTOR":
      filter = { citizen: { sector: leader.sector } };
      break;
    case "CELL":
      filter = { citizen: { cell: leader.cell } };
      break;
    case "VILLAGE":
      filter = { citizen: { village: leader.village } };
      break;
  }
  const totalComplaints = await prisma.complaint.count({
    where: filter,
  });
  const totalResolved = await prisma.complaint.count({
    where: {
      ...filter,
      status: "RESOLVED",
    },
  });
  const totalPending = await prisma.complaint.count({
    where: {
      ...filter,
      status: "PENDING",
    },
  });
  const totalRejected = await prisma.complaint.count({
    where: {
      ...filter,
      status: "REJECTED",
    },
  });
  return {
    totalComplaints,
    totalResolved,
    totalPending,
    totalRejected,
  };
};

export const showLeaderHisCitizensService = async (leaderId: string) => {
  const leader = await prisma.user.findUnique({
    where: { id: leaderId },
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
  if (!leader) throw new Error("Leader not found");
  const citizens = await prisma.user.findMany({
    where: {
      role: "CITIZEN",
      OR: [
        { province: leader.province },
        { district: leader.district },
        { sector: leader.sector },
        { cell: leader.cell },
        { village: leader.village },
      ],
    },
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
  return citizens;
};

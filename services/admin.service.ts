import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const adminSummary = async () => {
  const totalLeaders = await prisma.user.count({
    where: { role: "LEADER" },
  });
    const totalCitizens = await prisma.user.count({
        where: { role: "CITIZEN" },
    }); 
    const totalAdmins = await prisma.user.count({
        where: { role: "ADMIN" },
    });
  const totalComplaints = await prisma.complaint.count();
  const totalResolved = await prisma.complaint.count({
    where: { status: "RESOLVED" },
  });
  const totalPending = await prisma.complaint.count({
    where: { status: "PENDING" },
  });
  const totalRejected = await prisma.complaint.count({
    where: { status: "REJECTED" },
  });

  return {
    totalComplaints,
    totalResolved,
    totalPending,
    totalRejected,
    totalLeaders,
    totalCitizens,
    totalAdmins,
  };
}

// getting the top 5 most active leaders with many responses

export const getTopLeaders = async () => {
    const leaders = await prisma.user.findMany({
        where: { role: "LEADER" },
        include: {
        responses: {
            select: {
            id: true,
            createdAt: true,
            },
        },
        },
        orderBy: {
        responses: {
            _count: "desc",
        },
        },
        take: 5,
    });
    
    return leaders.map((leader) => ({
        id: leader.id,
        name: leader.name,
        email: leader.email,
        totalResponses: leader.responses.length,
    }));
    }
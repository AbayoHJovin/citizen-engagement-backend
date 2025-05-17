import { PrismaClient, ComplaintStatus } from "@prisma/client";

const prisma = new PrismaClient();

export const createComplaint = async (
  citizenId: string,
  title: string,
  description: string
) => {
  return prisma.complaint.create({
    data: {
      title,
      description,
      citizenId,
    },
  });
};

export const getMyComplaints = async (citizenId: string) => {
  return prisma.complaint.findMany({
    where: { citizenId },
    orderBy: { createdAt: "desc" },
  });
};

export const updateComplaint = async (
  complaintId: string,
  citizenId: string,
  data: { title?: string; description?: string }
) => {
  const complaint = await prisma.complaint.findUnique({
    where: { id: complaintId },
  });

  if (!complaint || complaint.citizenId !== citizenId)
    throw new Error("Not found or not authorized");

  if (complaint.status !== ComplaintStatus.PENDING)
    throw new Error("Only pending complaints can be updated");

  return prisma.complaint.update({
    where: { id: complaintId },
    data,
  });
};

export const deleteComplaint = async (
  complaintId: string,
  citizenId: string
) => {
  const complaint = await prisma.complaint.findUnique({
    where: { id: complaintId },
  });

  if (!complaint || complaint.citizenId !== citizenId)
    throw new Error("Not found or not authorized");

  if (complaint.status !== ComplaintStatus.PENDING)
    throw new Error("Only pending complaints can be deleted");

  return prisma.complaint.delete({ where: { id: complaintId } });
};
export const getComplaintById = async (complaintId: string) => {
  return prisma.complaint.findUnique({ where: { id: complaintId } });
};

export const getAllComplaints = async () => {
  return prisma.complaint.findMany({
    orderBy: { createdAt: "desc" },
  });
};

export const getComplaintsInMyRegion = async (leaderId: string) => {
  const leader = await prisma.user.findFirst({
    where: { id: leaderId },
  });
    if (!leader) {
        throw new Error("Leader not found");
    }

  if (leader.role !== "LEADER" || !leader.adminstrationScope) {
    throw new Error(
      "Only leaders with an administration scope can access complaints"
    );
  }

  let filter = {};

  switch (leader.adminstrationScope) {
    case "PROVINCE":
      filter = { user: { province: leader.province } };
      break;
    case "DISTRICT":
      filter = { user: { district: leader.district } };
      break;
    case "SECTOR":
      filter = { user: { sector: leader.sector } };
      break;
    case "CELL":
      filter = { user: { cell: leader.cell } };
      break;
    case "VILLAGE":
      filter = { user: { village: leader.village } };
      break;
  }
const complaints = await prisma.complaint.findMany({
  where: filter,
  include: {
    citizen: {
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
    },
  },
});
return complaints
};
export const changeComplaintStatus = async (
    complaintId: string,
    status: ComplaintStatus,
    ) => {
    const complaint = await prisma.complaint.findUnique({
        where: { id: complaintId },
    });
    
    if (!complaint) throw new Error("Complaint not found");

    return prisma.complaint.update({
        where: { id: complaintId },
        data: {
        status,
        },
    });
    }

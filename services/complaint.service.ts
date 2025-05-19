import { PrismaClient } from "@prisma/client";
import { extractCloudinaryPublicId } from "../functions/extractCloudinaryPublicId ";
import { v2 as cloudinary } from "cloudinary";

const prisma = new PrismaClient();

// Define ComplaintStatus enum to match Prisma schema
enum ComplaintStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  RESOLVED = "RESOLVED",
  REJECTED = "REJECTED",
}

export const createComplaint = async (
  citizenId: string,
  title: string,
  description: string,
  imageUrls: string[] = []
) => {
  const citizen = await prisma.user.findUnique({
    where: { id: citizenId },
  });
  if (!citizen) throw new Error("Citizen not found");
  const complaint = await prisma.complaint.create({
    data: {
      title,
      description,
      citizenId,
    },
  });

  if (imageUrls.length > 0) {
    await prisma.image.createMany({
      data: imageUrls.map((url) => ({
        url,
        complaintId: complaint.id,
      })),
    });
  }

  return prisma.complaint.findUnique({
    where: { id: complaint.id },
    include: {
      images: true,
    },
  });
};

export const getMyComplaints = async (citizenId: string) => {
  return prisma.complaint.findMany({
    where: { citizenId },
    orderBy: { createdAt: "desc" },
    include: {
      images: true,
    },
  });
};

export const updateComplaint = async (
  complaintId: string,
  citizenId: string,
  data: {
    title?: string;
    description?: string;
    newImages?: string[];
    imagesToRemove?: string[];
  }
) => {
  const complaint = await prisma.complaint.findUnique({
    where: { id: complaintId },
    include: { images: true },
  });

  if (!complaint || complaint.citizenId !== citizenId)
    throw new Error("Not found or not authorized");

  if (complaint.status !== ComplaintStatus.PENDING)
    throw new Error("Only pending complaints can be updated");

  // Handle image removals if specified
  if (data.imagesToRemove && data.imagesToRemove.length > 0) {
    // Find the images to delete
    const imagesToDelete = await prisma.image.findMany({
      where: {
        id: { in: data.imagesToRemove },
        complaintId: complaintId,
      },
    });

    // Delete images from Cloudinary
    for (const image of imagesToDelete) {
      const publicId = extractCloudinaryPublicId(image.url);
      if (publicId) {
        try {
          await cloudinary.uploader.destroy(publicId);
        } catch (e) {
          console.error(`Failed to delete image ${publicId}:`, e);
        }
      }
    }

    // Delete images from database
    await prisma.image.deleteMany({
      where: {
        id: { in: data.imagesToRemove },
        complaintId: complaintId,
      },
    });
  }

  // Add new images if provided
  if (data.newImages && data.newImages.length > 0) {
    await prisma.image.createMany({
      data: data.newImages.map((url) => ({
        url,
        complaintId,
      })),
    });
  }

  // Update complaint fields
  const updateData: { title?: string; description?: string } = {};
  if (data.title !== undefined) updateData.title = data.title;
  if (data.description !== undefined) updateData.description = data.description;

  // Only update if there are fields to update
  if (Object.keys(updateData).length > 0) {
    await prisma.complaint.update({
      where: { id: complaintId },
      data: updateData,
    });
  }

  // Return the updated complaint with images
  return prisma.complaint.findUnique({
    where: { id: complaintId },
    include: { images: true },
  });
};

export const deleteComplaint = async (
  complaintId: string,
  citizenId: string
) => {
  const complaint = await prisma.complaint.findUnique({
    where: { id: complaintId },
    include: { images: true },
  });

  if (!complaint || complaint.citizenId !== citizenId)
    throw new Error("Not found or not authorized");

  if (complaint.status !== ComplaintStatus.PENDING)
    throw new Error("Only pending complaints can be deleted");

  // 1. Delete images from Cloudinary
  for (const image of complaint.images) {
    const publicId = extractCloudinaryPublicId(image.url);
    if (publicId) {
      try {
        await cloudinary.uploader.destroy(publicId);
      } catch (e) {
        console.error(`Failed to delete image ${publicId}:`, e);
      }
    }
  }

  // 2. Delete the complaint (images will be cascade-deleted from DB)
  return prisma.complaint.delete({ where: { id: complaintId } });
};

export const getComplaintById = async (complaintId: string) => {
  return prisma.complaint.findUnique({
    where: { id: complaintId },
    include: {
      images: true,
      citizen: {
        select: {
          id: true,
          name: true,
          email: true,
          province: true,
          district: true,
          sector: true,
          cell: true,
          village: true,
        },
      },
      responses: {
        include: {
          responder: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });
};

export const getAllComplaints = async () => {
  return prisma.complaint.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      images: true,
      citizen: true,
    },
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

  return prisma.complaint.findMany({
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
      images: true,
    },
  });
};

export const changeComplaintStatus = async (
  complaintId: string,
  status: ComplaintStatus
) => {
  const complaint = await prisma.complaint.findUnique({
    where: { id: complaintId },
  });

  if (!complaint) throw new Error("Complaint not found");

  return prisma.complaint.update({
    where: { id: complaintId },
    data: { status },
    include: { images: true },
  });
};

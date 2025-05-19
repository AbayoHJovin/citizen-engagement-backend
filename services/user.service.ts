import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { hashPassword } from "../utils/hash";

const prisma = new PrismaClient();

// Define enums to match Prisma schema
enum Role {
  CITIZEN = "CITIZEN",
  ADMIN = "ADMIN",
  LEADER = "LEADER",
}

enum AdminstrationScope {
  PROVINCE = "PROVINCE",
  DISTRICT = "DISTRICT",
  SECTOR = "SECTOR",
  CELL = "CELL",
  VILLAGE = "VILLAGE",
}

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
      createdAt: true,
    },
  });
};

export const updateLeader = async (id: string, data: any) => {
  // First, get the current leader data
  const currentLeader = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      adminstrationScope: true,
      province: true,
      district: true,
      sector: true,
      cell: true,
      village: true,
    },
  });

  if (!currentLeader) {
    throw new Error("Leader not found");
  }

  const isAdminScopeUpdated = data.adminstrationScope !== undefined;
  const isProvinceUpdated = data.province !== undefined;
  const isDistrictUpdated = data.district !== undefined;
  const isSectorUpdated = data.sector !== undefined;
  const isCellUpdated = data.cell !== undefined;
  const isVillageUpdated = data.village !== undefined;

  const isAnyAdminDataUpdated =
    isAdminScopeUpdated ||
    isProvinceUpdated ||
    isDistrictUpdated ||
    isSectorUpdated ||
    isCellUpdated ||
    isVillageUpdated;

  // Only perform duplicate check if administrative data is being updated
  if (isAnyAdminDataUpdated) {
    // Determine which scope is being used (either updated or current)
    const updatingScope =
      data.adminstrationScope || currentLeader.adminstrationScope;

    // Build the area query based on the administrative scope
    const areaQuery: any = {};

    if (updatingScope === AdminstrationScope.PROVINCE) {
      // Use updated province if provided, otherwise use current
      const provinceToCheck = isProvinceUpdated
        ? data.province
        : currentLeader.province;
      if (provinceToCheck) {
        areaQuery.province = provinceToCheck;
      }
    } else if (updatingScope === AdminstrationScope.DISTRICT) {
      const districtToCheck = isDistrictUpdated
        ? data.district
        : currentLeader.district;
      if (districtToCheck) {
        areaQuery.district = districtToCheck;
      }
    } else if (updatingScope === AdminstrationScope.SECTOR) {
      const sectorToCheck = isSectorUpdated
        ? data.sector
        : currentLeader.sector;
      if (sectorToCheck) {
        areaQuery.sector = sectorToCheck;
      }
    } else if (updatingScope === AdminstrationScope.CELL) {
      const cellToCheck = isCellUpdated ? data.cell : currentLeader.cell;
      if (cellToCheck) {
        areaQuery.cell = cellToCheck;
      }
    } else if (updatingScope === AdminstrationScope.VILLAGE) {
      const villageToCheck = isVillageUpdated
        ? data.village
        : currentLeader.village;
      if (villageToCheck) {
        areaQuery.village = villageToCheck;
      }
    }

    // Only check for duplicates if we have area data to check against
    if (Object.keys(areaQuery).length > 0) {
      // Check if another leader exists with the same scope in the same area
      const existingLeader = await prisma.user.findFirst({
        where: {
          id: { not: id }, // Exclude the current leader
          role: Role.LEADER,
          adminstrationScope: updatingScope,
          ...areaQuery,
        },
      });

      if (existingLeader) {
        throw new Error(
          `Another leader with the same administrative scope already exists in this ${updatingScope.toLowerCase()}`
        );
      }
    }
  }

  // If no duplicate found or no admin data being updated, proceed with the update
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

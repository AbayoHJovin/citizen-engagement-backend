// utils/user.dto.ts

export interface UserDTO {
  id: string;
  name: string;
  email: string;
  role: string;
  province?: string;
  district?: string;
  sector?: string;
  cell?: string;
  village?: string;
  adminstrationScope?: string;
}

export const toUserDTO = (user: any): UserDTO => {
  return {
    id: user.user.id,
    name: user.user.name,
    email: user.user.email,
    role: user.user.role,
    province: user.user.province,
    district: user.user.district,
    sector: user.user.sector,
    cell: user.user.cell,
    village: user.user.village,
    adminstrationScope: user.user.adminstrationScope,
  };
};

export const newUserDto = (user: any): UserDTO => {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    province: user.province,
    district: user.district,
    sector: user.sector,
    cell: user.cell,
    village: user.village,
    adminstrationScope: user.adminstrationScope,
  };
};

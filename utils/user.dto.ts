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

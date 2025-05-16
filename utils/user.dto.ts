// utils/user.dto.ts

export interface UserDTO {
  name: string;
  email: string;
  role: string;
}

export const toUserDTO = (user: any): UserDTO => {
    console.log(user.user.name)
  return {
    name: user.user.name,
    email: user.user.email,
    role: user.user.role,
  };
};

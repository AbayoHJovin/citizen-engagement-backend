import { Request, Response } from "express";
import {
  registerUser,
  loginUser,
  requestPasswordReset,
  resetPasswordService,
  getUserFromAccessOrRefresh,
  logoutService,
  updateUser,
} from "../services/auth.service";
import { newUserDto, toUserDTO } from "../utils/user.dto";
import { generateRefreshToken, generateToken } from "../utils/jwt";
interface Address {
  province: string;
  district: string;
  sector: string;
  cell: string;
  village: string;
}

export const register = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password, confirmPassword, address } = req.body;
  const { province, district, sector, cell, village } = address;
  try {
    if (
      !name ||
      !email ||
      !password ||
      !confirmPassword ||
      !address ||
      !province ||
      !district ||
      !sector ||
      !cell ||
      !village
    ) {
      res
        .status(400)
        .json({ message: "Name, email, and password are required" });
      return;
    }

    const user = await registerUser(
      name,
      email,
      password,
      confirmPassword,
      province,
      district,
      sector,
      cell,
      village
    );
    const userDTO = toUserDTO(user);
    res.status(201).json({
      message: "Registration successful. Please login to receive your token.",
      user: userDTO,
      loginUrl: "/api/auth/login",
    });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  try {
    const user = await loginUser(email, password);
    const userDTO = toUserDTO(user);

    const accessToken = generateToken(user.user.id, user.user.role);
    const refreshToken = await generateRefreshToken(user.user.id);

    // Set cookies
    // res.cookie("accessToken", accessToken, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   sameSite: "strict",
    //   maxAge: 15 * 60 * 1000, // 15 minutes
    // });
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 30 * 60 * 1000,
      path: "/",
    });

    // res.cookie("refreshToken", refreshToken, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   sameSite: "strict",
    //   // secure: true, // Must be true when sameSite is 'none'
    //   // sameSite: "none",
    //   maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    // });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
      path: "/",
    });

    res.status(200).json({ user: userDTO });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const updateTheUser = async (req: Request, res: Response) => {
  const { name, address } = req.body;
  const { province, district, sector, cell, village } = address || {};
  const userId = req.user?.id || "";

  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
  }

  const hasAtLeastOneField =
    name || province || district || sector || cell || village;
  if (!hasAtLeastOneField) {
    res
      .status(400)
      .json({ message: "At least one field must be provided to update." });
  }

  try {
    const updateData: any = {};

    if (name) updateData.name = name;

    if (province || district || sector || cell || village) {
      if (province) updateData.province = province;
      if (district) updateData.district = district;
      if (sector) updateData.sector = sector;
      if (cell) updateData.cell = cell;
      if (village) updateData.village = village;
    }

    const updatedUser = updateUser(userId, updateData);
    if (!updatedUser) {
      res.status(404).json({ message: "User not found" });
    }
    const convertedUser = newUserDto(updatedUser);
    res.json(convertedUser);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) res.status(400).json({ message: "Email is required" });

    await requestPasswordReset(email);

    res.status(200).json({ message: "Reset token sent to your email" });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const { token, newPassword, confirmNewPassword } = req.body;

  if (!token || !newPassword || !confirmNewPassword) {
    res.status(400).json({ message: "All fields are required" });
  }

  try {
    await resetPasswordService(token, newPassword, confirmNewPassword);
    res.status(200).json({ message: "Password reset successfully" });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getCurrentUser = async (req: Request, res: Response) => {
  const result = await getUserFromAccessOrRefresh(req);

  if (!result) {
    res.status(401).json({ message: "Unauthorized. Please log in again." });
    return;
  }

  if (result.newAccessToken) {
    // res.cookie("accessToken", result.newAccessToken, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   sameSite: "strict",
    //   // secure: true,
    //   // sameSite: "none",
    //   maxAge: 15 * 60 * 1000, // 15 minutes
    // });
    res.cookie("accessToken", result.newAccessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 15 * 60 * 1000,
      path: "/",
    });
  }
  res.json({
    name: result.name,
    email: result.email,
    role: result.role,
    province: result.province,
    district: result.district,
    sector: result.sector,
    cell: result.cell,
    village: result.village,
    adminstrationScope: result.adminstrationScope,
    id: result.id,
  });
};

export const logout = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;

  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
  });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
  });

  if (refreshToken) {
    try {
      await logoutService(refreshToken);
    } catch (error) {
      // Continue with logout even if token deletion fails
      console.error("Error during logout:", error);
    }
  }

  res.status(200).json({ message: "Logged out successfully" });
};

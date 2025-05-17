import { Request, Response } from "express";
import {
  registerUser,
  loginUser,
  requestPasswordReset,
  resetPasswordService,
  getUserFromAccessOrRefresh,
} from "../services/auth.service";
import { toUserDTO } from "../utils/user.dto";
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
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      // sameSite: "strict",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
      // sameSite: "strict",
      secure: true, // Must be true when sameSite is 'none'
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Return only user info
    res.status(200).json({ user: userDTO });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
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
    res.cookie("accessToken", result.newAccessToken, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
      // sameSite: "strict",
      secure: true, // Must be true when sameSite is 'none'
      sameSite: "none",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });
  }
  res.json({ name: result.name, email: result.email, role: result.role });
};

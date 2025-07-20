import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { verifyRefreshToken } from "../services/auth.service";
import { generateToken } from "../utils/jwt";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
      };
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET || "";

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const accessToken = req.cookies?.accessToken;
    if (accessToken) {
      try {
        const decoded = jwt.verify(accessToken, JWT_SECRET) as JwtPayload;
        req.user = {
          id: decoded.userId,
          role: decoded.role,
        };

        next();
        return;
      } catch (error: any) {
        // Handle access token verification errors separately
        if (error.name === "TokenExpiredError") {
          // Don't log token expiration as an error, it's an expected condition
          console.log("Access token expired, attempting to use refresh token");
        } else {
          // Log other JWT errors
          console.error("Access token error:", error.name);
        }
        // Continue to refresh token flow
      }
    }

    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      res.status(401).json({ message: "Not authenticated. Please log in." });
      return;
    }

    try {
      const user = await verifyRefreshToken(refreshToken);

      const newAccessToken = generateToken(user.id, user.role);
      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
      });

      req.user = {
        id: user.id,
        role: user.role,
      };

      next();
    } catch (refreshError) {
      console.error(
        "Refresh token error:",
        (refreshError as Error).name || "Unknown error"
      );
      res
        .status(401)
        .json({ message: "Session expired. Please log in again." });
    }
  } catch (err) {
    // This is now a catch-all for any other errors
    console.error("Authentication middleware error:", err);
    res
      .status(500)
      .json({ message: "Internal server error during authentication." });
  }
};

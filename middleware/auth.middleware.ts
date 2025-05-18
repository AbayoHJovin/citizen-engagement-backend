// import { Request, Response, NextFunction } from "express";
// import jwt, { JwtPayload } from "jsonwebtoken";

// declare global {
//   namespace Express {
//     interface Request {
//       user?: {
//         id: string;
//         role: string;
//       };
//     }
//   }
// }

// const JWT_SECRET = process.env.JWT_SECRET || "";

// export const protect = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): void => {
//   const token = req.cookies?.accessToken;
//   if (!token) {
//     res.status(401).json({ message: "Not authenticated" });
//     return;
//   }

//   try {
//     const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

//     req.user = {
//       id: decoded.userId as string,
//       role: decoded.role as string,
//     };

//     next();
//   } catch (err) {
//     res.status(401).json({ message: "Invalid token" });
//   }
// };



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

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const accessToken = req.cookies?.accessToken;
    if (accessToken) {
      const decoded = jwt.verify(accessToken, JWT_SECRET) as JwtPayload;
      req.user = {
        id: decoded.userId,
        role: decoded.role,
      };

      next();
      return;
    }

    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      res.status(401).json({ message: "Not authenticated. Please log in." });
      return;
    }

    const user = await verifyRefreshToken(refreshToken);

    const newAccessToken = generateToken(user.id, user.role);
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    req.user = {
      id: user.id,
      role: user.role,
    };

    next();
  } catch (err) {
    console.error("Auth error:", err);
    res.status(401).json({ message: "Unauthorized. Token invalid or expired." });
  }
};

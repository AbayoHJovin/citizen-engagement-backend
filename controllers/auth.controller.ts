import { Request, Response } from 'express';
import { registerUser, loginUser } from '../services/auth.service';
import { toUserDTO } from '../utils/user.dto';
import { generateRefreshToken, generateToken } from '../utils/jwt';

export const register = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body;
  try {
    if (!name || !email || !password) {
      res.status(400).json({ message: 'Name, email, and password are required' });
      return;
    }

    const user = await registerUser(name, email, password);
    const userDTO = toUserDTO(user);
    res.status(201).json({
      message: 'Registration successful. Please login to receive your token.',
      user: userDTO,
      loginUrl: '/api/auth/login'
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

    const accessToken = generateToken(user.user.id,user.user.role);
    const refreshToken = await generateRefreshToken(user.user.id);

    // Set cookies
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Return only user info
    res.status(200).json({ user: userDTO });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
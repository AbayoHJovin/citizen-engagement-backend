import { Request, Response, NextFunction } from 'express';

export const requireRole = (role: 'CITIZEN' | 'LEADER' | 'ADMIN') => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || req.user.role !== role) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }
    next();
  };
};
export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'ADMIN') {
    res.status(403).json({ message: 'Access denied' });
    return;
  }
  next();
};
export const requireLeader = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'LEADER') {
    res.status(403).json({ message: 'Access denied' });
    return;
  }
  next();
};


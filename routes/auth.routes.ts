import { Router } from 'express';
import { register, login, forgotPassword, resetPassword, getCurrentUser, logout, updateTheUser } from '../controllers/auth.controller';
import { registerValidationRules, validate } from '../middleware/validation';
import { protect } from '../middleware/auth.middleware';

const router = Router();

router.post('/register', registerValidationRules, validate, register);
router.post('/login', login);
router.put('/update',protect, updateTheUser)
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get('/me', getCurrentUser);
router.post("/logout",logout)
export default router;
    
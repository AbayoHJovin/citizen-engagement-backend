import { Router } from 'express';
import { register, login, forgotPassword, resetPassword } from '../controllers/auth.controller';
import { registerValidationRules, validate } from '../middleware/validation';

const router = Router();

router.post('/register', registerValidationRules, validate, register);
router.post('/login', login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
export default router;

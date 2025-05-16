import { Router } from 'express';
import { register, login } from '../controllers/auth.controller';
import { registerValidationRules, validate } from '../middleware/validation';

const router = Router();

router.post('/register', registerValidationRules, validate, register);
router.post('/login', login);

export default router;

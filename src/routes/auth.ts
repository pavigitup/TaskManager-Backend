import { Router } from 'express';
import { register, login, getMe } from '../controllers/authController';
import { authenticate, authorizeAdmin } from '../middleware/auth';
import { validate, registerSchema, loginSchema } from '../middleware/validation';
import { getUsers } from '../controllers/adminController';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.get('/me', authenticate, getMe);
router.get('/users', authenticate, authorizeAdmin, getUsers);

export default router;
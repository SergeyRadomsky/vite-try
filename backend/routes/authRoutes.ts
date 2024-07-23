import { Router } from 'express';
import { registerUser, loginUser } from '../controllers/authController';

const router = Router();

router.post('/registration', registerUser);
router.post('/login', loginUser);

export default router;

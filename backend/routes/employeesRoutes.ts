// routes/employeesRoutes.ts
import { Router } from 'express';
import { getEmployees, createEmployee } from '../controllers/employeesController';

const router = Router();

router.get('/', getEmployees);
router.post('/', createEmployee);

export default router;

import { Router } from 'express';
import { getEmployees, createEmployee, updateEmployee, deleteEmployee } from '../controllers/employeesController';

const router = Router();

router.get('/', getEmployees);
router.post('/', createEmployee);
router.put('/:employeeid', updateEmployee);
router.delete('/:employeeid', deleteEmployee);

export default router;

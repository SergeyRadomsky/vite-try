import { Router } from 'express';
import { getEmployees, createEmployee, updateEmployee, deleteEmployee } from '../controllers/employeesController';
import authentication from '../middlewares/authentication';

const router = Router();

router.get('/', authentication, getEmployees);
router.post('/', createEmployee);
router.put('/:employeeid', updateEmployee);
router.delete('/:employeeid', deleteEmployee);

export default router;

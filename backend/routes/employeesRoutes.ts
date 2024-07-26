import { Router } from 'express';
import { getEmployees, createEmployee, updateEmployee, deleteEmployee } from '../controllers/employeesController';
import authentication from '../middlewares/authentication';

const router = Router();

// router.get('/', getEmployees);
router.get('/', authentication, getEmployees);
router.post('/', authentication, createEmployee);
router.put('/:employeeid', authentication, updateEmployee);
router.delete('/:employeeid', authentication, deleteEmployee);

export default router;

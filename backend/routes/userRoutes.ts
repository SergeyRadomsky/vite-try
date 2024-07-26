import { Router } from 'express';
import { getUsers, createUser, updateUser, deleteUser } from '../controllers/userController';
import authentication from '../middlewares/authentication';

const router = Router();

router.get('/', authentication, getUsers);
router.post('/',authentication,  createUser);
router.put('/:id',authentication,  updateUser);
router.delete('/:id', authentication, deleteUser);

export default router;

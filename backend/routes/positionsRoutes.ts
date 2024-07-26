// routes/positionsRoutes.ts
import { Router } from 'express';
import { getPositions, getPositionById, createPosition, deletePosition, updatePosition } from '../controllers/positionsController';
import authentication from '../middlewares/authentication';

const router = Router();

router.get('/', authentication, getPositions);
router.get('/:id', authentication, getPositionById);
router.post('/', authentication, createPosition);
router.delete('/:id', authentication, deletePosition);
router.put('/:id', authentication, updatePosition);

export default router;

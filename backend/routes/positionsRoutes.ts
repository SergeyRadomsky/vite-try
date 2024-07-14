// routes/positionsRoutes.ts
import { Router } from 'express';
import { getPositions, getPositionById, createPosition, deletePosition, updatePosition } from '../controllers/positionsController';

const router = Router();

router.get('/', getPositions);
router.get('/:id', getPositionById);
router.post('/', createPosition);
router.delete('/:id', deletePosition);
router.put('/:id', updatePosition);

export default router;
